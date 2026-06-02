#!/bin/bash
# scripts/copy-smart-finds-images.sh
#
# Copies the prototype Smart Finds images into public/images/smart-finds/,
# renaming each file to match the product slug used in the seed migration
# (supabase/migrations/20260601_smart_finds_seed_phase_1.sql).
#
# Idempotent: overwrites on re-run (so corrections to the source images
# propagate). Doesn't delete originals.
#
# Run from repo root: bash scripts/copy-smart-finds-images.sh

set -euo pipefail

SRC="prototypes/Images smart finds"
DEST="public/images/smart-finds"

if [[ ! -d "$SRC" ]]; then
  echo "ERROR: source directory '$SRC' not found" >&2
  exit 1
fi

mkdir -p "$DEST"

# (source filename, destination slug)
# Listed in kit order for readability.
declare -a MAP=(
  # Kit 1 — Playa Familiar
  "KIT1 Monobeach_1080.jpg|monobeach-baby-beach-tent.jpg"
  "KIT1 Swimways_1080.jpg|swimways-baby-spring-float.jpg"
  "KIT1 Thinkbaby_1080.jpg|thinkbaby-spf-50.jpg"
  "KIT1 Seal Line_1080.jpg|sealline-baja-dry-bag.jpg"
  "KIT1 Sawauruita_1080.jpg|sawaruita-beach-toys.jpg"
  "KIT 1 Alva_1080.jpg|alva-waterproof-diapers.jpg"
  "KIT 1 Pampers_1080.jpg|pampers-swim-diapers.jpg"

  # Kit 2 — Dormir Lejos de Casa
  "KIT 2 skiphop_1080.jpg|skiphop-white-noise.jpg"
  "Kit 2 Guava_1080.jpg|guava-portable-crib.jpg"
  "kit 2 guava sheets_1080.jpg|pack-n-play-fitted-sheet.jpg"
  "kit 2 honeykeeper_1080.jpg|honeykeeper-travel-toiletries.jpg"
  "Kit 2 Keepgoing_1080.jpg|keep-going-first-aid-kit.jpg"
  "KIT 2 Momcozy_1080.jpg|momcozy-night-light.jpg"
  "Kit 2 Exergen_1080.jpg|exergen-thermometer.jpg"

  # Kit 3 — Avión Sin Estrés
  "Kit 3 Joyspark_1080.jpg|joyspark-volume-headphones.jpg"
  "Kit 3 Waterwipes_1080.jpg|waterwipes.jpg"
  "Kit 3 Gobe_1080.jpg|gobe-food-container.jpg"
  "Kit 3 Ergobaby_1080.jpg|ergobaby-baby-carrier.jpg"
  "Kit 3 Keababies_1080.jpg|keababies-changing-pad.jpg"
  "kit 3 GB pockit_1080.jpg|gb-pockit-all-city.jpg"
  "Kit 3 Burt Bees_1080.jpg|burts-bees-muslin.jpg"

  # Kit 4 — Sin perder a nadie
  # (Skipping kit 4 GB pockit + kit 4 Ergobaby — duplicates of kit 3 products,
  # already copied above with the correct slugs.)
  "Kit 4 Airtag_1080.jpg|apple-airtag-4pack.jpg"
  "Kit 4 Ridesafe_1080.jpg|ridesafer.jpg"
  "Kit 4 Hiccapop_1080.jpg|hiccapop-booster.jpg"
  "kit 4 Mia Mily_1080.jpg|miamily-carry-on-seat.jpg"
  "kit 4 Bagsmart_1080.jpg|bagsmart-packing-tubes.jpg"

  # Kit 5 — Escapada Express
  # Per Elena: Victorinox image is actually for the Swissgear backpack.
  # Per Elena: both Bagsmart files in Kit 5 are the same — use one.
  "kit 5 Victorinox_1080.jpg|swissgear-tech-backpack.jpg"
  "Kit 5 Beis_1080.jpg|beis-totebag-weekender.jpg"
  "Kit 5 Bagsmart_1080.jpg|bagsmart-compression-cubes.jpg"
  "kit 5 Mrsdry_1080.jpg|mrs-dry-travel-bottles.jpg"
  "Kit 5 Fintie_1080.jpg|fintie-document-holder.jpg"
  "Kit 5 Forgelock_1080.jpg|forge-tsa-lock.jpg"

  # Kit 6 — Sin Cable Perdido
  # Per Elena: ignore the no-prefix Anker_1080.jpg duplicate.
  "Kit 6 Bagsmart_1080.jpg|bagsmart-cable-organizer.jpg"
  "Kit 6 Anker_1080.jpg|anker-powercore-slim.jpg"
  "Kit 6 Epicka_1080.jpg|epicka-universal-adapter.jpg"

  # Kit 7 — Fan Day
  # Per Elena: Bagail = GG Bags FIFA tote (same product, rename).
  # Per Elena: Outerstuff = Gorra con UPF 50 (Sunday Afternoons cap, rename).
  "Kit 7 Bagail_1080.jpg|gg-bags-clear-tote.jpg"
  "Kit 7 Frog Toggs_1080.jpg|frogg-toggs-poncho.jpg"
  "Kit 7 Outerstuff_1080.jpg|sunday-afternoons-upf-cap.jpg"
  "Kit 7 Hydro Flaskjpg_1080.jpg|hydro-flask-24oz.jpg"

  # Skipped:
  # - Anker_1080.jpg               (no kit prefix; duplicate per Elena)
  # - Kit 5 Bagsmart_1080 (1).jpg  (duplicate of Kit 5 Bagsmart_1080.jpg)
  # - Kit 8 Travelon_1080.jpg      (kit 8 not in current seed)
  # - Kit 9 Occer_1080.jpg         (kit 9 not in current seed)
  # - Kit 9 Purell_1080.jpg        (kit 9 not in current seed)

  # Products with NO image file provided:
  # - airalo-esim                  (digital — likely intentional; image stays NULL)
  # - cetaphil-spf50-stick         (no image in prototypes — add later)
)

COPIED=0
MISSING=0

for entry in "${MAP[@]}"; do
  src_name="${entry%%|*}"
  dest_name="${entry##*|}"
  src_path="$SRC/$src_name"
  dest_path="$DEST/$dest_name"

  if [[ ! -f "$src_path" ]]; then
    echo "MISSING: $src_path" >&2
    MISSING=$((MISSING + 1))
    continue
  fi

  cp "$src_path" "$dest_path"
  COPIED=$((COPIED + 1))
  printf '  %-32s → %s\n' "$src_name" "$dest_name"
done

echo ""
echo "Done. $COPIED copied, $MISSING missing."
echo ""
echo "Next: paste the SQL UPDATE block (see end of seed migration's PR description) into"
echo "Supabase Studio to populate the image column."
