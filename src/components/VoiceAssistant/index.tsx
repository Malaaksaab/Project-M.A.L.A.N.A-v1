import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Mic,
  Settings,
  Minimize,
  X,
  Volume2,
  Brain,
  Zap,
  Search,
  Calendar,
  Clock,
  Cloud,
  Cpu,
  Database,
  Globe,
  HelpCircle,
  Home,
  Mail,
  Music,
  Power,
  Shield,
  Thermometer,
  User,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AssistantDashboard from "./AssistantDashboard";
import VoiceCommandProcessor from "./VoiceCommandProcessor";
import SettingsPanel from "./SettingsPanel";
import SystemTrayIcon from "./SystemTrayIcon";
import voiceRecognition from "@/lib/voiceRecognition";
import commandProcessor from "@/lib/commandProcessor";
import appExporter from "@/lib/appExporter";

export interface AssistantSettings {
  wakeWord: string;
  hotkey: string;
  voiceType: string;
  formalityLevel: "casual" | "formal" | "professional";
  permissions: {
    microphone: boolean;
    systemCommands: boolean;
    browserAccess: boolean;
    fileAccess: boolean;
    personalData: boolean;
  };
  customResponses: {
    greeting: string;
    farewell: string;
    acknowledgment: string;
  };
  securitySettings: {
    voiceAuthentication: boolean;
    passwordProtection: boolean;
    privacyMode: boolean;
  };
}

