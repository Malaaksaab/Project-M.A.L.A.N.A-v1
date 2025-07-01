const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const os = require("os");

let mainWindow;
let permissionsGranted = false;

// Check Windows version for compatibility adjustments
const isWin7OrOlder = () => {
  const platform = os.platform();
  const release = os.release();
  if (platform === "win32") {
    // Windows 7 is NT 6.1, Windows Vista is NT 6.0, Windows XP is NT 5.x
    const versionMatch = release.match(/^(\d+)\.(\d+)/);
    if (versionMatch) {
      const major = parseInt(versionMatch[1]);
      const minor = parseInt(versionMatch[2]);
      return major < 6 || (major === 6 && minor <= 1);
    }
  }
  return false;
};

// Check if permissions were previously granted
const permissionsFile = path.join(app.getPath("userData"), "permissions.json");
if (fs.existsSync(permissionsFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(permissionsFile, "utf8"));
    permissionsGranted = data.granted === true;
  } catch (e) {
    console.error("Error reading permissions file:", e);
  }
}

function createWindow() {
  // Get screen dimensions for proper sizing
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } =
    primaryDisplay.workAreaSize;

  // Adjust window size based on screen size
  const windowWidth = Math.min(1280, screenWidth * 0.9);
  const windowHeight = Math.min(800, screenHeight * 0.9);

  // Configure window options with compatibility for older Windows
  const windowOptions = {
    width: windowWidth,
    height: windowHeight,
    minWidth: Math.min(800, screenWidth * 0.5),
    minHeight: Math.min(600, screenHeight * 0.5),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // Disable GPU acceleration on older Windows for better compatibility
      disableHardwareAcceleration: isWin7OrOlder(),
    },
    icon: path.join(__dirname, "build/icon.png"),
  };

  // Adjust for older Windows versions
  if (isWin7OrOlder()) {
    // Use standard frame and disable transparency for Windows 7 and older
    windowOptions.frame = true;
    windowOptions.transparent = false;
    windowOptions.backgroundColor = "#000000";
  } else {
    // Modern Windows can use frameless and transparent window
    windowOptions.frame = false;
    windowOptions.transparent = true;
  }

  mainWindow = new BrowserWindow(windowOptions);

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "./build/index.html"),
      protocol: "file:",
      slashes: true,
    });

  // Check permissions before loading the app
  if (!permissionsGranted) {
    showPermissionsDialog();
  } else {
    mainWindow.loadURL(startUrl);
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  // Handle window controls
  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    mainWindow.close();
  });
}

function showPermissionsDialog() {
  dialog
    .showMessageBox(mainWindow, {
      type: "question",
      title: "M.A.L.A.N.A Permissions",
      message:
        "M.A.L.A.N.A requires the following permissions to function properly:",
      detail:
        "• Microphone access (for voice commands)\n• Internet access (for web searches and updates)\n• File system access (for file operations)\n• System information access (for system monitoring)\n• Location access (for weather and location-based services)",
      buttons: ["Grant Permissions", "Exit"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      if (result.response === 0) {
        // Save permissions
        fs.writeFileSync(permissionsFile, JSON.stringify({ granted: true }));
        permissionsGranted = true;

        // Load the app
        const startUrl =
          process.env.ELECTRON_START_URL ||
          url.format({
            pathname: path.join(__dirname, "./build/index.html"),
            protocol: "file:",
            slashes: true,
          });
        mainWindow.loadURL(startUrl);
      } else {
        app.quit();
      }
    })
    .catch((err) => {
      console.error(err);
      app.quit();
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle microphone permission request
ipcMain.on("request-microphone", (event) => {
  dialog
    .showMessageBox(mainWindow, {
      type: "question",
      title: "Microphone Access",
      message:
        "M.A.L.A.N.A needs access to your microphone for voice commands.",
      buttons: ["Allow", "Deny"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      event.reply("microphone-permission-result", result.response === 0);
    });
});

// Handle file system permission request
ipcMain.on("request-filesystem", (event) => {
  dialog
    .showMessageBox(mainWindow, {
      type: "question",
      title: "File System Access",
      message:
        "M.A.L.A.N.A needs access to your file system for file operations.",
      buttons: ["Allow", "Deny"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      event.reply("filesystem-permission-result", result.response === 0);
    });
});

// Handle location permission request
ipcMain.on("request-location", (event) => {
  dialog
    .showMessageBox(mainWindow, {
      type: "question",
      title: "Location Access",
      message:
        "M.A.L.A.N.A needs access to your location for weather and location-based services.",
      buttons: ["Allow", "Deny"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      event.reply("location-permission-result", result.response === 0);
    });
});
