#!/bin/bash
ASSET_DIR="../assets"
PUBLIC_ASSET_DIR="../public/assets"
rm -rf $PUBLIC_ASSET_DIR
mkdir $PUBLIC_ASSET_DIR
cp $ASSET_DIR/spritesheets/* $PUBLIC_ASSET_DIR/
cp $ASSET_DIR/data/* $PUBLIC_ASSET_DIR/
