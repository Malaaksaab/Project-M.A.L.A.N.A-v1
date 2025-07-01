import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import VoiceAssistant from "@/components/VoiceAssistant";
import {
  Brain,
  Calendar,
  Clock,
  Cloud,
  Cpu,
  Database,
  FileText,
  Gauge,
  Globe,
  Mail,
  Music,
  Power,
  Search,
  Shield,
  Thermometer,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export interface DesktopInterfaceProps {
  userName?: string;
  location?: string;
}

export default function DesktopInterface({
  userName = "User",
  location = "New York, USA",
}: DesktopInterfaceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(32);
  const [ramUsage, setRamUsage] = useState(45);
  const [diskUsage, setDiskUsage] = useState(68);
  const [temperature, setTemperature] = useState(72);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState("Online");
  const [notifications, setNotifications] = useState([
    "System update available",
    "Disk cleanup recommended",
    "3 new emails received",
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate changing system metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 20);
      setRamUsage(Math.floor(Math.random() * 20) + 40);
      setDiskUsage(Math.floor(Math.random() * 10) + 65);
      setTemperature(Math.floor(Math.random() * 5) + 70);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center">
        <div className="w-32 h-32 mb-8 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-2 border-blue-400/50 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="h-16 w-16 text-blue-500 animate-pulse" />
          </div>
        </div>
        <div className="text-blue-500 text-2xl font-bold mb-4">M.A.L.A.N.A</div>
        <div className="text-blue-400/80 text-sm mb-8">
          System Initializing...
        </div>
        <Progress
          value={isLoading ? 65 : 100}
          className="w-64 h-1 bg-blue-900/30"
          indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black text-blue-400 overflow-hidden font-mono relative">
      {/* Top navigation bar with numbers */}
      <div className="flex justify-between px-4 py-1 border-b border-blue-500/30 text-xs">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="text-blue-500">
            {(i + 1).toString().padStart(2, "0")}
          </div>
        ))}
      </div>
      {/* Main content */}
      <div className="grid grid-cols-12 gap-2 p-2 h-[calc(100%-4rem)]">
        {/* Left sidebar */}
        <div className="col-span-2 flex flex-col gap-2">
          {/* Date and time */}
          <Card className="bg-blue-900/10 border-blue-500/30 p-3 relative overflow-hidden">
            <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full border-4 border-blue-500/30"></div>
            <div className="absolute -left-8 -top-8 w-24 h-24 rounded-full border-2 border-blue-400/50"></div>
            <div className="relative z-10">
              <div className="text-xs text-blue-400/80">
                {currentTime.toLocaleDateString("en-US", { weekday: "long" })}
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {currentTime.getHours().toString().padStart(2, "0")}:
                {currentTime.getMinutes().toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-blue-400/80 mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </Card>

          {/* System status */}
          <Card className="bg-blue-900/10 border-blue-500/30 p-3 flex-1">
            <div className="text-xs text-blue-400/80 mb-2">System Status</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" /> CPU
                  </span>
                  <span>{cpuUsage}%</span>
                </div>
                <Progress
                  value={cpuUsage}
                  className="h-1 bg-blue-900/30"
                  indicatorClassName="bg-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Database className="h-3 w-3" /> RAM
                  </span>
                  <span>{ramUsage}%</span>
                </div>
                <Progress
                  value={ramUsage}
                  className="h-1 bg-blue-900/30"
                  indicatorClassName="bg-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Disk
                  </span>
                  <span>{diskUsage}%</span>
                </div>
                <Progress
                  value={diskUsage}
                  className="h-1 bg-blue-900/30"
                  indicatorClassName="bg-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" /> Temp
                  </span>
                  <span>{temperature}°F</span>
                </div>
                <Progress
                  value={(temperature - 60) * 2}
                  className="h-1 bg-blue-900/30"
                  indicatorClassName={`${temperature > 80 ? "bg-red-500" : "bg-blue-500"}`}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-500/20">
              <div className="text-xs text-blue-400/80 mb-2">Energy</div>
              <div className="relative h-16 w-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
                  style={{ transform: "rotate(45deg)" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  100%
                </div>
              </div>
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="bg-blue-900/10 border-blue-500/30 p-2">
            <div className="grid grid-cols-3 gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-full p-0 flex flex-col items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              >
                <Search className="h-4 w-4 mb-1" />
                <span className="text-[8px]">Search</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-full p-0 flex flex-col items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              >
                <Mail className="h-4 w-4 mb-1" />
                <span className="text-[8px]">Mail</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-full p-0 flex flex-col items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              >
                <Calendar className="h-4 w-4 mb-1" />
                <span className="text-[8px]">Calendar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-full p-0 flex flex-col items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              >
                <Globe className="h-4 w-4 mb-1" />
                <span className="text-[8px]">Web</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-full p-0 flex flex-col items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              >
                <Music className="h-4 w-4 mb-1" />
                <span className="text-[8px]">Music</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-full p-0 flex flex-col items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              >
                <Power className="h-4 w-4 mb-1" />
                <span className="text-[8px]">Power</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Center content */}
        <div className="col-span-7 flex flex-col gap-2">
          {/* Main visualization */}
          <Card className="bg-blue-900/10 border-blue-500/30 p-4 flex-1 relative overflow-hidden">
            <div className="inset-0 flex items-center justify-center absolute">
              <div className="relative">
                {/* Outer circle */}
                <div
                  className="absolute -inset-32 rounded-full border border-blue-500/20 animate-spin"
                  style={{ animationDuration: "120s" }}
                ></div>
                <div
                  className="absolute -inset-24 rounded-full border border-blue-500/30 animate-spin"
                  style={{ animationDuration: "100s" }}
                ></div>

                {/* Middle circles */}
                <div
                  className="absolute -inset-16 rounded-full border border-blue-500/40 animate-spin"
                  style={{ animationDuration: "80s" }}
                ></div>
                <div
                  className="absolute -inset-12 rounded-full border border-blue-500/50 animate-spin"
                  style={{ animationDuration: "60s" }}
                ></div>

                {/* Inner circles */}
                <div
                  className="absolute -inset-8 rounded-full border border-blue-500/60 animate-spin"
                  style={{ animationDuration: "40s" }}
                ></div>
                <div
                  className="absolute -inset-4 rounded-full border border-blue-500/70 animate-spin"
                  style={{ animationDuration: "20s" }}
                ></div>

                {/* Center */}
                <div className="relative h-32 w-32 rounded-full bg-blue-900/30 border border-blue-500/80 flex items-center justify-center">
                  <div className="absolute inset-2 rounded-full border border-blue-400/50 animate-pulse"></div>
                  <div className="z-10">
                    <Brain className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating panels */}
            <div className="absolute top-4 left-4 w-48 bg-blue-900/20 border border-blue-500/30 p-2 rounded-md">
              <div className="text-xs text-blue-400/80 mb-1">
                System Diagnostics
              </div>
              <div className="text-sm">All systems operational</div>
              <div className="text-xs text-blue-400/60 mt-1">
                Security protocols active
              </div>
            </div>

            <div className="absolute bottom-4 right-4 w-48 bg-blue-900/20 border border-blue-500/30 p-2 rounded-md">
              <div className="text-xs text-blue-400/80 mb-1">
                Network Status
              </div>
              <div className="text-sm">Connected - 150 Mbps</div>
              <div className="text-xs text-blue-400/60 mt-1">
                Firewall: Active
              </div>
            </div>

            <div className="absolute top-4 right-4 w-48 bg-blue-900/20 border border-blue-500/30 p-2 rounded-md">
              <div className="text-xs text-blue-400/80 mb-1">User Profile</div>
              <div className="text-sm">{userName}</div>
              <div className="text-xs text-blue-400/60 mt-1">
                Admin privileges
              </div>
            </div>

            <div className="absolute bottom-4 left-4 w-48 bg-blue-900/20 border border-blue-500/30 p-2 rounded-md">
              <div className="text-xs text-blue-400/80 mb-1">Location Data</div>
              <div className="text-sm">{location}</div>
              <div className="text-xs text-blue-400/60 mt-1">GPS: Active</div>
            </div>
          </Card>

          {/* Bottom controls */}
          <div className="grid grid-cols-7 gap-2">
            <Card className="bg-blue-900/10 border-blue-500/30 p-2 col-span-5">
              <div className="flex justify-between items-center">
                <div className="text-xs text-blue-400/80">
                  M.A.L.A.N.A Interface v1.0
                </div>
                <div className="text-xs text-blue-400/80">{systemStatus}</div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-900/30"
                  onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Activate Assistant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-900/30"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Security Scan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-blue-500/50 text-blue-400 hover:bg-blue-900/30"
                >
                  <Gauge className="h-3 w-3 mr-1" />
                  Performance
                </Button>
              </div>
            </Card>

            <Card className="bg-blue-900/10 border-blue-500/30 p-2 col-span-2">
              <div className="text-xs text-blue-400/80 mb-1">Quick Command</div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a command..."
                  className="w-full bg-blue-900/30 border border-blue-500/30 rounded px-2 py-1 text-xs text-blue-300 placeholder:text-blue-500/50 focus:outline-none focus:border-blue-400"
                />
                <Button
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2 bg-transparent hover:bg-blue-900/50 text-blue-400"
                >
                  <Zap className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-3 flex flex-col gap-2">
          {/* Weather */}
          <Card className="bg-blue-900/10 border-blue-500/30 p-3 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full border-4 border-blue-500/30"></div>
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full border-2 border-blue-400/50"></div>
            <div className="relative z-10">
              <div className="text-xs text-blue-400/80 mb-1">{location}</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-500">72°F</div>
                  <div className="text-xs text-blue-400/80">Partly Cloudy</div>
                </div>
                <div>
                  <Cloud className="h-10 w-10 text-blue-400" />
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-blue-400/80">Wind</div>
                  <div>8 mph</div>
                </div>
                <div>
                  <div className="text-blue-400/80">Humidity</div>
                  <div>45%</div>
                </div>
                <div>
                  <div className="text-blue-400/80">Pressure</div>
                  <div>1012 hPa</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="bg-blue-900/10 border-blue-500/30 p-3 flex-1">
            <div className="text-xs text-blue-400/80 mb-2">Notifications</div>
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="text-xs p-2 bg-blue-900/20 border border-blue-500/20 rounded-md"
                >
                  {notification}
                </div>
              ))}
            </div>
          </Card>

          {/* System info */}
          <Card className="bg-blue-900/10 border-blue-500/30 p-3">
            <div className="text-xs text-blue-400/80 mb-2">
              System Information
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-400/80">OS:</span>
                <span>Windows 11 Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400/80">Processor:</span>
                <span>Intel Core i7-11700K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400/80">Memory:</span>
                <span>32GB DDR4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400/80">Storage:</span>
                <span>1TB SSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400/80">Graphics:</span>
                <span>NVIDIA RTX 3080</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* Bottom dock */}
      <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-blue-500/30 bg-blue-900/20 flex justify-center items-center gap-6 px-4">
        {[
          { icon: <Search className="h-5 w-5" />, label: "Search" },
          { icon: <Calendar className="h-5 w-5" />, label: "Calendar" },
          { icon: <Mail className="h-5 w-5" />, label: "Mail" },
          { icon: <Globe className="h-5 w-5" />, label: "Browser" },
          { icon: <FileText className="h-5 w-5" />, label: "Files" },
          { icon: <Shield className="h-5 w-5" />, label: "Security" },
          { icon: <User className="h-5 w-5" />, label: "Profile" },
          { icon: <Cpu className="h-5 w-5" />, label: "System" },
          { icon: <Brain className="h-5 w-5" />, label: "Assistant" },
        ].map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 bg-blue-900/30 border border-blue-500/50 hover:bg-blue-800/50 hover:border-blue-400 text-blue-400 hover:text-blue-300"
            onClick={() =>
              item.label === "Assistant" && setIsAssistantOpen(!isAssistantOpen)
            }
          >
            {item.icon}
          </Button>
        ))}
      </div>
      {/* Voice Assistant */}
      {isAssistantOpen && <VoiceAssistant />}
    </div>
  );
}
