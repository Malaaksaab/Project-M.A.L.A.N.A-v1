const { MSICreator } = require("electron-wix-msi");
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
  const versionMatch = release.match(/^(\d+)\.(\d+)/);
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