const VoiceAssistant = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [commandResponse, setCommandResponse] = useState("");
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isLegacyOS, setIsLegacyOS] = useState(false);
  const [settings, setSettings] = useState<AssistantSettings>({
    wakeWord: "Hey MALANA",
    hotkey: "Alt+Space",
    voiceType: "default",
    formalityLevel: "professional",
    permissions: {
      microphone: true,
      systemCommands: true,
      browserAccess: true,
      fileAccess: false,
      personalData: false,
    },
    customResponses: {
      greeting: "At your service. How may I assist you today?",
      farewell: "Goodbye. I'll be here when you need me.",
      acknowledgment: "Command received. Processing your request.",
    },
    securitySettings: {
      voiceAuthentication: false,
      passwordProtection: false,
      privacyMode: true,
    },
  });

  // Initialize voice recognition
  useEffect(() => {
    // Start voice recognition service
    voiceRecognition.start();

    // Set wake word from settings
    voiceRecognition.setWakeWord(settings.wakeWord);

    // Set up command handler
    voiceRecognition.onCommand(processCommand);

    // Set up status change handler
    voiceRecognition.onStatusChange((status) => {
      if (status === "listening") {
        setIsListening(true);
        setCommandResponse("Listening...");
      } else if (status === "processing") {
        setCommandResponse("Processing your request...");
      } else {
        setIsListening(false);
      }
    });

    return () => {
      // Clean up voice recognition
      voiceRecognition.stop();
    };
  }, []);

  // Toggle minimized state
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
    if (showSettings) setShowSettings(false);
  };

  // Toggle listening state
  const toggleListening = () => {
    if (!isListening) {
      voiceRecognition.manualListenForCommand();
    } else {
      voiceRecognition.stop();
      setCommandResponse("");
    }
  };

  // Process voice command with command processor
  const processCommand = async (command: string) => {
    setLastCommand(command);

    try {
      // Process the command using the command processor
      const result = await commandProcessor.processCommand(command);
      setCommandResponse(result.response);
      setActiveModule(result.category);

      // Special handling for goodbye command
      if (
        command.toLowerCase().includes("goodbye") ||
        command.toLowerCase().includes("bye")
      ) {
        setTimeout(() => setIsMinimized(true), 3000);
      }

      // Special handling for privacy mode
      if (
        command.toLowerCase().includes("privacy mode") ||
        command.toLowerCase().includes("enable privacy")
      ) {
        setSettings((prev) => ({
          ...prev,
          securitySettings: {
            ...prev.securitySettings,
            privacyMode: true,
          },
        }));
      }

      if (command.toLowerCase().includes("disable privacy")) {
        setSettings((prev) => ({
          ...prev,
          securitySettings: {
            ...prev.securitySettings,
            privacyMode: false,
          },
        }));
      }
    } catch (error) {
      console.error("Error processing command:", error);
      setCommandResponse(
        "I'm sorry, I encountered an error processing your request.",
      );
      setActiveModule(null);
    }
  };

  // Update settings
  const updateSettings = (newSettings: AssistantSettings) => {
    setSettings(newSettings);
    // Update wake word in voice recognition
    voiceRecognition.setWakeWord(newSettings.wakeWord);
    setShowSettings(false);
  };

  // Handle system tray icon click
  const handleSystemTrayClick = () => {
    setIsMinimized(false);
  };

  // Handle download app
  const handleDownloadApp = async () => {
    try {
      setCommandResponse("Preparing to download MALANA Desktop Assistant...");
      await appExporter.downloadApp();
      setCommandResponse(
        "Download complete! You can find MALANA-Desktop-Assistant.zip in your downloads folder.",
      );
    } catch (error) {
      console.error("Error downloading app:", error);
      setCommandResponse(
        "I encountered an error while preparing the download. Please try again later.",
      );
    }
  };

  // Detect legacy OS for UI adjustments
  useLayoutEffect(() => {
    // Check if we're running in Electron
    const isElectron =
      window.navigator.userAgent.toLowerCase().indexOf("electron") > -1;
    if (
      isElectron &&
      window.navigator.userAgent.indexOf("Windows NT 6.1") > -1
    ) {
      // Windows 7 is NT 6.1
      setIsLegacyOS(true);
    } else if (
      isElectron &&
      window.navigator.userAgent.indexOf("Windows NT 6.0") > -1
    ) {
      // Windows Vista is NT 6.0
      setIsLegacyOS(true);
    } else if (
      isElectron &&
      window.navigator.userAgent.indexOf("Windows NT 5") > -1
    ) {
      // Windows XP is NT 5.x
      setIsLegacyOS(true);
    }
  }, []);

  // Simulate hotkey press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Alt+Space was pressed (simulating the hotkey)
      // For older Windows, also support F1 as an alternative hotkey
      if ((e.altKey && e.code === "Space") || (isLegacyOS && e.key === "F1")) {
        if (isMinimized) {
          setIsMinimized(false);
        }
        toggleListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMinimized, isListening, isLegacyOS]);

  // Get module icon based on active module
  const getModuleIcon = () => {
    switch (activeModule) {
      case "search":
        return <Search className="h-6 w-6 text-blue-500" />;
      case "system":
        return <Cpu className="h-6 w-6 text-green-500" />;
      case "weather":
        return <Cloud className="h-6 w-6 text-sky-500" />;
      case "time":
        return <Clock className="h-6 w-6 text-amber-500" />;
      case "calendar":
        return <Calendar className="h-6 w-6 text-red-500" />;
      case "music":
        return <Music className="h-6 w-6 text-purple-500" />;
      case "knowledge":
        return <Brain className="h-6 w-6 text-indigo-500" />;
      case "email":
        return <Mail className="h-6 w-6 text-blue-400" />;
      case "files":
        return <Database className="h-6 w-6 text-yellow-500" />;
      case "security":
        return <Shield className="h-6 w-6 text-red-400" />;
      default:
        return <Brain className="h-6 w-6 text-primary" />;
    }
  };

  if (isMinimized) {
    return <SystemTrayIcon onClick={handleSystemTrayClick} />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-[420px] shadow-xl ${isLegacyOS ? "bg-black" : "bg-black/90"} border border-blue-500/50 ${isLegacyOS ? "rounded-lg" : "rounded-xl"} overflow-hidden text-white`}
      >
        <div
          className={`${isLegacyOS ? "bg-blue-900" : "bg-gradient-to-r from-blue-900/80 to-indigo-900/80"} flex justify-between items-center p-3 border-b border-blue-500/30`}
        >
          <div className="flex items-center gap-2">
            {getModuleIcon()}
            <div>
              <h3 className="font-bold tracking-wide text-blue-300">
                M.A.L.A.N.A
              </h3>
              <p className="text-xs text-blue-400/80">
                Multi-Adaptive Learning Artificial Neural Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-blue-300 hover:text-white hover:bg-blue-800/50"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white border-blue-500">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMinimized}
                    className="text-blue-300 hover:text-white hover:bg-blue-800/50"
                  >
                    <Minimize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white border-blue-500">
                  <p>Minimize</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(true)}
                    className="text-blue-300 hover:text-white hover:bg-blue-800/50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white border-blue-500">
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Quick action buttons */}
        {!showSettings && (
          <div className="flex overflow-x-auto py-2 px-3 gap-2 bg-blue-950/30 border-b border-blue-500/20">
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-xs text-blue-300 hover:text-white hover:bg-blue-800/50"
            >
              <Home className="h-3 w-3 mr-1" /> Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-xs text-blue-300 hover:text-white hover:bg-blue-800/50"
            >
              <Search className="h-3 w-3 mr-1" /> Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-xs text-blue-300 hover:text-white hover:bg-blue-800/50"
            >
              <Calendar className="h-3 w-3 mr-1" /> Calendar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-xs text-blue-300 hover:text-white hover:bg-blue-800/50"
            >
              <Cloud className="h-3 w-3 mr-1" /> Weather
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-xs text-blue-300 hover:text-white hover:bg-blue-800/50"
            >
              <Music className="h-3 w-3 mr-1" /> Music
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-xs text-blue-300 hover:text-white hover:bg-blue-800/50"
              onClick={handleDownloadApp}
            >
              <Download className="h-3 w-3 mr-1" /> Download
            </Button>
          </div>
        )}

        {showSettings ? (
          <SettingsPanel settings={settings} onSave={updateSettings} />
        ) : (
          <>
            <AssistantDashboard
              lastCommand={lastCommand}
              commandResponse={commandResponse}
            />
            <VoiceCommandProcessor
              isListening={isListening}
              onToggleListening={toggleListening}
              onCommandReceived={processCommand}
            />
          </>
        )}

        {/* Status bar */}
        {!showSettings && (
          <div className="flex justify-between items-center px-3 py-1 text-[10px] bg-blue-950/50 text-blue-400 border-t border-blue-500/20">
            <div>Status: Online</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center">
                <Database className="h-3 w-3 mr-1" /> Connected
              </span>
              <span className="flex items-center">
                <Shield className="h-3 w-3 mr-1" /> Secure
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VoiceAssistant;
