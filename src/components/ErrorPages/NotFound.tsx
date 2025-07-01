import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Home, ArrowLeft, RefreshCw, Brain } from "lucide-react";

export interface NotFoundProps {
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  errorCode?: number;
  errorMessage?: string;
}

export default function NotFound({
  onRetry = () => window.location.reload(),
  onGoHome = () => (window.location.href = "/"),
  onGoBack = () => window.history.back(),
  errorCode = 404,
  errorMessage = "The page you're looking for couldn't be found",
}: NotFoundProps) {
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(true);

  // Auto-redirect countdown
  useEffect(() => {
    if (!isRedirecting) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onGoHome();
    }
  }, [countdown, isRedirecting, onGoHome]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <Card className="max-w-md w-full bg-blue-900/20 border-blue-500/30 p-6 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-blue-400" />
          </div>

          <h1 className="text-5xl font-bold text-blue-300 mb-2">{errorCode}</h1>
          <h2 className="text-xl font-semibold text-blue-200 mb-4">
            Page Not Found
          </h2>

          <p className="text-blue-100/90 mb-6">{errorMessage}</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-900/50 gap-2"
              onClick={onGoBack}
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>

            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={onGoHome}
            >
              <Home className="h-4 w-4" /> Home
            </Button>
          </div>

          <Button
            variant="ghost"
            className="mt-3 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 gap-2"
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>

          {isRedirecting && (
            <div className="mt-6 w-full">
              <div className="flex justify-between text-xs text-blue-400/80 mb-1">
                <span className="flex items-center gap-1">
                  <Brain className="h-3 w-3" /> Auto-redirect
                </span>
                <button
                  onClick={() => setIsRedirecting(false)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Cancel
                </button>
              </div>
              <Progress
                value={(countdown / 10) * 100}
                className="h-1 bg-blue-900/30"
                indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
              />
              <p className="text-xs text-blue-400/60 mt-1">
                Redirecting to home in {countdown} seconds...
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-8 text-center text-blue-400/60 text-sm">
        <p>© 2023 M.A.L.A.N.A - Advanced AI Assistant</p>
      </div>
    </div>
  );
}
