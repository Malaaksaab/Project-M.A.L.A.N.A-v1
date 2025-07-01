# Creating an Electron App for M.A.L.A.N.A Desktop Interface

This document outlines the steps to convert the M.A.L.A.N.A React application into a desktop application using Electron.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Step 1: Install Electron and Required Dependencies

```bash
npm install electron electron-builder --save-dev
```

## Step 2: Create Electron Main Process File

Create a file named `electron.js` in the project root:

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: false,
    transparent: true,
    icon: path.join(__dirname, 'build/icon.png')
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, './build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Handle window controls
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    mainWindow.close();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
```

## Step 3: Update package.json

Add the following to your package.json:

```json
{
  "main": "electron.js",
  "scripts": {
    "electron-dev": "concurrently \"BROWSER=none npm run start\" \"wait-on http://localhost:3000 && electron .\"",
    "electron": "electron .",
    "postinstall": "electron-builder install-app-deps",
    "pack": "electron-builder --dir",
    "dist": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.malana.desktop",
    "productName": "MALANA Desktop",
    "files": [
      "build/**/*",
      "electron.js",
      "package.json"
    ],
    "directories": {
      "buildResources": "assets"
    },
    "win": {
      "target": ["nsis"],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": ["AppImage"],
      "icon": "assets/icon.png"
    }
  }
}
```

## Step 4: Install Additional Development Dependencies

```bash
npm install concurrently wait-on --save-dev
```

## Step 5: Create Assets Folder

Create an `assets` folder in the project root and add the following icons:
- icon.ico (for Windows)
- icon.icns (for macOS)
- icon.png (for Linux)

## Step 6: Build and Package the Application

```bash
# For development
npm run electron-dev

# For production build
npm run dist
```

This will create distributable packages in the `dist` folder.

## Step 7: Auto-Update Configuration (Optional)

For auto-updates, you can use electron-updater. Install it with:

```bash
npm install electron-updater --save
```

Then modify the electron.js file to include update functionality.

## Windows Compatibility

The application is designed to work on Windows 7 through Windows 11 with automatic scaling and resolution adjustment. The transparent frame and modern UI elements will adapt to the user's system theme and DPI settings.

## Installation Instructions

1. Download the appropriate installer for your operating system from the releases page
2. Run the installer and follow the on-screen instructions
3. Launch MALANA Desktop from your applications menu or desktop shortcut

## System Requirements

- Windows 7 or later (64-bit)
- macOS 10.13 or later
- Linux (Ubuntu 18.04 or later recommended)
- 4GB RAM minimum, 8GB recommended
- 500MB free disk space
- Internet connection for updates and online features
