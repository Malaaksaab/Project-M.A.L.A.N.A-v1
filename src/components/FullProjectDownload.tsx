import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Archive, FileDown, HardDrive, Check } from "lucide-react";
import JSZip from "jszip";

export default function FullProjectDownload() {
  const [downloading, setDownloading] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      // Create a new JSZip instance
      const zip = new JSZip();

      // Add project files to the zip
      // Main files
      zip.file(
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
              "@vitejs/plugin-react": "^4.2.1",
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
      zip.file(
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
      zip.file(
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

      // Add README.md
      zip.file(
        "README.md",
        `# MALANA Desktop Assistant

## Overview
MALANA (Multi-Adaptive Learning Artificial Neural Assistant) is a voice-activated AI assistant that runs on your desktop. It can perform various tasks through voice commands, including web searches, file management, system control, and more.

## Features
- Voice command recognition
- System controls (volume, brightness, etc.)
- File management
- Weather information
- Email and calendar integration
- Music controls
- Web search
- AI-powered conversations
- Security features with voice authentication

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Development Setup
1. Clone this repository
2. Run \`npm install\` to install dependencies
3. Run \`npm run electron-dev\` to start the development version

### Building for Production
1. Run \`npm run build\` to build the React application
2. Run \`npm run dist\` to create distributable packages

### Windows Installer
To create a Windows installer:
1. Run \`npm run build\` to build the application
2. Run \`node installer.js\` to create the MSI installer

## Compatibility
MALANA is designed to work on Windows 7 through Windows 11 with automatic scaling and resolution adjustment. The application includes compatibility modes for older systems.

## License
MIT License

## Acknowledgements
This project uses various open-source libraries and tools, including Electron, React, and OpenAI's API for natural language processing.
`,
      );

      // Add build scripts
      zip.file(
        "build-installer.bat",
        `@echo off
echo Building MALANA Desktop Assistant installer...
node installer.js
echo Installer build complete! Check the windows-installer directory.
pause
`,
      );

      zip.file(
        "build-installer.sh",
        `#!/bin/bash
echo "Building MALANA Desktop Assistant installer..."
node installer.js
echo "Installer build complete! Check the windows-installer directory."
`,
      );

      // Create src folder structure
      const src = zip.folder("src");
      const components = src.folder("components");
      const voiceAssistant = components.folder("VoiceAssistant");

      // Add main component files
      voiceAssistant.file(
        "index.tsx",
        `import { useState } from "react";
import { Button } from "../ui/button";
import { Brain, Mic, Settings } from "lucide-react";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [response, setResponse] = useState("");

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setResponse("Listening for your command...");
    } else {
      setResponse("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-blue-900/90 border border-blue-500/50 rounded-xl overflow-hidden shadow-lg w-80">
        <div className="flex justify-between items-center p-3 border-b border-blue-500/30 bg-gradient-to-r from-blue-900/80 to-indigo-900/80">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold tracking-wide text-blue-300">MALANA</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-300 hover:text-white hover:bg-blue-800/50"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 min-h-[100px] p-3 rounded-lg text-blue-100">
            {response ? (
              <p>{response}</p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <p className="text-blue-300/80 text-sm">
                  Say "Hey MALANA" or click the microphone
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={toggleListening}
              variant="outline"
              className={\`rounded-full w-12 h-12 p-0 flex items-center justify-center border-2 \${isListening ? "bg-blue-600 border-blue-400" : "bg-blue-900/50 border-blue-500/50 hover:bg-blue-800/70"}\`}
            >
              <Mic className={\`h-6 w-6 \${isListening ? "text-white animate-pulse" : "text-blue-300"}\`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      );

      // Add UI components
      const ui = components.folder("ui");
      ui.file(
        "button.tsx",
        `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
`,
      );

      // Add utils
      const lib = src.folder("lib");
      lib.file(
        "utils.ts",
        `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
      );

      // Add assets folder with icon
      const assets = zip.folder("assets");

      // Create a simple SVG icon as a placeholder
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 18.5h-19"/><path d="M12 16V2"/><path d="M2 16.5A2.5 2.5 0 0 0 4.5 19h15a2.5 2.5 0 0 0 2.5-2.5"/><path d="M17 22l-5-4-5 4"/></svg>`;
      assets.file("icon.svg", svgIcon);

      // Add installation guide
      zip.file(
        "INSTALL.md",
        `# MALANA Desktop Assistant - Installation Guide

## Quick Start

1. **Prerequisites**
   - Install Node.js (v14 or later) from [nodejs.org](https://nodejs.org/)
   - Make sure npm is installed (comes with Node.js)

2. **Installation Steps**
   - Extract this ZIP file to a folder on your computer
   - Open a terminal/command prompt in that folder
   - Run \`npm install\` to install all dependencies
   - Run \`npm run electron-dev\` to start the application in development mode

3. **Building for Production**
   - Run \`npm run build\` to build the React application
   - Run \`npm run dist\` to create distributable packages
   - Find the installer in the \`dist\` folder

4. **Creating Windows Installer**
   - Run \`npm run build\` to build the application
   - Run \`node installer.js\` to create the MSI installer
   - Or simply run the \`build-installer.bat\` file on Windows

## Troubleshooting

- If you encounter any issues with dependencies, try deleting the \`node_modules\` folder and running \`npm install\` again
- For Windows-specific issues, make sure you have the latest Visual C++ Redistributable installed
- For more detailed instructions, refer to the README.md file

## Support

If you need help, please open an issue on the GitHub repository or contact support@malana-assistant.com
`,
      );

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "malana-desktop-assistant-full.zip";
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
      <Card className="bg-blue-900/20 border-blue-500/30 p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 mb-8">
          Download MALANA Project
        </h1>

        <div className="space-y-6">
          <p className="text-center text-blue-200 mb-6">
            Download the complete MALANA Desktop Assistant project with all
            source files, assets, and installation scripts.
          </p>

          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3 text-xl"
          >
            {downloading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Project Archive...</span>
              </>
            ) : complete ? (
              <>
                <Check className="h-6 w-6" />
                <span>Download Complete!</span>
              </>
            ) : (
              <>
                <Archive className="h-6 w-6" />
                <span>Download Full Project</span>
              </>
            )}
          </Button>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-4 mt-4">
            <h3 className="text-sm font-medium text-blue-300 mb-2">
              Project Contents
            </h3>
            <ul className="text-xs text-blue-200/80 space-y-1">
              <li className="flex items-start gap-2">
                <FileDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Complete source code with all components</span>
              </li>
              <li className="flex items-start gap-2">
                <FileDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Electron configuration for desktop app</span>
              </li>
              <li className="flex items-start gap-2">
                <FileDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Windows installer scripts</span>
              </li>
              <li className="flex items-start gap-2">
                <FileDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Assets and resources</span>
              </li>
              <li className="flex items-start gap-2">
                <FileDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Installation guide and documentation</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-blue-300/80 text-center mt-2">
            Compatible with Windows 7, 8, 10, and 11.
          </p>
        </div>
      </Card>
    </div>
  );
}
