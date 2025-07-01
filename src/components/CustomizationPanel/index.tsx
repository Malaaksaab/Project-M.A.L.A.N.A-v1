import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "./ColorPicker";
import { FeatureToggle } from "./FeatureToggle";
import { ExportOptions } from "./ExportOptions";
import {
  Brain,
  Brush,
  Code,
  Download,
  Layers,
  Palette,
  Settings,
  Sliders,
  Zap,
} from "lucide-react";

export interface CustomizationConfig {
  appName: string;
  appDescription: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoType: "brain" | "custom";
    customLogoUrl: string;
    darkMode: boolean;
    glassmorphism: boolean;
  };
  features: {
    voiceCommands: boolean;
    systemControls: boolean;
    fileManagement: boolean;
    weatherInfo: boolean;
    emailIntegration: boolean;
    calendarIntegration: boolean;
    musicControls: boolean;
    webSearch: boolean;
    aiAssistant: boolean;
    securityFeatures: boolean;
  };
  performance: {
    animationLevel: number;
    startWithSystem: boolean;
    minimizeToTray: boolean;
    useHardwareAcceleration: boolean;
  };
  compatibility: {
    legacyWindowsSupport: boolean;
    alternativeHotkeys: boolean;
    reducedGraphics: boolean;
    highContrastMode: boolean;
  };
  advanced: {
    customCss: string;
    customJavaScript: string;
    apiEndpoints: string;
    debugMode: boolean;
  };
}

