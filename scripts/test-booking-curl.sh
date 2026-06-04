#!/usr/bin/env bash
# One-shot diagnostic curl for the Ya reservé endpoint.
# Run while dev server is up:  bash scripts/test-booking-curl.sh
set -euo pipefail

TRIP_ID="6384ba32-bd09-42ba-aa8a-c1aae7ec9aee"
URL="http://localhost:3000/api/trips/${TRIP_ID}/booking-confirm"
BODY='{"accommodationId":"acc-0","booking":{"code":"test123","checkinTime":"15:00","notes":"diagnostic"}}'

curl -i -X PATCH "$URL" -H "Content-Type: application/json" -d "$BODY"
echo
