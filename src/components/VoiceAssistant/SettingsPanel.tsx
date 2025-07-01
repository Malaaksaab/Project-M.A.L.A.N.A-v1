import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  Shield,
  Globe,
  Cpu,
  Volume2,
  Keyboard,
  Brain,
  Info,
  User,
  Database,
  Mail,
} from "lucide-react";
import type { AssistantSettings } from "./index";

interface SettingsPanelProps {
  settings: AssistantSettings;
  onSave: (settings: AssistantSettings) => void;
}

const SettingsPanel = ({ settings, onSave }: SettingsPanelProps) => {
  const [localSettings, setLocalSettings] = useState<AssistantSettings>({
    ...settings,
  });
  const [activeTab, setActiveTab] = useState<
    "general" | "permissions" | "security" | "customization" | "about"
  >("general");

  const handleSave = () => {
    onSave(localSettings);
  };

  const updatePermission = (
    key: keyof typeof localSettings.permissions,
    value: boolean,
  ) => {
    setLocalSettings({
      ...localSettings,
      permissions: {
        ...localSettings.permissions,
        [key]: value,
      },
    });
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-b from-transparent to-blue-950/20 text-blue-100">
      <div className="flex flex-wrap border-b border-blue-500/30 pb-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none border-b-2 ${activeTab === "general" ? "border-blue-500 text-blue-300" : "border-transparent text-blue-400/70 hover:text-blue-300"}`}
          onClick={() => setActiveTab("general")}
        >
          <Brain className="h-4 w-4 mr-2" />
          General
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none border-b-2 ${activeTab === "permissions" ? "border-blue-500 text-blue-300" : "border-transparent text-blue-400/70 hover:text-blue-300"}`}
          onClick={() => setActiveTab("permissions")}
        >
          <Globe className="h-4 w-4 mr-2" />
          Permissions
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none border-b-2 ${activeTab === "security" ? "border-blue-500 text-blue-300" : "border-transparent text-blue-400/70 hover:text-blue-300"}`}
          onClick={() => setActiveTab("security")}
        >
          <Shield className="h-4 w-4 mr-2" />
          Security
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none border-b-2 ${activeTab === "customization" ? "border-blue-500 text-blue-300" : "border-transparent text-blue-400/70 hover:text-blue-300"}`}
          onClick={() => setActiveTab("customization")}
        >
          <User className="h-4 w-4 mr-2" />
          Customize
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none border-b-2 ${activeTab === "about" ? "border-blue-500 text-blue-300" : "border-transparent text-blue-400/70 hover:text-blue-300"}`}
          onClick={() => setActiveTab("about")}
        >
          <Info className="h-4 w-4 mr-2" />
          About
        </Button>
      </div>

      {activeTab === "general" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="wake-word"
              className="text-blue-300 flex items-center gap-2"
            >
              <Mic className="h-4 w-4" /> Wake Word
            </Label>
            <Input
              id="wake-word"
              value={localSettings.wakeWord}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, wakeWord: e.target.value })
              }
              className="bg-blue-900/20 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="hotkey"
              className="text-blue-300 flex items-center gap-2"
            >
              <Keyboard className="h-4 w-4" /> Hotkey
            </Label>
            <Input
              id="hotkey"
              value={localSettings.hotkey}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, hotkey: e.target.value })
              }
              className="bg-blue-900/20 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
            />
            <p className="text-xs text-blue-400/70">
              Click in the field and press the key combination
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="voice-type"
              className="text-blue-300 flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" /> Assistant Voice
            </Label>
            <Select
              value={localSettings.voiceType}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, voiceType: value })
              }
            >
              <SelectTrigger
                id="voice-type"
                className="bg-blue-900/20 border-blue-500/30 text-blue-100 focus:ring-blue-500"
              >
                <SelectValue placeholder="Select voice type" />
              </SelectTrigger>
              <SelectContent className="bg-blue-950 border-blue-500/50 text-blue-100">
                <SelectItem value="default" className="focus:bg-blue-800">
                  Default
                </SelectItem>
                <SelectItem value="male" className="focus:bg-blue-800">
                  Male
                </SelectItem>
                <SelectItem value="female" className="focus:bg-blue-800">
                  Female
                </SelectItem>
                <SelectItem value="robotic" className="focus:bg-blue-800">
                  Robotic
                </SelectItem>
                <SelectItem value="jarvis" className="focus:bg-blue-800">
                  J.A.R.V.I.S
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {activeTab === "permissions" && (
        <div className="space-y-4">
          <h4 className="font-medium text-blue-300 flex items-center gap-2">
            <Globe className="h-4 w-4" /> System Access Permissions
          </h4>

          <div className="space-y-3 bg-blue-900/20 p-3 rounded-md border border-blue-500/20">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="perm-mic"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <Mic className="h-4 w-4 text-blue-400" />
                Microphone Access
              </Label>
              <Switch
                id="perm-mic"
                checked={localSettings.permissions.microphone}
                onCheckedChange={(checked) =>
                  updatePermission("microphone", checked)
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Allow MALANA to listen for voice commands
            </p>

            <Separator className="bg-blue-500/20 my-2" />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="perm-system"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <Cpu className="h-4 w-4 text-blue-400" />
                System Commands
              </Label>
              <Switch
                id="perm-system"
                checked={localSettings.permissions.systemCommands}
                onCheckedChange={(checked) =>
                  updatePermission("systemCommands", checked)
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Allow MALANA to execute system operations
            </p>

            <Separator className="bg-blue-500/20 my-2" />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="perm-browser"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <Globe className="h-4 w-4 text-blue-400" />
                Browser Access
              </Label>
              <Switch
                id="perm-browser"
                checked={localSettings.permissions.browserAccess}
                onCheckedChange={(checked) =>
                  updatePermission("browserAccess", checked)
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Allow MALANA to open web pages and search
            </p>

            <Separator className="bg-blue-500/20 my-2" />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="perm-files"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <Database className="h-4 w-4 text-blue-400" />
                File System Access
              </Label>
              <Switch
                id="perm-files"
                checked={localSettings.permissions.fileAccess}
                onCheckedChange={(checked) =>
                  updatePermission("fileAccess", checked)
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Allow MALANA to access and manage files and folders
            </p>

            <Separator className="bg-blue-500/20 my-2" />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="perm-personal"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <User className="h-4 w-4 text-blue-400" />
                Personal Data Access
              </Label>
              <Switch
                id="perm-personal"
                checked={localSettings.permissions.personalData}
                onCheckedChange={(checked) =>
                  updatePermission("personalData", checked)
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Allow MALANA to access personal information (contacts, calendar,
              etc.)
            </p>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-4">
          <h4 className="font-medium text-blue-300 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security Settings
          </h4>

          <div className="space-y-3 bg-blue-900/20 p-3 rounded-md border border-blue-500/20">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="security-voice"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <Mic className="h-4 w-4 text-blue-400" />
                Voice Authentication
              </Label>
              <Switch
                id="security-voice"
                checked={localSettings.securitySettings.voiceAuthentication}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    securitySettings: {
                      ...localSettings.securitySettings,
                      voiceAuthentication: checked,
                    },
                  })
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Require voice recognition to verify your identity
            </p>

            <Separator className="bg-blue-500/20 my-2" />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="security-password"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <Shield className="h-4 w-4 text-blue-400" />
                Password Protection
              </Label>
              <Switch
                id="security-password"
                checked={localSettings.securitySettings.passwordProtection}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    securitySettings: {
                      ...localSettings.securitySettings,
                      passwordProtection: checked,
                    },
                  })
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Require password to access sensitive functions
            </p>

            <Separator className="bg-blue-500/20 my-2" />

            <div className="flex items-center justify-between">
              <Label
                htmlFor="security-privacy"
                className="cursor-pointer text-blue-200 flex items-center gap-2"
              >
                <Globe className="h-4 w-4 text-blue-400" />
                Privacy Mode
              </Label>
              <Switch
                id="security-privacy"
                checked={localSettings.securitySettings.privacyMode}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    securitySettings: {
                      ...localSettings.securitySettings,
                      privacyMode: checked,
                    },
                  })
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-xs text-blue-400/70 pl-6">
              Don't store conversation history or personal data
            </p>
          </div>
        </div>
      )}

      {activeTab === "customization" && (
        <div className="space-y-4">
          <h4 className="font-medium text-blue-300 flex items-center gap-2">
            <User className="h-4 w-4" /> Personalization
          </h4>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="formality-level"
                className="text-blue-300 flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" /> Formality Level
              </Label>
              <Select
                value={localSettings.formalityLevel}
                onValueChange={(value: "casual" | "formal" | "professional") =>
                  setLocalSettings({ ...localSettings, formalityLevel: value })
                }
              >
                <SelectTrigger
                  id="formality-level"
                  className="bg-blue-900/20 border-blue-500/30 text-blue-100 focus:ring-blue-500"
                >
                  <SelectValue placeholder="Select formality level" />
                </SelectTrigger>
                <SelectContent className="bg-blue-950 border-blue-500/50 text-blue-100">
                  <SelectItem value="casual" className="focus:bg-blue-800">
                    Casual
                  </SelectItem>
                  <SelectItem value="formal" className="focus:bg-blue-800">
                    Formal
                  </SelectItem>
                  <SelectItem
                    value="professional"
                    className="focus:bg-blue-800"
                  >
                    Professional
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-blue-400/70">
                Determines how formal MALANA's responses will be
              </p>
            </div>

            <Separator className="bg-blue-500/20 my-3" />

            <div className="space-y-2">
              <Label
                htmlFor="custom-greeting"
                className="text-blue-300 flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Custom Greeting
              </Label>
              <Input
                id="custom-greeting"
                value={localSettings.customResponses.greeting}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    customResponses: {
                      ...localSettings.customResponses,
                      greeting: e.target.value,
                    },
                  })
                }
                className="bg-blue-900/20 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="custom-farewell"
                className="text-blue-300 flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Custom Farewell
              </Label>
              <Input
                id="custom-farewell"
                value={localSettings.customResponses.farewell}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    customResponses: {
                      ...localSettings.customResponses,
                      farewell: e.target.value,
                    },
                  })
                }
                className="bg-blue-900/20 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="custom-acknowledgment"
                className="text-blue-300 flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Custom Acknowledgment
              </Label>
              <Input
                id="custom-acknowledgment"
                value={localSettings.customResponses.acknowledgment}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    customResponses: {
                      ...localSettings.customResponses,
                      acknowledgment: e.target.value,
                    },
                  })
                }
                className="bg-blue-900/20 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
              />
              <p className="text-xs text-blue-400/70">
                Response when MALANA acknowledges your command
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "about" && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
              <Brain className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-blue-300">M.A.L.A.N.A</h3>
            <p className="text-sm text-blue-400">
              Multi-Adaptive Learning Artificial Neural Assistant
            </p>
            <p className="text-xs text-blue-400/70 mt-1">Version 1.0.0</p>

            <div className="mt-6 text-sm text-blue-300/80 text-center">
              <p>Advanced AI assistant with voice recognition capabilities</p>
              <p className="mt-2">
                Designed to help with daily tasks, information retrieval,
              </p>
              <p>system management, and more.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-blue-500/20 mt-4">
        <Button
          variant="outline"
          onClick={() => onSave(settings)}
          className="border-blue-500/50 text-blue-300 hover:bg-blue-900/50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
