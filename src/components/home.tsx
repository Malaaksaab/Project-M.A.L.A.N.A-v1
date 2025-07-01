import VoiceAssistant from "./VoiceAssistant";
import {
  Brain,
  Search,
  Calendar,
  Cloud,
  Music,
  Cpu,
  Clock,
  HelpCircle,
  Zap,
  Mail,
  Database,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Home() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 text-white overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-xl bg-blue-900/50 border border-blue-500/30 flex items-center justify-center">
            <Brain className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              M.A.L.A.N.A
            </h1>
            <p className="text-blue-300/80">
              Multi-Adaptive Learning Artificial Neural Assistant
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="bg-blue-900/20 border-blue-500/30 p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-300 flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5" /> Getting Started
            </h2>
            <div className="space-y-3 text-blue-100/90">
              <p>
                Your AI assistant is running in the system tray. Click the brain
                icon in the bottom right corner to open it.
              </p>
              <p className="flex items-center gap-2">
                You can also press{" "}
                <kbd className="px-2 py-1 bg-blue-800/50 border border-blue-500/30 rounded text-xs">
                  Alt+Space
                </kbd>{" "}
                to activate voice commands directly.
              </p>
              <p className="text-blue-300/80 text-sm mt-4">
                Say "Hey MALANA" to activate voice recognition at any time.
              </p>
            </div>
          </Card>

          <Card className="bg-blue-900/20 border-blue-500/30 p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-300 flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5" /> Available Commands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <ul className="space-y-2 text-blue-100/90">
                <li className="flex items-start gap-2">
                  <Search className="h-4 w-4 mt-1 text-blue-400" />
                  <span>
                    "<span className="text-blue-300">Search for [term]</span>" -
                    Search the web
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Cpu className="h-4 w-4 mt-1 text-green-400" />
                  <span>
                    "<span className="text-blue-300">Open [application]</span>"
                    - Launch an application
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Cloud className="h-4 w-4 mt-1 text-sky-400" />
                  <span>
                    "<span className="text-blue-300">What's the weather</span>"
                    - Check weather conditions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-1 text-amber-400" />
                  <span>
                    "<span className="text-blue-300">What time is it</span>" -
                    Check current time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-red-400" />
                  <span>
                    "<span className="text-blue-300">Check my schedule</span>" -
                    View calendar events
                  </span>
                </li>
              </ul>

              <ul className="space-y-2 text-blue-100/90">
                <li className="flex items-start gap-2">
                  <Music className="h-4 w-4 mt-1 text-purple-400" />
                  <span>
                    "<span className="text-blue-300">Play music</span>" - Start
                    music playback
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="h-4 w-4 mt-1 text-indigo-400" />
                  <span>
                    "<span className="text-blue-300">What is [topic]</span>" -
                    Get information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-blue-400" />
                  <span>
                    "<span className="text-blue-300">Check my email</span>" -
                    View recent messages
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="h-4 w-4 mt-1 text-yellow-400" />
                  <span>
                    "<span className="text-blue-300">Find file [name]</span>" -
                    Search for files
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-1 text-red-400" />
                  <span>
                    "<span className="text-blue-300">Enable privacy mode</span>"
                    - Secure your data
                  </span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-blue-900/10 border-blue-500/20 p-4 backdrop-blur-sm hover:bg-blue-900/20 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:bg-blue-800/70 transition-colors">
                <Cpu className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300">System Control</h3>
              <p className="text-sm text-blue-400/80 mt-2">
                Manage applications and system functions with voice commands
              </p>
            </div>
          </Card>

          <Card className="bg-blue-900/10 border-blue-500/20 p-4 backdrop-blur-sm hover:bg-blue-900/20 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:bg-blue-800/70 transition-colors">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300">AI Assistant</h3>
              <p className="text-sm text-blue-400/80 mt-2">
                Get answers to questions and helpful information on any topic
              </p>
            </div>
          </Card>

          <Card className="bg-blue-900/10 border-blue-500/20 p-4 backdrop-blur-sm hover:bg-blue-900/20 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:bg-blue-800/70 transition-colors">
                <Search className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300">Web Search</h3>
              <p className="text-sm text-blue-400/80 mt-2">
                Search the web and find information without typing
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-900/10 border-blue-500/20 p-4 backdrop-blur-sm hover:bg-blue-900/20 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-2 group-hover:bg-blue-800/70 transition-colors">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 text-sm">
                Email Management
              </h3>
              <p className="text-xs text-blue-400/80 mt-1">
                Check and send emails with voice commands
              </p>
            </div>
          </Card>

          <Card className="bg-blue-900/10 border-blue-500/20 p-4 backdrop-blur-sm hover:bg-blue-900/20 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-2 group-hover:bg-blue-800/70 transition-colors">
                <Database className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 text-sm">
                File Management
              </h3>
              <p className="text-xs text-blue-400/80 mt-1">
                Find, organize and manage files with voice
              </p>
            </div>
          </Card>

          <Card className="bg-blue-900/10 border-blue-500/20 p-4 backdrop-blur-sm hover:bg-blue-900/20 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-2 group-hover:bg-blue-800/70 transition-colors">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 text-sm">
                Security Features
              </h3>
              <p className="text-xs text-blue-400/80 mt-1">
                Voice authentication and privacy controls
              </p>
            </div>
          </Card>

          <Card className="bg-blue-900/10 border-blue-500/20 p-4 backdrop-blur-sm hover:bg-blue-900/20 transition-colors group">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-2 group-hover:bg-blue-800/70 transition-colors">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 text-sm">
                Personalization
              </h3>
              <p className="text-xs text-blue-400/80 mt-1">
                Customize responses and interaction style
              </p>
            </div>
          </Card>
        </div>

        <div className="text-center text-blue-400/60 text-sm">
          <p>© 2023 M.A.L.A.N.A - Advanced AI Assistant</p>
        </div>
      </div>

      {/* Voice Assistant Component */}
      <VoiceAssistant />
    </div>
  );
}

export default Home;
