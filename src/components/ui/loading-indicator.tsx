import { Brain, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingIndicatorProps {
  variant?: "default" | "brain" | "minimal";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingIndicator({
  variant = "default",
  size = "md",
  text = "Loading...",
  className,
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  const containerSizeClasses = {
    sm: "p-2 gap-2",
    md: "p-3 gap-3",
    lg: "p-4 gap-4",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (variant === "brain") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <div
          className={cn(
            "rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center",
            size === "sm"
              ? "h-8 w-8"
              : size === "md"
                ? "h-12 w-12"
                : "h-16 w-16",
          )}
        >
          <Brain
            className={cn("text-blue-400 animate-pulse", sizeClasses[size])}
          />
        </div>
        {text && (
          <p className={cn("mt-2 text-blue-300/80", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2
          className={cn("animate-spin text-blue-500", sizeClasses[size])}
        />
        {text && (
          <span className={cn("text-blue-300", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-blue-900/20 border border-blue-500/30 rounded-lg",
        containerSizeClasses[size],
        className,
      )}
    >
      <Loader2
        className={cn("animate-spin text-blue-500", sizeClasses[size])}
      />
      {text && (
        <p className={cn("text-blue-300", textSizeClasses[size])}>{text}</p>
      )}
    </div>
  );
}
