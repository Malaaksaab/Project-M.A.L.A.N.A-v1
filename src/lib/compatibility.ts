/**
 * Windows Compatibility Layer
 *
 * This module provides utilities to detect and adapt to different Windows versions,
 * particularly focusing on legacy Windows support (Windows 7, Vista, XP).
 */

// Detect if running in Electron
export const isElectron = (): boolean => {
  return window?.navigator?.userAgent?.toLowerCase().indexOf("electron") > -1;
};

// Detect Windows version
export const getWindowsVersion = (): {
  major: number;
  minor: number;
} | null => {
  if (!isElectron()) return null;

  const userAgent = window.navigator.userAgent;

  // Windows NT version mapping:
  // - Windows 11/10: NT 10.0
  // - Windows 8.1: NT 6.3
  // - Windows 8: NT 6.2
  // - Windows 7: NT 6.1
  // - Windows Vista: NT 6.0
  // - Windows XP: NT 5.1 or 5.2

  const ntMatch = userAgent.match(/Windows NT (\d+)\.(\d+)/);
  if (ntMatch) {
    return {
      major: parseInt(ntMatch[1], 10),
      minor: parseInt(ntMatch[2], 10),
    };
  }

  return null;
};

// Check if running on Windows 7 or older
export const isLegacyWindows = (): boolean => {
  const version = getWindowsVersion();
  if (!version) return false;

  // Windows 7 or older: NT version <= 6.1
  return version.major < 6 || (version.major === 6 && version.minor <= 1);
};

// Get appropriate UI settings based on Windows version
export const getCompatibilitySettings = () => {
  const isLegacy = isLegacyWindows();

  return {
    // Use solid colors instead of gradients/transparency on older Windows
    useSolidColors: isLegacy,
    // Reduce animations on older Windows
    reduceAnimations: isLegacy,
    // Use simpler border radius on older Windows
    borderRadius: isLegacy ? "rounded-md" : "rounded-xl",
    // Use standard window frame on older Windows
    useStandardFrame: isLegacy,
    // Reduce shadow complexity on older Windows
    simpleShadows: isLegacy,
    // Alternative hotkey for older Windows (F1 instead of Alt+Space)
    alternativeHotkey: isLegacy ? "F1" : null,
  };
};
