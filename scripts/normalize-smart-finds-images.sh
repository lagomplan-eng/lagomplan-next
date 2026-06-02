#!/bin/bash
# scripts/normalize-smart-finds-images.sh
#
# Normalizes every Smart Finds product image to a consistent shape:
#   1. Auto-trim whitespace and visible borders (fuzz tolerance handles
#      off-white frames, e.g. the colored borders on Kit Playa Familiar
#      product shots).
#   2. Resize so the product fits inside 880×880 (leaves ~9% breathing
#      room on a 1080 canvas — comparable across products).
#   3. Center on a 1080×1080 white canvas. Strip metadata + sRGB profile
#      so the file is small and renders consistently.
#
# Idempotent: re-running produces the same output (trim is a no-op after
# the first pass since whitespace is already trimmed). Source files are
# backed up to public/images/smart-finds/_backup/ before the first run.
#
# Run from repo root: bash scripts/normalize-smart-finds-images.sh

set -euo pipefail

DIR="public/images/smart-finds"
BACKUP="$DIR/_backup"

if [[ ! -d "$DIR" ]]; then
  echo "ERROR: $DIR not found" >&2
  exit 1
fi

# One-shot backup of originals. Subsequent runs preserve the backup.
mkdir -p "$BACKUP"
for f in "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.png; do
  [[ -f "$f" ]] || continue
  name=$(basename "$f")
  if [[ ! -f "$BACKUP/$name" ]]; then
    cp "$f" "$BACKUP/$name"
  fi
done

# Normalize. The pipeline:
#   -fuzz 8%             — tolerance for nearly-white pixels (cream-tinted
#                          backgrounds, JPG compression artifacts on edges)
#   -trim +repage        — strip the bounding-box whitespace; +repage clears
#                          the original canvas dimensions baked into the
#                          virtual coordinate space
#   -resize 880x880      — shrink so the product's longest side is 880px;
#                          shorter side preserves aspect (no distortion)
#   -gravity center      — anchor the next op at the middle
#   -background white    — fill color for canvas extension
#   -extent 1080x1080    — pad out to a uniform 1080-square canvas
#   -strip               — drop EXIF / color profiles (smaller file, no
#                          surprises on the web)
#   -quality 88          — visually lossless for product photography
#
# > /dev/null on the loop output keeps the terminal readable; the file
# list itself prints one line per processed image below.
PROCESSED=0
for f in "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.png; do
  [[ -f "$f" ]] || continue
  name=$(basename "$f")
  magick "$f" \
    -fuzz 8% -trim +repage \
    -resize 880x880 \
    -gravity center -background white -extent 1080x1080 \
    -strip -quality 88 \
    "$f"
  PROCESSED=$((PROCESSED + 1))
  echo "  ✓ $name"
done

echo ""
echo "Done. $PROCESSED images normalized."
echo "Originals saved at: $BACKUP"
echo ""
echo "If anything looks worse than before, restore with:"
echo "  cp $BACKUP/*.jpg $DIR/"
