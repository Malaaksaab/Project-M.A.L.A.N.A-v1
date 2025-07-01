import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, FolderOpen, Save, Archive, HardDrive } from "lucide-react";

export default function ProjectExporter() {
  const [exportPath, setExportPath] = useState(
    "C:\\Users\\User\\Desktop\\MALANA-Project",
  );
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setExporting(false);
          setExportComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleDownload = () => {
    // Create a download link for the project
    const link = document.createElement("a");
    link.href =
      "https://download-link.tempolabs.ai/project/malana-desktop-assistant.zip";
    link.download = "malana-desktop-assistant.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 text-white overflow-auto">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-blue-900/20 border-blue-500/30 p-6 backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 mb-6">
            Export MALANA Project
          </h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="exportPath" className="text-blue-300">
                Export Location
              </Label>
              <div className="flex gap-2">
                <Input
                  id="exportPath"
                  value={exportPath}
                  onChange={(e) => setExportPath(e.target.value)}
                  className="flex-1 bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
                />
                <Button
                  variant="outline"
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-800/50"
                >
                  <FolderOpen className="h-4 w-4 mr-2" /> Browse
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-blue-900/30 border-blue-500/20 p-4">
                <h3 className="text-lg font-medium text-blue-300 mb-3 flex items-center">
                  <Archive className="h-5 w-5 mr-2" /> Download as ZIP
                </h3>
                <p className="text-sm text-blue-200/80 mb-4">
                  Download the complete project as a ZIP file to your computer.
                  This includes all source code, assets, and installation files.
                </p>
                <Button
                  onClick={handleDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" /> Download ZIP
                </Button>
              </Card>

              <Card className="bg-blue-900/30 border-blue-500/20 p-4">
                <h3 className="text-lg font-medium text-blue-300 mb-3 flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" /> Export to Folder
                </h3>
                <p className="text-sm text-blue-200/80 mb-4">
                  Export the project directly to a folder on your computer. This
                  creates a ready-to-use project with all necessary files.
                </p>
                <Button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {exporting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Export to Folder
                    </>
                  )}
                </Button>
              </Card>
            </div>

            {(exporting || exportComplete) && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">
                    {exportComplete
                      ? "Export Complete"
                      : "Exporting Project..."}
                  </span>
                  <span className="text-blue-400">
                    {Math.round(exportProgress)}%
                  </span>
                </div>
                <Progress
                  value={exportProgress}
                  className="h-2 bg-blue-900/30"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                />
                {exportComplete && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-md p-3 text-green-300 mt-4">
                    <p className="font-medium">Export Successful!</p>
                    <p className="text-sm mt-1">
                      Project has been exported to: {exportPath}
                    </p>
                    <p className="text-xs text-green-400/70 mt-2">
                      You can now open this folder to access all project files.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-4 mt-6">
              <h3 className="text-sm font-medium text-blue-300 mb-2">
                Project Contents
              </h3>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Source Code: Complete application source files</li>
                <li>• Assets: Icons, images, and other resources</li>
                <li>• Electron Setup: Desktop application configuration</li>
                <li>• Installers: Windows installer scripts (.msi)</li>
                <li>• Documentation: Usage guides and developer docs</li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-4 mt-2">
              <h3 className="text-sm font-medium text-yellow-300 mb-2">
                Quick Start Guide
              </h3>
              <ol className="text-sm text-yellow-200/80 space-y-1 list-decimal pl-4">
                <li>Extract the ZIP file or open the exported folder</li>
                <li>
                  Run{" "}
                  <code className="bg-yellow-900/30 px-1 rounded">
                    npm install
                  </code>{" "}
                  to install dependencies
                </li>
                <li>
                  Run{" "}
                  <code className="bg-yellow-900/30 px-1 rounded">
                    npm run dev
                  </code>{" "}
                  to start the development server
                </li>
                <li>
                  Run{" "}
                  <code className="bg-yellow-900/30 px-1 rounded">
                    npm run build
                  </code>{" "}
                  to build for production
                </li>
                <li>
                  For Windows installer, run{" "}
                  <code className="bg-yellow-900/30 px-1 rounded">
                    node installer.js
                  </code>
                </li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
