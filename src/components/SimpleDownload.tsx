import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";

export default function SimpleDownload() {
  const [downloading, setDownloading] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleDownload = () => {
    setDownloading(true);

    // Create a simple text file with instructions
    const content = `MALANA Desktop Assistant
============================

Thank you for downloading MALANA Desktop Assistant!

To get the full project:

1. Visit: https://github.com/TempoLabsAI/malana-desktop-assistant
2. Click the green "Code" button
3. Select "Download ZIP"

Or use this direct link:
https://github.com/TempoLabsAI/malana-desktop-assistant/archive/refs/heads/main.zip

Installation:
1. Extract the ZIP file
2. Run npm install
3. Run npm start

Enjoy using MALANA!`;

    // Create a blob and download it
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MALANA-Download-Instructions.txt";
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
    <div className="p-6 flex flex-col items-center justify-center bg-blue-900/20 border border-blue-500/30 rounded-lg">
      <h2 className="text-2xl font-bold text-blue-300 mb-4">
        Download MALANA Assistant
      </h2>

      {!complete ? (
        <Button
          onClick={handleDownload}
          disabled={downloading}
          size="lg"
          className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-lg"
        >
          {downloading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Preparing Download...</span>
            </>
          ) : (
            <>
              <Download className="h-6 w-6" />
              <span>Download Now</span>
            </>
          )}
        </Button>
      ) : (
        <div className="w-full max-w-md bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
            <Check className="h-6 w-6" />
            <span className="text-lg font-medium">Download Complete!</span>
          </div>
          <p className="text-green-300">
            Check your downloads folder for instructions.
          </p>
          <Button
            onClick={() => setComplete(false)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Download Again
          </Button>
        </div>
      )}

      <p className="mt-4 text-blue-300/80 text-sm text-center">
        This will download a text file with simple instructions to get the
        complete project.
      </p>
    </div>
  );
}
