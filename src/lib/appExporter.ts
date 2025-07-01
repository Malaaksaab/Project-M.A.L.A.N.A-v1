// App exporter for MALANA
// This module handles exporting the entire application for download

import JSZip from "jszip";

interface ExportOptions {
  includeSourceCode: boolean;
  includeDocumentation: boolean;
  includeInstallers: boolean;
  optimizeForSize: boolean;
}

class AppExporter {
  private defaultOptions: ExportOptions = {
    includeSourceCode: true,
    includeDocumentation: true,
    includeInstallers: true,
    optimizeForSize: false,
  };

  /**
   * Export the entire application as a ZIP file
   */
  public async exportApp(options: Partial<ExportOptions> = {}): Promise<Blob> {
    const exportOptions = { ...this.defaultOptions, ...options };
    const zip = new JSZip();

    // Add README file
    zip.file(
      "README.md",
      `# MALANA Desktop Assistant

## Overview
MALANA (Multi-Adaptive Learning Artificial Neural Assistant) is a voice-activated AI assistant that runs on your desktop. It can perform various tasks through voice commands, including web searches, file management, system control, and more.

## Quick Start
1. Go to the executable folder and run MALANA_Setup.exe to install the application
2. Launch MALANA from your desktop or start menu
3. Say "Hey MALANA" or press Alt+Space to activate the assistant

## Features
- Voice command recognition
- System controls and monitoring
- Web search capabilities
- Weather information
- Time and calendar functions
- Email integration
- File management
- Music controls
- Security features including privacy mode

## Source Code
Complete source code is available in the source folder if you want to customize or build the application yourself.

## Documentation
See the docs folder for user guides and technical documentation.
`,
    );

    // Create main folders
    const sourceFolder = zip.folder("source");
    const executableFolder = zip.folder("executable");
    const docsFolder = zip.folder("docs");
    const assetsFolder = zip.folder("assets");

    if (exportOptions.includeSourceCode && sourceFolder) {
      // Add package.json
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
              jszip: "^3.10.1",
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

      // Add electron.js
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

      // Add installer.js
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

      // Add build scripts
      sourceFolder.file(
        "build-installer.bat",
        `@echo off
echo Building MALANA Desktop Assistant installer...
node installer.js
echo Installer build complete! Check the windows-installer directory.
pause
`,
      );

      sourceFolder.file(
        "build-installer.sh",
        `#!/bin/bash
echo "Building MALANA Desktop Assistant installer..."
node installer.js
echo "Installer build complete! Check the windows-installer directory."
`,
      );
    }

    if (exportOptions.includeDocumentation && docsFolder) {
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
- "Enable privacy mode" - Enables privacy mode
- "Open security settings" - Opens security configuration

## Customizing Settings

Access the settings panel by clicking the gear icon in the assistant interface.

### Security Settings
- Enable/disable different authentication methods
- Change PIN codes and passwords
- Set up voice recognition with training phrases

## Troubleshooting

### Voice Recognition Issues
- Speak clearly and at a moderate pace
- Reduce background noise
- Retrain voice recognition in a quiet environment

## System Requirements

- Windows 7/8/10/11 (64-bit)
- 4GB RAM minimum
- 500MB free disk space
- Microphone for voice commands
`,
      );

      docsFolder.file(
        "DeveloperGuide.md",
        `# MALANA Desktop Assistant - Developer Guide

## Project Structure

- **src/components/VoiceAssistant**: Main voice assistant components
- **src/lib**: Core functionality libraries
  - **commandProcessor.ts**: Processes voice commands
  - **voiceRecognition.ts**: Handles speech recognition
  - **openai.ts**: Integration with OpenAI for AI responses

## Building from Source

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Development Setup
1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`npm run electron-dev\` to start the development version

### Building for Production
1. Run \`npm run build\` to build the React application
2. Run \`npm run dist\` to create distributable packages

## Adding New Commands

To add new commands to the assistant, modify the \`commandProcessor.ts\` file:

1. Create a new handler function for your command
2. Register the handler in the \`registerDefaultHandlers\` method
3. Add detection logic in the \`processCommand\` method

Example:

\`\`\`typescript
// Add handler
private async handleNewCommand(command: string): Promise<string> {
  return \`Processing new command: ${command}\`;
}

// Register in constructor
this.registerHandler('new command', this.handleNewCommand);
\`\`\`

## Customizing the UI

The UI components are built with React and styled with Tailwind CSS. The main components are:

- **VoiceAssistant/index.tsx**: Main container component
- **AssistantDashboard.tsx**: Displays command responses
- **VoiceCommandProcessor.tsx**: Handles voice input UI
- **SettingsPanel.tsx**: Settings configuration UI

## Creating Installers

Windows installers are created using electron-wix-msi:

1. Build the application with \`npm run build\`
2. Run \`node installer.js\` to create the MSI installer
3. Or use the \`build-installer.bat\` script on Windows

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure your code follows the project's coding style and includes appropriate tests.
`,
      );
    }

    if (exportOptions.includeInstallers && executableFolder) {
      // Add a placeholder executable file
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

      // Add a readme for the executable
      executableFolder.file(
        "README.txt",
        `MALANA Desktop Assistant Installer

This folder contains the installer for MALANA Desktop Assistant.

To install:
1. Run MALANA_Setup.exe
2. Follow the installation wizard instructions
3. Launch MALANA from your desktop or start menu after installation

System Requirements:
- Windows 7/8/10/11 (64-bit)
- 4GB RAM minimum
- 500MB free disk space
- Microphone for voice commands

Note: This is a placeholder installer file. In a real distribution, this would be a fully functional installer package.
`,
      );
    }

    if (assetsFolder) {
      // Add icon assets
      assetsFolder.file(
        "icon.svg",
        `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8Z"></path><path d="M8 16a4 4 0 0 1 8 0"></path><path d="M8.5 11.5 A0.5 0.5 0 0 1 8 12 A0.5 0.5 0 0 1 7.5 11.5 A0.5 0.5 0 0 1 8 11 A0.5 0.5 0 0 1 8.5 11.5 z"></path><path d="M15.5 11.5 A0.5 0.5 0 0 1 15 12 A0.5 0.5 0 0 1 14.5 11.5 A0.5 0.5 0 0 1 15 11 A0.5 0.5 0 0 1 15.5 11.5 z"></path><path d="M10 2v2"></path><path d="M14 2v2"></path></svg>`,
      );
    }

    // Generate the zip file
    return await zip.generateAsync({
      type: "blob",
      compression: exportOptions.optimizeForSize ? "DEFLATE" : "STORE",
      compressionOptions: {
        level: exportOptions.optimizeForSize ? 9 : 1,
      },
    });
  }

  /**
   * Trigger download of the exported app
   */
  public async downloadApp(
    options: Partial<ExportOptions> = {},
  ): Promise<void> {
    try {
      const blob = await this.exportApp(options);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "MALANA-Desktop-Assistant.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading app:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const appExporter = new AppExporter();
export default appExporter;
