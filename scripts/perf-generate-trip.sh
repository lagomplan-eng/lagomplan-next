#!/usr/bin/env bash
#
# scripts/perf-generate-trip.sh
#
# Time an /api/generate-trip call against production (or a custom URL).
# Useful for spotting regressions in generation latency and verifying
# that mitigations actually moved the needle.
#
# ┌──────────────────────────────────────────────────────────────────┐
# │  WARNING — each invocation burns one real Anthropic generation.  │
# │  At Sonnet 4.6 prices an 8-day trip is roughly $0.05–0.20.       │
# │  Do NOT loop this in CI. On-demand diagnostic only.              │
# └──────────────────────────────────────────────────────────────────┘
#
# Usage:
#   bash scripts/perf-generate-trip.sh                   # 8-day MEX, prod
#   NIGHTS=14 bash scripts/perf-generate-trip.sh         # 14-day variant
#   BASE_URL=https://lagomplan-staging.vercel.app \
#     bash scripts/perf-generate-trip.sh                 # staging
#   RUNS=3 bash scripts/perf-generate-trip.sh            # 3 sequential runs
#
# Knobs (env vars, all optional):
#   BASE_URL       default https://www.lagomplan.com
#   DESTINATION    default "Mexico City"
#   ORIGIN         default "Madrid"
#   NIGHTS         default 7   (= 8 days)
#   TRAVELER       default "pareja"
#   PACE           default "balanced"
#   LOCALE         default "es"
#   RUNS           default 1
#
# Output: per-run status code + wall time, then a median across runs.

set -euo pipefail

BASE_URL="${BASE_URL:-https://www.lagomplan.com}"
DESTINATION="${DESTINATION:-Mexico City}"
ORIGIN="${ORIGIN:-Madrid}"
NIGHTS="${NIGHTS:-7}"
TRAVELER="${TRAVELER:-pareja}"
PACE="${PACE:-balanced}"
LOCALE="${LOCALE:-es}"
RUNS="${RUNS:-1}"

DURATION_DAYS=$((NIGHTS + 1))
# Date window: tomorrow → tomorrow+NIGHTS. Anchoring on `date` keeps
# the script self-contained without needing a checked-in calendar.
START=$(date -u -v+1d +%Y-%m-%d 2>/dev/null || date -u -d "+1 day" +%Y-%m-%d)
END=$(date -u -v+1d -v+"${NIGHTS}"d +%Y-%m-%d 2>/dev/null || \
      date -u -d "+$((NIGHTS + 1)) day" +%Y-%m-%d)

URL="${BASE_URL%/}/api/generate-trip"

# Payload mirrors what TripResult.tsx:1694 sends. No `traveler_details`,
# no `segments` — keep this single-city so the timing isn't influenced
# by multi-segment Edge Function chunking.
PAYLOAD=$(cat <<EOF
{
  "destination":   "${DESTINATION}",
  "origin":        "${ORIGIN}",
  "start":         "${START}",
  "end":           "${END}",
  "nights":        "${NIGHTS}",
  "duration_days": ${DURATION_DAYS},
  "traveler":      "${TRAVELER}",
  "pace":          "${PACE}",
  "interests":     [],
  "budget":        "",
  "locale":        "${LOCALE}"
}
EOF
)

echo "─── perf-generate-trip ─────────────────────────────────────────"
echo "URL:         ${URL}"
echo "Destination: ${DESTINATION}  (${ORIGIN} → ${DESTINATION})"
echo "Trip:        ${NIGHTS} nights / ${DURATION_DAYS} days   ${START} → ${END}"
echo "Runs:        ${RUNS}"
echo "────────────────────────────────────────────────────────────────"

TIMES=()
for ((i=1; i<=RUNS; i++)); do
  printf "Run %d/%d ... " "$i" "$RUNS"

  # `-w` writes a final summary line we parse for status + total time.
  # Body goes to /dev/null since we only care about timing here; a 200
  # body for an 8-day trip can be 30-50 KB and would just spam the log.
  RESPONSE=$(curl -sS -o /dev/null \
    -w '%{http_code} %{time_total}\n' \
    -X POST "${URL}" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "${PAYLOAD}" \
    --max-time 240 \
    || echo "000 -1")

  STATUS=$(echo "${RESPONSE}" | awk '{print $1}')
  ELAPSED=$(echo "${RESPONSE}" | awk '{print $2}')

  # Tag the kind of failure so a sweep of red runs reads at-a-glance.
  TAG=""
  case "${STATUS}" in
    200)        TAG="✓ OK" ;;
    402)        TAG="✗ paywall (anon quota exhausted? clear cookies)" ;;
    401)        TAG="✗ unauthorized" ;;
    429)        TAG="✗ rate limited" ;;
    502)        TAG="✗ edge upstream failure (Claude 5xx/529 via the Edge Fn)" ;;
    529)        TAG="✗ Anthropic overloaded (529)" ;;
    504|"000")  TAG="✗ timeout" ;;
    *)          TAG="✗ unexpected" ;;
  esac

  printf "%s  %6.2fs  %s\n" "${STATUS}" "${ELAPSED}" "${TAG}"
  TIMES+=("${ELAPSED}")
done

# Median across runs. Works for any RUNS >= 1 — single run = that value.
if [ "${#TIMES[@]}" -gt 1 ]; then
  SORTED=$(printf '%s\n' "${TIMES[@]}" | sort -n)
  MID=$(( ${#TIMES[@]} / 2 ))
  if (( ${#TIMES[@]} % 2 == 1 )); then
    MEDIAN=$(echo "${SORTED}" | sed -n "$((MID + 1))p")
  else
    A=$(echo "${SORTED}" | sed -n "${MID}p")
    B=$(echo "${SORTED}" | sed -n "$((MID + 1))p")
    MEDIAN=$(awk "BEGIN { printf \"%.2f\", ($A + $B) / 2 }")
  fi
  echo "────────────────────────────────────────────────────────────────"
  printf "Median: %ss across %d runs\n" "${MEDIAN}" "${#TIMES[@]}"
fi
