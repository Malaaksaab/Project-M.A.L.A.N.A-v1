@echo off
echo Building MALANA Desktop Installer
echo ==============================

echo Step 1: Installing dependencies...
npm install electron electron-builder electron-wix-msi concurrently wait-on --save-dev

echo Step 2: Building application...
npm run build

echo Step 3: Creating electron package...
npm run dist

echo Step 4: Creating Windows installer...
node installer.js

echo ==============================
echo Installation package created in windows-installer folder
echo You can distribute the MSI file to users for easy installation
pause
