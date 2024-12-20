#!/bin/bash
ASSET_DIR="../assets"
magick montage $ASSET_DIR/items/*.png -background none -tile x1 -geometry +0+0 $ASSET_DIR/spritesheets/items.png
optipng $ASSET_DIR/spritesheets/items.png
