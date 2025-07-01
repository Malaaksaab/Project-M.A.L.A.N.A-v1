import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Download, FileDown, Loader2 } from "lucide-react";
import type { CustomizationConfig } from "./index";

interface ProjectExporterProps {
  config: CustomizationConfig;
  exportType: "installer" | "source" | "portable";
  exportPath: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectExporter({
  config,
  exportType,
  exportPath,
  isOpen,
  onClose,
}: ProjectExporterProps) {
  const [exportProgress, setExportProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate export process
  useEffect(() => {
    if (!isOpen) return;

    const steps = [
      "Preparing project files",
      "Applying customizations",
      "Generating configuration",
      "Building application",
      "Creating installers",
      "Packaging files",
      "Finalizing export",
    ];

    let currentStepIndex = 0;
    setCurrentStep(steps[currentStepIndex]);
    setExportProgress(0);
    setIsComplete(false);
    setError(null);

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex]);
        setExportProgress((prev) => {
          const increment = Math.random() * 10 + 5;
          const newProgress = prev + increment;

          if (newProgress >= (currentStepIndex + 1) * (100 / steps.length)) {
            currentStepIndex++;
          }

          if (newProgress >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            return 100;
          }

          return newProgress;
        });
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    // For now, we'll just simulate it with a link
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${config.appName.replace(/\s+/g, "-")}-${exportType}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-blue-950 border-blue-500/50 text-blue-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-300">
            {isComplete ? "Export Complete" : "Exporting Project"}
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-300">{currentStep}</span>
              <span className="text-blue-400">
                {Math.round(exportProgress)}%
              </span>
            </div>
            <Progress
              value={exportProgress}
              className="h-2 bg-blue-900/30"
              indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
            />

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-3 text-xs text-blue-300/80">
              <p>
                Exporting {config.appName} as{" "}
                {exportType === "installer"
                  ? "Windows Installer"
                  : exportType === "source"
                    ? "Source Code"
                    : "Portable Application"}
                .
              </p>
              <p className="mt-1">Export location: {exportPath}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6">
              <div className="h-16 w-16 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-medium text-blue-300 mb-1">
                Export Successful
              </h3>
              <p className="text-sm text-blue-400/80">
                Your customized MALANA assistant has been exported successfully.
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-3 text-xs text-blue-300/80">
              <p>
                Export type:{" "}
                {exportType === "installer"
                  ? "Windows Installer (.msi)"
                  : exportType === "source"
                    ? "Source Code Project"
                    : "Portable Application (.exe)"}
              </p>
              <p>Location: {exportPath}</p>
              <p>Size: {Math.round(10 + Math.random() * 20)}MB</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isComplete ? (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-blue-500/30 text-blue-300 hover:bg-blue-800/50"
              disabled={exportProgress < 100}
            >
              Cancel
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-800/50"
              >
                Close
              </Button>
              <Button
                onClick={handleDownload}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <FileDown className="h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
