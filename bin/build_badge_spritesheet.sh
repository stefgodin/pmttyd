#!/bin/bash
ASSET_DIR="../assets"
magick montage $ASSET_DIR/badges/*.png -background none -tile x1 -geometry +0+0 $ASSET_DIR/spritesheets/badges.png
optipng $ASSET_DIR/spritesheets/badges.png
