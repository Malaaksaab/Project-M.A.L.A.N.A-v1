#!/bin/bash
echo "Building MALANA Desktop Installer"
echo "=============================="

echo "Step 1: Installing dependencies..."
npm install electron electron-builder electron-wix-msi concurrently wait-on --save-dev

echo "Step 2: Building application..."
npm run build

echo "Step 3: Creating electron package..."
npm run dist

echo "Step 4: Creating installers..."
node installer.js

echo "=============================="
echo "Installation packages created in release folder"
echo "Windows users can use the .exe or .msi installer"
echo "Mac users can use the .dmg installer"
echo "Linux users can use the .AppImage installer"
