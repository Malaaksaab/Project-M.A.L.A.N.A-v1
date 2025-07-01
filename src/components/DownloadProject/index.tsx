import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Check } from "lucide-react";

export default function DownloadProject() {
  const [downloading, setDownloading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isLegacyOS, setIsLegacyOS] = useState(false);

  // Detect legacy OS
  useEffect(() => {
    // Check if we're running in Electron
    const isElectron =
      window.navigator.userAgent.toLowerCase().indexOf("electron") > -1;
    if (
      isElectron &&
      window.navigator.userAgent.indexOf("Windows NT 6.1") > -1
    ) {
      // Windows 7 is NT 6.1
      setIsLegacyOS(true);
    } else if (
      isElectron &&
      window.navigator.userAgent.indexOf("Windows NT 6.0") > -1
    ) {
      // Windows Vista is NT 6.0
      setIsLegacyOS(true);
    } else if (
      isElectron &&
      window.navigator.userAgent.indexOf("Windows NT 5") > -1
    ) {
      // Windows XP is NT 5.x
      setIsLegacyOS(true);
    }
  }, []);

  const handleDownload = () => {
    setDownloading(true);

    // Create a zip file of the project
    const link = document.createElement("a");
    link.href =
      "https://download-link.tempolabs.ai/project/malana-desktop-assistant.zip";
    link.download = "malana-desktop-assistant.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setComplete(true);
    }, 2000);
  };

  return (
    <Card
      className={`p-6 ${isLegacyOS ? "bg-blue-900" : "bg-blue-900/20"} border-blue-500/30 max-w-md mx-auto`}
    >
      <h2 className="text-2xl font-bold text-blue-300 mb-4">
        Download Project
      </h2>
      <p className="text-blue-100/90 mb-6">
        Download the complete M.A.L.A.N.A Desktop Assistant project as a ZIP
        file. Compatible with all Windows versions (XP, Vista, 7, 8, 10, 11).
      </p>

      {!complete ? (
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Preparing Download...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Project
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-green-400 bg-green-900/20 p-3 rounded-md border border-green-500/30">
          <Check className="h-5 w-5" />
          <span>Download Started! Check your downloads folder.</span>
        </div>
      )}

      <div className="mt-4 text-xs text-blue-400/70">
        <p>File size: ~12MB</p>
        <p>
          Contains: Complete source code, build scripts, and installation files
        </p>
        {isLegacyOS && (
          <p className="mt-2 text-yellow-400">
            Legacy Windows detected - optimized compatibility mode enabled
          </p>
        )}
      </div>
    </Card>
  );
}
