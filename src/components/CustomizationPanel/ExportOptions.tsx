import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Download, Package, Code, Archive, FileDown } from "lucide-react";
import type { CustomizationConfig } from "./index";

interface ExportOptionsProps {
  config: CustomizationConfig;
  onExport: () => void;
}

export function ExportOptions({ config, onExport }: ExportOptionsProps) {
  const [exportType, setExportType] = useState<
    "installer" | "source" | "portable"
  >("installer");
  const [exportPath, setExportPath] = useState<string>(
    `C:\\Users\\User\\Desktop\\${config.appName.replace(/\s+/g, "-")}-Project`,
  );
  const [includeOptions, setIncludeOptions] = useState({
    includeSourceCode: true,
    includeDocumentation: true,
    includeInstallers: true,
    optimizeForSize: false,
  });

  const updateIncludeOption = (
    key: keyof typeof includeOptions,
    value: boolean,
  ) => {
    setIncludeOptions({
      ...includeOptions,
      [key]: value,
    });
  };

  const handleExport = () => {
    // In a real app, this would trigger the export process
    // For now, we'll just simulate it
    onExport();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-300">Export Options</h3>
        <p className="text-sm text-blue-400/80">
          Export your customized MALANA assistant as a standalone application
          that can be installed on any Windows computer.
        </p>

        <RadioGroup
          value={exportType}
          onValueChange={(value: "installer" | "source" | "portable") =>
            setExportType(value)
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div
              className={`border rounded-md p-4 cursor-pointer ${exportType === "installer" ? "bg-blue-800/30 border-blue-500" : "bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/30"}`}
            >
              <RadioGroupItem
                value="installer"
                id="installer"
                className="sr-only"
              />
              <Label htmlFor="installer" className="cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <Package className="h-8 w-8 mb-2 text-blue-400" />
                  <div className="font-medium text-blue-300">
                    Windows Installer
                  </div>
                  <p className="text-xs text-blue-400/70 mt-1">
                    Create a Windows installer package (.msi)
                  </p>
                </div>
              </Label>
            </div>

            <div
              className={`border rounded-md p-4 cursor-pointer ${exportType === "source" ? "bg-blue-800/30 border-blue-500" : "bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/30"}`}
            >
              <RadioGroupItem value="source" id="source" className="sr-only" />
              <Label htmlFor="source" className="cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <Code className="h-8 w-8 mb-2 text-blue-400" />
                  <div className="font-medium text-blue-300">Source Code</div>
                  <p className="text-xs text-blue-400/70 mt-1">
                    Export complete source code project
                  </p>
                </div>
              </Label>
            </div>

            <div
              className={`border rounded-md p-4 cursor-pointer ${exportType === "portable" ? "bg-blue-800/30 border-blue-500" : "bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/30"}`}
            >
              <RadioGroupItem
                value="portable"
                id="portable"
                className="sr-only"
              />
              <Label htmlFor="portable" className="cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <Archive className="h-8 w-8 mb-2 text-blue-400" />
                  <div className="font-medium text-blue-300">Portable App</div>
                  <p className="text-xs text-blue-400/70 mt-1">
                    Create a portable executable (.exe)
                  </p>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <Separator className="bg-blue-500/20 my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-300">Export Location</h3>
        <div className="flex gap-2">
          <Input
            value={exportPath}
            onChange={(e) => setExportPath(e.target.value)}
            className="flex-1 bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
          />
          <Button
            variant="outline"
            className="border-blue-500/30 text-blue-300 hover:bg-blue-800/50"
          >
            Browse...
          </Button>
        </div>
      </div>

      <Separator className="bg-blue-500/20 my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-300">
          Additional Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-blue-900/30 p-3 rounded-md border border-blue-500/20">
            <Label htmlFor="includeSourceCode" className="cursor-pointer">
              <div className="text-blue-300">Include Source Code</div>
              <p className="text-xs text-blue-400/70 mt-1">
                Add complete source code to the package
              </p>
            </Label>
            <Switch
              id="includeSourceCode"
              checked={includeOptions.includeSourceCode}
              onCheckedChange={(checked) =>
                updateIncludeOption("includeSourceCode", checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex items-center justify-between bg-blue-900/30 p-3 rounded-md border border-blue-500/20">
            <Label htmlFor="includeDocumentation" className="cursor-pointer">
              <div className="text-blue-300">Include Documentation</div>
              <p className="text-xs text-blue-400/70 mt-1">
                Add user and developer documentation
              </p>
            </Label>
            <Switch
              id="includeDocumentation"
              checked={includeOptions.includeDocumentation}
              onCheckedChange={(checked) =>
                updateIncludeOption("includeDocumentation", checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex items-center justify-between bg-blue-900/30 p-3 rounded-md border border-blue-500/20">
            <Label htmlFor="includeInstallers" className="cursor-pointer">
              <div className="text-blue-300">Include All Installers</div>
              <p className="text-xs text-blue-400/70 mt-1">
                Add installers for all supported platforms
              </p>
            </Label>
            <Switch
              id="includeInstallers"
              checked={includeOptions.includeInstallers}
              onCheckedChange={(checked) =>
                updateIncludeOption("includeInstallers", checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex items-center justify-between bg-blue-900/30 p-3 rounded-md border border-blue-500/20">
            <Label htmlFor="optimizeForSize" className="cursor-pointer">
              <div className="text-blue-300">Optimize for Size</div>
              <p className="text-xs text-blue-400/70 mt-1">
                Reduce package size (may increase load time)
              </p>
            </Label>
            <Switch
              id="optimizeForSize"
              checked={includeOptions.optimizeForSize}
              onCheckedChange={(checked) =>
                updateIncludeOption("optimizeForSize", checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-4 mt-6">
        <h3 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
          <FileDown className="h-4 w-4 mr-2" /> Export Summary
        </h3>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>
            • Export Type:{" "}
            {exportType === "installer"
              ? "Windows Installer (.msi)"
              : exportType === "source"
                ? "Source Code Project"
                : "Portable Application (.exe)"}
          </li>
          <li>• Application Name: {config.appName}</li>
          <li>
            • Features:{" "}
            {
              Object.entries(config.features).filter(([_, enabled]) => enabled)
                .length
            }{" "}
            enabled
          </li>
          <li>
            • Legacy Windows Support:{" "}
            {config.compatibility.legacyWindowsSupport ? "Enabled" : "Disabled"}
          </li>
          <li>• Export Location: {exportPath}</li>
        </ul>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          className="border-blue-500/30 text-blue-300 hover:bg-blue-800/50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Download className="h-4 w-4" />
          Export Project
        </Button>
      </div>
    </div>
  );
}
