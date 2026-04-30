#!/bin/bash

BASE_DIR="/Users/rachelgoldberg/Desktop/NEWwebsite/rachel-goldberg-art/public"

PATHS=(
  "images/paintings/Mock Ups/Golden Ganesha - OG 1.png"
  "images/paintings/Mock Ups/Golden Ganesha - OG 2.png"
  "images/paintings/Mock Ups/Myeongdong - OG 1.png"
  "images/paintings/Mock Ups/Myeongdong - OG 2.png"
  "images/paintings/Mock Ups/Rocky Mountain - OG 1.png"
  "images/paintings/Mock Ups/Rocky Mountain - OG 2.png"
  "images/products/Independence/Independence - All.png"
)

MISSING=0

for p in "${PATHS[@]}"; do
  if [ ! -f "$BASE_DIR/$p" ]; then
    echo "MISSING: $p"
    MISSING=$((MISSING+1))
  else
    echo "EXISTS:  $p"
  fi
done

if [ $MISSING -eq 0 ]; then
  echo "All paths verified!"
  exit 0
else
  echo "$MISSING paths missing."
  exit 1
fi
