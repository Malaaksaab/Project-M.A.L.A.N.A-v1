import { useState, useEffect } from "react";
import { Mic, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VoiceCommandProcessorProps {
  isListening: boolean;
  onToggleListening: () => void;
  onCommandReceived: (command: string) => void;
}

const VoiceCommandProcessor = ({
  isListening,
  onToggleListening,
  onCommandReceived,
}: VoiceCommandProcessorProps) => {
  const [visualizerValues, setVisualizerValues] = useState<number[]>([
    10, 20, 30, 40, 50, 60, 50, 40, 30, 20, 10,
  ]);

  // Simulate voice processing with random visualizer values
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isListening) {
      interval = setInterval(() => {
        const newValues = Array(11)
          .fill(0)
          .map(() => Math.floor(Math.random() * 90) + 10);
        setVisualizerValues(newValues);
      }, 150);

      // Simulate receiving a command after 3 seconds
      const timeout = setTimeout(() => {
        const sampleCommands = [
          "search for latest technology news",
          "open calendar",
          "what's the weather today",
          "set a reminder for tomorrow",
          "system status",
          "play some music",
          "what time is it",
          "what is quantum computing",
        ];
        const randomCommand =
          sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        onCommandReceived(randomCommand);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, onCommandReceived]);

  return (
    <div className="p-4 border-t border-blue-500/20 bg-gradient-to-t from-blue-950/30 to-transparent">
      {isListening && (
        <div className="mb-4 flex justify-center items-end h-14 gap-[2px]">
          {visualizerValues.map((value, index) => (
            <div
              key={index}
              className="w-2 transition-all duration-150 ease-in-out rounded-t-full bg-gradient-to-t from-blue-400 to-blue-600"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={onToggleListening}
          variant="outline"
          className={`rounded-full w-14 h-14 p-0 flex items-center justify-center border-2 ${isListening ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30" : "bg-blue-900/50 border-blue-500/50 hover:bg-blue-800/70 hover:border-blue-400/70"}`}
        >
          {isListening ? (
            <Activity className="h-6 w-6 text-white animate-pulse" />
          ) : (
            <Mic className="h-6 w-6 text-blue-300" />
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center mt-3 gap-1">
        <div
          className={`w-2 h-2 rounded-full ${isListening ? "bg-blue-500 animate-pulse" : "bg-blue-800"}`}
        ></div>
        <p className="text-xs text-center text-blue-300">
          {isListening ? "Listening..." : 'Say "Hey MALANA" or press Alt+Space'}
        </p>
      </div>

      {/* Command suggestions */}
      {!isListening && (
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-[10px]">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 py-0 px-2 text-blue-400 hover:text-white hover:bg-blue-800/50"
          >
            "What's the weather?"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 py-0 px-2 text-blue-400 hover:text-white hover:bg-blue-800/50"
          >
            "System status"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 py-0 px-2 text-blue-400 hover:text-white hover:bg-blue-800/50"
          >
            "Play music"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 py-0 px-2 text-blue-400 hover:text-white hover:bg-blue-800/50"
          >
            "Check email"
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 py-0 px-2 text-blue-400 hover:text-white hover:bg-blue-800/50"
          >
            "Find file"
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandProcessor;