export default function CustomizationPanel() {
  const [config, setConfig] = useState<CustomizationConfig>({
    appName: "M.A.L.A.N.A",
    appDescription: "Multi-Adaptive Learning Artificial Neural Assistant",
    branding: {
      primaryColor: "#3b82f6", // blue-500
      secondaryColor: "#1e40af", // blue-800
      accentColor: "#6366f1", // indigo-500
      logoType: "brain",
      customLogoUrl: "",
      darkMode: true,
      glassmorphism: true,
    },
    features: {
      voiceCommands: true,
      systemControls: true,
      fileManagement: true,
      weatherInfo: true,
      emailIntegration: true,
      calendarIntegration: true,
      musicControls: true,
      webSearch: true,
      aiAssistant: true,
      securityFeatures: true,
    },
    performance: {
      animationLevel: 2, // 0-3 (none, minimal, moderate, full)
      startWithSystem: true,
      minimizeToTray: true,
      useHardwareAcceleration: true,
    },
    compatibility: {
      legacyWindowsSupport: true,
      alternativeHotkeys: true,
      reducedGraphics: false,
      highContrastMode: false,
    },
    advanced: {
      customCss: "",
      customJavaScript: "",
      apiEndpoints: "https://api.example.com/v1",
      debugMode: false,
    },
  });

  const [exportModalOpen, setExportModalOpen] = useState(false);

  const updateConfig = (
    section: keyof CustomizationConfig,
    key: string,
    value: any,
  ) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-xl bg-blue-900/50 border border-blue-500/30 flex items-center justify-center">
            <Settings className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              MALANA Customizer
            </h1>
            <p className="text-blue-300/80">
              Customize every aspect of your AI assistant and export as a
              standalone application
            </p>
          </div>
        </div>

        <Tabs defaultValue="branding" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <TabsList className="flex flex-col w-full h-auto bg-blue-900/20 border border-blue-500/30 rounded-lg p-1">
                <TabsTrigger
                  value="branding"
                  className="justify-start w-full mb-1 data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-200"
                >
                  <Palette className="h-4 w-4 mr-2" /> Branding & Appearance
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="justify-start w-full mb-1 data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-200"
                >
                  <Layers className="h-4 w-4 mr-2" /> Features & Modules
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="justify-start w-full mb-1 data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-200"
                >
                  <Zap className="h-4 w-4 mr-2" /> Performance
                </TabsTrigger>
                <TabsTrigger
                  value="compatibility"
                  className="justify-start w-full mb-1 data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-200"
                >
                  <Sliders className="h-4 w-4 mr-2" /> Compatibility
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="justify-start w-full mb-1 data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-200"
                >
                  <Code className="h-4 w-4 mr-2" /> Advanced
                </TabsTrigger>
                <TabsTrigger
                  value="export"
                  className="justify-start w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" /> Export Project
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-2" /> Preview
                </h3>
                <div className="aspect-video bg-black rounded-md border border-blue-500/30 flex items-center justify-center">
                  <div className="text-xs text-blue-400/70 text-center p-2">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p>Live preview will appear here</p>
                    <p className="mt-1 text-[10px]">
                      Changes apply in real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <TabsContent value="branding" className="mt-0">
                <Card className="bg-blue-900/20 border-blue-500/30 p-6">
                  <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                    <Brush className="h-5 w-5 mr-2" /> Branding & Appearance
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="appName" className="text-blue-300">
                          Application Name
                        </Label>
                        <Input
                          id="appName"
                          value={config.appName}
                          onChange={(e) =>
                            setConfig({ ...config, appName: e.target.value })
                          }
                          className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="appDescription"
                          className="text-blue-300"
                        >
                          Application Description
                        </Label>
                        <Input
                          id="appDescription"
                          value={config.appDescription}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              appDescription: e.target.value,
                            })
                          }
                          className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>

                    <Separator className="bg-blue-500/20 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-blue-300">Primary Color</Label>
                        <ColorPicker
                          color={config.branding.primaryColor}
                          onChange={(color) =>
                            updateConfig("branding", "primaryColor", color)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-300">Secondary Color</Label>
                        <ColorPicker
                          color={config.branding.secondaryColor}
                          onChange={(color) =>
                            updateConfig("branding", "secondaryColor", color)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-300">Accent Color</Label>
                        <ColorPicker
                          color={config.branding.accentColor}
                          onChange={(color) =>
                            updateConfig("branding", "accentColor", color)
                          }
                        />
                      </div>
                    </div>

                    <Separator className="bg-blue-500/20 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="logoType" className="text-blue-300">
                          Logo Type
                        </Label>
                        <Select
                          value={config.branding.logoType}
                          onValueChange={(value: "brain" | "custom") =>
                            updateConfig("branding", "logoType", value)
                          }
                        >
                          <SelectTrigger className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus:ring-blue-500">
                            <SelectValue placeholder="Select logo type" />
                          </SelectTrigger>
                          <SelectContent className="bg-blue-950 border-blue-500/50 text-blue-100">
                            <SelectItem
                              value="brain"
                              className="focus:bg-blue-800"
                            >
                              Default Brain Icon
                            </SelectItem>
                            <SelectItem
                              value="custom"
                              className="focus:bg-blue-800"
                            >
                              Custom Logo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {config.branding.logoType === "custom" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="customLogoUrl"
                            className="text-blue-300"
                          >
                            Custom Logo URL
                          </Label>
                          <Input
                            id="customLogoUrl"
                            value={config.branding.customLogoUrl}
                            onChange={(e) =>
                              updateConfig(
                                "branding",
                                "customLogoUrl",
                                e.target.value,
                              )
                            }
                            placeholder="https://example.com/logo.png"
                            className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>

                    <Separator className="bg-blue-500/20 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="darkMode"
                          className="text-blue-300 cursor-pointer"
                        >
                          Dark Mode
                        </Label>
                        <Switch
                          id="darkMode"
                          checked={config.branding.darkMode}
                          onCheckedChange={(checked) =>
                            updateConfig("branding", "darkMode", checked)
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="glassmorphism"
                          className="text-blue-300 cursor-pointer"
                        >
                          Glassmorphism Effect
                        </Label>
                        <Switch
                          id="glassmorphism"
                          checked={config.branding.glassmorphism}
                          onCheckedChange={(checked) =>
                            updateConfig("branding", "glassmorphism", checked)
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-0">
                <Card className="bg-blue-900/20 border-blue-500/30 p-6">
                  <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                    <Layers className="h-5 w-5 mr-2" /> Features & Modules
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureToggle
                      id="voiceCommands"
                      label="Voice Commands"
                      description="Enable voice recognition and commands"
                      checked={config.features.voiceCommands}
                      onChange={(checked) =>
                        updateConfig("features", "voiceCommands", checked)
                      }
                    />

                    <FeatureToggle
                      id="systemControls"
                      label="System Controls"
                      description="Control system functions (volume, brightness, etc.)"
                      checked={config.features.systemControls}
                      onChange={(checked) =>
                        updateConfig("features", "systemControls", checked)
                      }
                    />

                    <FeatureToggle
                      id="fileManagement"
                      label="File Management"
                      description="Search and manage files on your computer"
                      checked={config.features.fileManagement}
                      onChange={(checked) =>
                        updateConfig("features", "fileManagement", checked)
                      }
                    />

                    <FeatureToggle
                      id="weatherInfo"
                      label="Weather Information"
                      description="Get weather forecasts and conditions"
                      checked={config.features.weatherInfo}
                      onChange={(checked) =>
                        updateConfig("features", "weatherInfo", checked)
                      }
                    />

                    <FeatureToggle
                      id="emailIntegration"
                      label="Email Integration"
                      description="Check and send emails with voice commands"
                      checked={config.features.emailIntegration}
                      onChange={(checked) =>
                        updateConfig("features", "emailIntegration", checked)
                      }
                    />

                    <FeatureToggle
                      id="calendarIntegration"
                      label="Calendar Integration"
                      description="Manage calendar events and reminders"
                      checked={config.features.calendarIntegration}
                      onChange={(checked) =>
                        updateConfig("features", "calendarIntegration", checked)
                      }
                    />

                    <FeatureToggle
                      id="musicControls"
                      label="Music Controls"
                      description="Control music playback on your device"
                      checked={config.features.musicControls}
                      onChange={(checked) =>
                        updateConfig("features", "musicControls", checked)
                      }
                    />

                    <FeatureToggle
                      id="webSearch"
                      label="Web Search"
                      description="Search the web with voice commands"
                      checked={config.features.webSearch}
                      onChange={(checked) =>
                        updateConfig("features", "webSearch", checked)
                      }
                    />

                    <FeatureToggle
                      id="aiAssistant"
                      label="AI Assistant"
                      description="Advanced AI capabilities for natural conversations"
                      checked={config.features.aiAssistant}
                      onChange={(checked) =>
                        updateConfig("features", "aiAssistant", checked)
                      }
                    />

                    <FeatureToggle
                      id="securityFeatures"
                      label="Security Features"
                      description="Voice authentication and privacy controls"
                      checked={config.features.securityFeatures}
                      onChange={(checked) =>
                        updateConfig("features", "securityFeatures", checked)
                      }
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="mt-0">
                <Card className="bg-blue-900/20 border-blue-500/30 p-6">
                  <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2" /> Performance Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label
                          htmlFor="animationLevel"
                          className="text-blue-300"
                        >
                          Animation Level
                        </Label>
                        <span className="text-sm text-blue-400">
                          {config.performance.animationLevel === 0 && "None"}
                          {config.performance.animationLevel === 1 && "Minimal"}
                          {config.performance.animationLevel === 2 &&
                            "Moderate"}
                          {config.performance.animationLevel === 3 && "Full"}
                        </span>
                      </div>
                      <Slider
                        id="animationLevel"
                        min={0}
                        max={3}
                        step={1}
                        value={[config.performance.animationLevel]}
                        onValueChange={(value) =>
                          updateConfig(
                            "performance",
                            "animationLevel",
                            value[0],
                          )
                        }
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-blue-400/70">
                        <span>None</span>
                        <span>Minimal</span>
                        <span>Moderate</span>
                        <span>Full</span>
                      </div>
                    </div>

                    <Separator className="bg-blue-500/20 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="startWithSystem"
                          className="text-blue-300 cursor-pointer"
                        >
                          Start with System
                          <p className="text-xs text-blue-400/70 mt-1">
                            Launch automatically when computer starts
                          </p>
                        </Label>
                        <Switch
                          id="startWithSystem"
                          checked={config.performance.startWithSystem}
                          onCheckedChange={(checked) =>
                            updateConfig(
                              "performance",
                              "startWithSystem",
                              checked,
                            )
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="minimizeToTray"
                          className="text-blue-300 cursor-pointer"
                        >
                          Minimize to System Tray
                          <p className="text-xs text-blue-400/70 mt-1">
                            Hide in system tray when minimized
                          </p>
                        </Label>
                        <Switch
                          id="minimizeToTray"
                          checked={config.performance.minimizeToTray}
                          onCheckedChange={(checked) =>
                            updateConfig(
                              "performance",
                              "minimizeToTray",
                              checked,
                            )
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="useHardwareAcceleration"
                          className="text-blue-300 cursor-pointer"
                        >
                          Hardware Acceleration
                          <p className="text-xs text-blue-400/70 mt-1">
                            Use GPU for better performance
                          </p>
                        </Label>
                        <Switch
                          id="useHardwareAcceleration"
                          checked={config.performance.useHardwareAcceleration}
                          onCheckedChange={(checked) =>
                            updateConfig(
                              "performance",
                              "useHardwareAcceleration",
                              checked,
                            )
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="compatibility" className="mt-0">
                <Card className="bg-blue-900/20 border-blue-500/30 p-6">
                  <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                    <Sliders className="h-5 w-5 mr-2" /> Compatibility Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="legacyWindowsSupport"
                          className="text-blue-300 cursor-pointer"
                        >
                          Legacy Windows Support
                          <p className="text-xs text-blue-400/70 mt-1">
                            Optimize for Windows 7 and older
                          </p>
                        </Label>
                        <Switch
                          id="legacyWindowsSupport"
                          checked={config.compatibility.legacyWindowsSupport}
                          onCheckedChange={(checked) =>
                            updateConfig(
                              "compatibility",
                              "legacyWindowsSupport",
                              checked,
                            )
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="alternativeHotkeys"
                          className="text-blue-300 cursor-pointer"
                        >
                          Alternative Hotkeys
                          <p className="text-xs text-blue-400/70 mt-1">
                            Use F1 instead of Alt+Space on older systems
                          </p>
                        </Label>
                        <Switch
                          id="alternativeHotkeys"
                          checked={config.compatibility.alternativeHotkeys}
                          onCheckedChange={(checked) =>
                            updateConfig(
                              "compatibility",
                              "alternativeHotkeys",
                              checked,
                            )
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="reducedGraphics"
                          className="text-blue-300 cursor-pointer"
                        >
                          Reduced Graphics
                          <p className="text-xs text-blue-400/70 mt-1">
                            Simplify visual effects for better performance
                          </p>
                        </Label>
                        <Switch
                          id="reducedGraphics"
                          checked={config.compatibility.reducedGraphics}
                          onCheckedChange={(checked) =>
                            updateConfig(
                              "compatibility",
                              "reducedGraphics",
                              checked,
                            )
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="highContrastMode"
                          className="text-blue-300 cursor-pointer"
                        >
                          High Contrast Mode
                          <p className="text-xs text-blue-400/70 mt-1">
                            Improve visibility for users with visual impairments
                          </p>
                        </Label>
                        <Switch
                          id="highContrastMode"
                          checked={config.compatibility.highContrastMode}
                          onCheckedChange={(checked) =>
                            updateConfig(
                              "compatibility",
                              "highContrastMode",
                              checked,
                            )
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-4 mt-6">
                      <h3 className="text-sm font-medium text-yellow-300 mb-2">
                        Compatibility Notes
                      </h3>
                      <p className="text-xs text-yellow-200/80">
                        Enabling legacy Windows support will automatically
                        adjust the application to work optimally on older
                        systems, including Windows 7, Vista, and XP. This
                        includes using standard window frames, disabling
                        transparency effects, and reducing animation complexity.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <Card className="bg-blue-900/20 border-blue-500/30 p-6">
                  <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                    <Code className="h-5 w-5 mr-2" /> Advanced Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customCss" className="text-blue-300">
                        Custom CSS
                      </Label>
                      <Textarea
                        id="customCss"
                        value={config.advanced.customCss}
                        onChange={(e) =>
                          updateConfig("advanced", "customCss", e.target.value)
                        }
                        placeholder="/* Add your custom CSS here */\n.my-custom-class {\n  color: red;\n}"
                        className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500 font-mono h-32"
                      />
                      <p className="text-xs text-blue-400/70">
                        Custom CSS styles to apply to the application
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="customJavaScript"
                        className="text-blue-300"
                      >
                        Custom JavaScript
                      </Label>
                      <Textarea
                        id="customJavaScript"
                        value={config.advanced.customJavaScript}
                        onChange={(e) =>
                          updateConfig(
                            "advanced",
                            "customJavaScript",
                            e.target.value,
                          )
                        }
                        placeholder="// Add your custom JavaScript here\nfunction myCustomFunction() {\n  console.log('Hello world');\n}"
                        className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500 font-mono h-32"
                      />
                      <p className="text-xs text-blue-400/70">
                        Custom JavaScript to extend application functionality
                      </p>
                    </div>

                    <Separator className="bg-blue-500/20 my-4" />

                    <div className="space-y-2">
                      <Label htmlFor="apiEndpoints" className="text-blue-300">
                        API Endpoints
                      </Label>
                      <Input
                        id="apiEndpoints"
                        value={config.advanced.apiEndpoints}
                        onChange={(e) =>
                          updateConfig(
                            "advanced",
                            "apiEndpoints",
                            e.target.value,
                          )
                        }
                        placeholder="https://api.example.com/v1"
                        className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
                      />
                      <p className="text-xs text-blue-400/70">
                        Custom API endpoint for AI and other services
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="debugMode"
                        className="text-blue-300 cursor-pointer"
                      >
                        Debug Mode
                        <p className="text-xs text-blue-400/70 mt-1">
                          Enable detailed logging and developer tools
                        </p>
                      </Label>
                      <Switch
                        id="debugMode"
                        checked={config.advanced.debugMode}
                        onCheckedChange={(checked) =>
                          updateConfig("advanced", "debugMode", checked)
                        }
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4 mt-6">
                      <h3 className="text-sm font-medium text-red-300 mb-2">
                        Advanced Settings Warning
                      </h3>
                      <p className="text-xs text-red-200/80">
                        These settings are intended for advanced users.
                        Incorrect configuration may cause the application to
                        malfunction. Custom code runs with the same privileges
                        as the application itself.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="mt-0">
                <Card className="bg-blue-900/20 border-blue-500/30 p-6">
                  <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                    <Download className="h-5 w-5 mr-2" /> Export Project
                  </h2>

                  <ExportOptions config={config} onExport={handleExport} />
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
