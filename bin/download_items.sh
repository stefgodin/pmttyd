#!/bin/bash
rm ../assets/items/*
node ./download_items.js
magick mogrify -background none -extent 100x100 -gravity center ../assets/items/*.png
