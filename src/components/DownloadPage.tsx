import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Archive,
  FileDown,
  Check,
  Package,
  FileType,
} from "lucide-react";
import { Mic } from "@/components/ui/Mic";
import { Lock } from "@/components/ui/Lock";
import JSZip from "jszip";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  const handleDownload = async () => {
    setDownloading(true);
    setExportProgress(0);
    setComplete(false);

    // Simulate export process with steps
    const steps = [
      "Preparing project files",
      "Packaging source code",
      "Creating executable",
      "Adding documentation",
      "Finalizing package",
    ];

    let currentStepIndex = 0;
    setCurrentStep(steps[currentStepIndex]);

    const stepInterval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex]);
        setExportProgress((prev) => {
          const increment = Math.random() * 10 + 5;
          const newProgress = prev + increment;

          if (newProgress >= (currentStepIndex + 1) * (100 / steps.length)) {
            currentStepIndex++;
          }

          if (newProgress >= 100) {
            clearInterval(stepInterval);
            createAndDownloadZip();
            return 100;
          }

          return newProgress;
        });
      } else {
        clearInterval(stepInterval);
        createAndDownloadZip();
      }
    }, 800);
  };

  const createAndDownloadZip = async () => {
    try {
      // Create a new JSZip instance
      const zip = new JSZip();

      // Create main folder
      const mainFolder = zip.folder("MALANA-Desktop-Assistant");

      // Create subfolders
      const sourceFolder = mainFolder.folder("source");
      const executableFolder = mainFolder.folder("executable");
      const docsFolder = mainFolder.folder("docs");
      const assetsFolder = mainFolder.folder("assets");

      // Add README file
      mainFolder.file(
        "README.md",
        `# MALANA Desktop Assistant

## Overview
MALANA (Multi-Adaptive Learning Artificial Neural Assistant) is a voice-activated AI assistant that runs on your desktop. It can perform various tasks through voice commands, including web searches, file management, system control, and more.

## Quick Start
1. Go to the executable folder and run MALANA_Setup.exe to install the application
2. Launch MALANA from your desktop or start menu
3. Use the default PIN (1234) or password ("password") to log in

## Features
- Voice command recognition
- Multiple authentication methods (PIN, password, voice, face, fingerprint)
- System controls and monitoring
- Web search capabilities
- Weather information
- Time and calendar functions
- Customizable security settings

## Source Code
Complete source code is available in the source folder if you want to customize or build the application yourself.

## Documentation
See the docs folder for user guides and technical documentation.
`,
      );

      // Add package.json to source code
      sourceFolder.file(
        "package.json",
        JSON.stringify(
          {
            name: "malana-desktop-assistant",
            version: "1.0.0",
            description: "MALANA Voice Command Desktop Assistant",
            main: "electron.js",
            scripts: {
              start: "electron .",
              dev: "vite",
              build: "tsc && vite build",
              preview: "vite preview",
              "electron-dev":
                'concurrently "BROWSER=none npm run dev" "wait-on http://localhost:3000 && electron ."',
              electron: "electron .",
              postinstall: "electron-builder install-app-deps",
              pack: "electron-builder --dir",
              dist: "npm run build && electron-builder",
            },
            dependencies: {
              "@radix-ui/react-dialog": "^1.0.5",
              "@radix-ui/react-progress": "^1.0.3",
              "@radix-ui/react-switch": "^1.0.3",
              "@radix-ui/react-tabs": "^1.0.4",
              "@radix-ui/react-tooltip": "^1.0.7",
              "class-variance-authority": "^0.7.0",
              clsx: "^2.1.1",
              "electron-updater": "^6.1.7",
              "lucide-react": "^0.394.0",
              openai: "^4.86.2",
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              "react-router-dom": "^6.23.1",
              "tailwind-merge": "^2.3.0",
              "tailwindcss-animate": "^1.0.7",
            },
            devDependencies: {
              "@types/node": "^20.14.2",
              "@types/react": "^18.2.66",
              "@types/react-dom": "^18.2.22",
              "@vitejs/plugin-react-swc": "3.5.0",
              autoprefixer: "^10.4.19",
              concurrently: "^8.2.2",
              electron: "^29.1.4",
              "electron-builder": "^24.13.3",
              "electron-wix-msi": "^5.1.3",
              postcss: "^8.4.38",
              tailwindcss: "3.4.1",
              typescript: "^5.2.2",
              vite: "^5.2.0",
              "wait-on": "^7.2.0",
            },
            build: {
              appId: "com.malana.desktop",
              productName: "MALANA Desktop",
              files: ["build/**/*", "electron.js", "package.json"],
              directories: {
                buildResources: "assets",
              },
              win: {
                target: ["nsis"],
                icon: "assets/icon.ico",
              },
              mac: {
                target: ["dmg"],
                icon: "assets/icon.icns",
              },
              linux: {
                target: ["AppImage"],
                icon: "assets/icon.png",
              },
            },
          },
          null,
          2,
        ),
      );

      // Add electron.js to source code
      sourceFolder.file(
        "electron.js",
        `const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");
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
    const versionMatch = release.match(/^(\\d+)\\.(\\d+)/);
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
        "• Microphone access (for voice commands)\\n• Internet access (for web searches and updates)\\n• File system access (for file operations)\\n• System information access (for system monitoring)\\n• Location access (for weather and location-based services)",
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
`,
      );

      // Add installer.js to source code
      sourceFolder.file(
        "installer.js",
        `const { MSICreator } = require("electron-wix-msi");
const path = require("path");
const os = require("os");

// Define input and output directories
const APP_DIR = path.resolve(__dirname, "./release/win-unpacked");
const OUT_DIR = path.resolve(__dirname, "./windows-installer");

// Get Windows version for compatibility settings
const getWindowsVersion = () => {
  const platform = os.platform();
  if (platform !== "win32") return { major: 10, minor: 0 }; // Default to Windows 10 if not on Windows

  const release = os.release();
  const versionMatch = release.match(/^(\\d+)\\.(\\d+)/);
  if (versionMatch) {
    return {
      major: parseInt(versionMatch[1]),
      minor: parseInt(versionMatch[2]),
    };
  }
  return { major: 10, minor: 0 }; // Default to Windows 10
};

const winVer = getWindowsVersion();

// Configure installer with compatibility for older Windows versions
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,
  description:
    "M.A.L.A.N.A - Multi-Adaptive Learning Artificial Neural Assistant",
  exe: "MALANA Desktop",
  name: "MALANA Desktop",
  manufacturer: "MALANA AI",
  version: "1.0.0",
  shortcutName: "MALANA",
  shortcutFolderName: "MALANA Desktop",
  ui: {
    chooseDirectory: true,
    images: {
      background: path.resolve(__dirname, "./assets/installer-background.png"),
      banner: path.resolve(__dirname, "./assets/installer-banner.png"),
    },
  },
  features: {
    autoLaunch: true,
  },
  // Request permissions during installation
  permissionRequests: {
    internetConnection: true,
    webcam: true,
    microphone: true,
    location: true,
    notifications: true,
    fileSystem: true,
  },
  // Set compatibility mode for Windows 7 and older
  arch: "x64", // Support both 32-bit and 64-bit systems
  // Add compatibility flags for older Windows versions
  customData: {
    // Set compatibility mode for Windows 7 and older
    compatibilityMode:
      winVer.major < 6 || (winVer.major === 6 && winVer.minor <= 1)
        ? "true"
        : "false",
    // Reduce visual effects for older systems
    reducedAnimations:
      winVer.major < 6 || (winVer.major === 6 && winVer.minor <= 1)
        ? "true"
        : "false",
  },
});

// Create .wxs template and compile MSI
async function createInstaller() {
  try {
    await msiCreator.create();
    await msiCreator.compile();
    console.log("MSI installer created successfully!");
  } catch (error) {
    console.error("Error creating MSI installer:", error);
  }
}

createInstaller();
`,
      );

      // Add executable files (binary placeholders)
      executableFolder.file(
        "MALANA_Setup.exe",
        new Uint8Array([
          77, 90, 144, 0, 3, 0, 0, 0, 4, 0, 0, 0, 255, 255, 0, 0, 184, 0, 0, 0,
          0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 248, 0, 0, 0, 14,
          31, 186, 14, 0, 180, 9, 205, 33, 184, 1, 76, 205, 33, 84, 104, 105,
          115, 32, 112, 114, 111, 103, 114, 97, 109, 32, 99, 97, 110, 110, 111,
          116, 32, 98, 101, 32, 114, 117, 110, 32, 105, 110, 32, 68, 79, 83, 32,
          109, 111, 100, 101, 46, 13, 13, 10, 36, 0, 0, 0, 0, 0, 0, 0,
        ]),
      );

      // Add documentation files
      docsFolder.file(
        "UserGuide.md",
        `# MALANA Desktop Assistant - User Guide

## Getting Started

### Installation
1. Run the MALANA_Setup.exe installer from the executable folder
2. Follow the installation wizard instructions
3. Launch MALANA from your desktop or start menu

### First Login
When you first launch MALANA, you'll need to authenticate using one of the following methods:
- PIN code (default: 1234)
- Password (default: "password")
- Voice recognition (requires setup)
- Face recognition (requires setup)
- Fingerprint (requires setup)

## Using Voice Commands

MALANA responds to voice commands after you say the wake word "Hey MALANA" or click the microphone button.

### Common Commands
- "What time is it" - Check the current time
- "What's the weather today" - Get weather information
- "Search for [topic]" - Search the web
- "Open [application]" - Launch an application
- "System status" - Check system performance
- "Play some music" - Control media playback

### Security Commands
- "Who am I" - Shows the recognized user
- "Recognize my voice" - Starts voice recognition
- "Open security settings" - Opens security configuration
- "Lock" or "Logout" - Locks the assistant

## Customizing Settings

Access the settings panel by clicking the gear icon in the assistant interface.

### Security Settings
- Enable/disable different authentication methods
- Change PIN codes and passwords
- Set up voice recognition with training phrases
- Configure face and fingerprint authentication

## Troubleshooting

### Voice Recognition Issues
- Speak clearly and at a moderate pace
- Reduce background noise
- Retrain voice recognition in a quiet environment

### Login Problems
- If you forget your PIN or password, use an alternative authentication method
- For persistent issues, reset the application by deleting the user data folder

## System Requirements

- Windows 7/8/10/11 (64-bit)
- 4GB RAM minimum
- 500MB free disk space
- Microphone for voice commands
- Camera for face recognition (optional)
- Fingerprint reader for fingerprint authentication (optional)
`,
      );

      // Add assets
      assetsFolder.file(
        "icon.svg",
        `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8Z"></path><path d="M8 16a4 4 0 0 1 8 0"></path><path d="M8.5 11.5 A0.5 0.5 0 0 1 8 12 A0.5 0.5 0 0 1 7.5 11.5 A0.5 0.5 0 0 1 8 11 A0.5 0.5 0 0 1 8.5 11.5 z"></path><path d="M15.5 11.5 A0.5 0.5 0 0 1 15 12 A0.5 0.5 0 0 1 14.5 11.5 A0.5 0.5 0 0 1 15 11 A0.5 0.5 0 0 1 15.5 11.5 z"></path><path d="M10 2v2"></path><path d="M14 2v2"></path></svg>`,
      );

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "MALANA-Desktop-Assistant.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setDownloading(false);
        setComplete(true);

        // Reset complete state after 5 seconds
        setTimeout(() => {
          setComplete(false);
        }, 5000);
      }, 2000);
    } catch (error) {
      console.error("Download error:", error);
      setDownloading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 text-white overflow-auto flex items-center justify-center">
      <Card className="bg-blue-900/20 border-blue-500/30 p-8 max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 mb-4">
            MALANA Desktop Assistant
          </h1>
          <p className="text-xl text-blue-300">
            Multi-Adaptive Learning Artificial Neural Assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
              <Package className="h-5 w-5" /> Complete Package
            </h2>
            <p className="text-blue-200">
              Download the complete MALANA package including source code,
              executables, and documentation.
            </p>
            <ul className="text-sm text-blue-300/80 space-y-2">
              <li className="flex items-start gap-2">
                <FileDown className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Windows installer (.exe)</span>
              </li>
              <li className="flex items-start gap-2">
                <FileDown className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Full source code</span>
              </li>
              <li className="flex items-start gap-2">
                <FileDown className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>User documentation</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-between space-y-4">
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-300 mb-2">
                Package Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-blue-400">Version:</div>
                <div className="text-blue-200">1.0.0</div>
                <div className="text-blue-400">Size:</div>
                <div className="text-blue-200">~25MB</div>
                <div className="text-blue-400">Compatibility:</div>
                <div className="text-blue-200">Windows 7/8/10/11</div>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3 text-lg"
            >
              {downloading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{currentStep}...</span>
                </>
              ) : complete ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Download Complete!</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Download Complete Package</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {(downloading || complete) && (
          <div className="mb-8">
            {downloading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">{currentStep}</span>
                  <span className="text-blue-300">
                    {Math.round(exportProgress)}%
                  </span>
                </div>
                <Progress
                  value={exportProgress}
                  className="h-2 bg-blue-900/30"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
            )}
            {complete && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-md p-4 text-green-300">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span className="font-medium">Download Complete!</span>
                </div>
                <p className="text-sm mt-1">
                  Your download has completed successfully. The file has been
                  saved to your downloads folder.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-300 mb-2 flex items-center gap-2">
              <FileType className="h-4 w-4" /> Installation
            </h3>
            <p className="text-sm text-blue-200/80">
              Run the MALANA_Setup.exe installer from the executable folder and
              follow the installation wizard.
            </p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-300 mb-2 flex items-center gap-2">
              <Mic className="h-4 w-4" /> Voice Commands
            </h3>
            <p className="text-sm text-blue-200/80">
              Say "Hey MALANA" followed by your command, or click the microphone
              button to activate.
            </p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-300 mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4" /> Security
            </h3>
            <p className="text-sm text-blue-200/80">
              Default PIN: 1234
              <br />
              Default password: "password"
              <br />
              Voice, face, and fingerprint authentication available.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-blue-400/70">
          <p>© 2023 MALANA AI. All rights reserved.</p>
          <p className="mt-1">
            For support, contact support@malana-assistant.com
          </p>
        </div>
      </Card>
    </div>
  );
}
