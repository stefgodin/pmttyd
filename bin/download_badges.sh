#!/bin/bash
rm ../assets/badges/*
node ./download_badges.js
magick mogrify -background none -extent 100x100 -gravity center ../assets/badges/*.png
