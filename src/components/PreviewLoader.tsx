import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Play, RefreshCw } from "lucide-react";

export interface PreviewLoaderProps {
  onComplete?: () => void;
  autoStart?: boolean;
  loadingText?: string;
  showProgress?: boolean;
}

export default function PreviewLoader({
  onComplete,
  autoStart = true,
  loadingText = "Preparing app preview...",
  showProgress = true,
}: PreviewLoaderProps) {
  const [loading, setLoading] = useState(autoStart);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Initializing");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (loading) {
      // Simulate loading stages
      const stages = [
        "Initializing",
        "Loading dependencies",
        "Building components",
        "Optimizing assets",
        "Finalizing preview",
      ];

      let currentStageIndex = 0;
      setStage(stages[currentStageIndex]);

      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 5;
          const newProgress = prev + increment;

          // Change stage based on progress
          const stageIndex = Math.min(
            Math.floor(newProgress / 20),
            stages.length - 1,
          );

          if (stageIndex !== currentStageIndex) {
            currentStageIndex = stageIndex;
            setStage(stages[currentStageIndex]);
          }

          if (newProgress >= 100) {
            clearInterval(interval);
            timeout = setTimeout(() => {
              setLoading(false);
              setCompleted(true);
              if (onComplete) onComplete();
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [loading, onComplete]);

  const handleStart = () => {
    setLoading(true);
    setProgress(0);
    setCompleted(false);
  };

  if (!loading && completed) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-blue-900/10 border border-blue-500/20 rounded-lg">
        <div className="text-green-400 mb-4 text-xl">Preview Ready!</div>
        <Button
          onClick={handleStart}
          variant="outline"
          className="border-blue-500/50 text-blue-300 hover:bg-blue-900/50 gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Reload Preview
        </Button>
        <Button
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => window.open("/", "_blank")}
        >
          <Play className="h-4 w-4" /> Open Preview
        </Button>
      </div>
    );
  }

  if (!loading && !autoStart) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-blue-900/10 border border-blue-500/20 rounded-lg">
        <Button
          onClick={handleStart}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Play className="h-4 w-4" /> Start Preview
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-blue-900/10 border border-blue-500/20 rounded-lg">
      <div className="w-20 h-20 mb-4 relative">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border-2 border-blue-400/50 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="h-10 w-10 text-blue-500 animate-pulse" />
        </div>
      </div>
      <div className="text-blue-300 text-lg mb-3">{loadingText}</div>

      {showProgress && (
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs text-blue-300/80">
            <span>{stage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-blue-900/30"
            indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
        </div>
      )}
    </div>
  );
}
