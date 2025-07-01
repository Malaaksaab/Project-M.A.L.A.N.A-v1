import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Zap, Clock } from "lucide-react";

interface AssistantDashboardProps {
  lastCommand: string;
  commandResponse: string;
}

const AssistantDashboard = ({
  lastCommand,
  commandResponse,
}: AssistantDashboardProps) => {
  const [textCommand, setTextCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<
    { command: string; response: string; timestamp: string }[]
  >([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTextCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textCommand.trim()) {
      // In a real app, this would process the text command
      // For now, we'll just add it to history
      setCommandHistory([
        ...commandHistory,
        {
          command: textCommand,
          response: "Processing request... Command executed successfully.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setTextCommand("");
    }
  };

  // Format response with line breaks
  const formatResponse = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className={i === 0 ? "" : "mt-1"}>
        {line}
      </p>
    ));
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-b from-transparent to-blue-950/20">
      {/* Time display */}
      <div className="flex justify-between items-center text-xs text-blue-300/80">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
        <div>{currentTime.toLocaleDateString()}</div>
      </div>

      {/* Command response area */}
      <Card className="p-4 bg-blue-900/20 border border-blue-500/30 min-h-[120px] max-h-[200px] overflow-y-auto rounded-lg text-blue-100">
        {commandResponse ? (
          <div>
            {lastCommand && (
              <div className="flex items-center gap-1 text-xs text-blue-300/80 mb-2 pb-2 border-b border-blue-500/20">
                <Zap className="h-3 w-3" />
                <p>You said: "{lastCommand}"</p>
              </div>
            )}
            <div className="font-medium space-y-1 text-sm">
              {formatResponse(commandResponse)}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <Zap className="h-8 w-8 text-blue-400/80" />
            </div>
            <p className="text-blue-300/80 text-sm">
              Say "Hey MALANA" or type a command below
            </p>
          </div>
        )}
      </Card>

      {/* Command history */}
      {commandHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-blue-300">Recent Commands</h4>
          <div className="space-y-2 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent pr-1">
            {commandHistory.map((item, index) => (
              <div
                key={index}
                className="text-xs p-2 bg-blue-900/20 border border-blue-500/20 rounded-md text-blue-100"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">You: {item.command}</p>
                  <span className="text-[10px] text-blue-400/60">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-blue-300/80">MALANA: {item.response}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text command input */}
      <form onSubmit={handleTextCommandSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a command..."
          value={textCommand}
          onChange={(e) => setTextCommand(e.target.value)}
          className="flex-1 bg-blue-900/20 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50 focus-visible:ring-blue-500"
        />
        <Button
          type="submit"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default AssistantDashboard;
