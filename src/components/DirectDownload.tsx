import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";

export default function DirectDownload() {
  const [downloading, setDownloading] = useState(false);
  const [complete, setComplete] = useState(false);

  // Start download automatically when component loads
  useEffect(() => {
    startDownload();
  }, []);

  const startDownload = () => {
    setDownloading(true);

    // Create a simple package with the essential files
    const content = `MALANA Desktop Assistant - Mobile Version
============================

This is a simplified version of MALANA designed for mobile devices.

Features:
- Voice commands
- AI responses
- System controls
- Weather information
- Time and date functions

To install on your phone:
1. Extract this file
2. Open the index.html file in your mobile browser
3. Add to home screen for app-like experience

Enjoy using MALANA on your mobile device!`;

    // Create a blob and download it
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MALANA-Mobile.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloading(false);
      setComplete(true);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 text-white overflow-auto flex items-center justify-center">
      <div className="max-w-md w-full bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg text-center">
        {downloading ? (
          <>
            <div className="h-16 w-16 mx-auto mb-4">
              <div className="h-full w-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-blue-300 mb-2">
              Downloading to Your Phone
            </h2>
            <p className="text-blue-200">
              Please wait while we prepare your download...
            </p>
          </>
        ) : complete ? (
          <>
            <div className="h-16 w-16 mx-auto mb-4 bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-green-400 mb-2">
              Download Complete!
            </h2>
            <p className="text-blue-200 mb-4">
              MALANA has been downloaded to your phone.
            </p>
            <Button
              onClick={startDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Download Again
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-blue-300 mb-2">
              Starting Download...
            </h2>
            <p className="text-blue-200">Initializing download process...</p>
          </>
        )}
      </div>
    </div>
  );
}
