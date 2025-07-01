import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SystemTrayIconProps {
  onClick: () => void;
}

const SystemTrayIcon = ({ onClick }: SystemTrayIconProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onClick}
              className="h-12 w-12 rounded-full bg-black shadow-lg border-2 border-blue-500/50 hover:bg-blue-950/80 hover:border-blue-400 group relative overflow-hidden"
              style={{ WebkitAppRegion: "no-drag" }} // Prevent dragging on older Windows
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/30 group-hover:opacity-100 opacity-70 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-400 group-hover:text-blue-300 z-10" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/70 group-hover:bg-blue-400"></div>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-blue-900 text-white border-blue-500"
          >
            <p>Open M.A.L.A.N.A</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SystemTrayIcon;
