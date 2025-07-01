import { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [inputValue, setInputValue] = useState(color);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(color);
    setInputValue(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    setInputValue(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Only update if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(e.target.value)) {
      setCurrentColor(e.target.value);
    }
  };

  const handleSave = () => {
    onChange(currentColor);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset to original color if closed without saving
      setCurrentColor(color);
      setInputValue(color);
    }
  };

  const presetColors = [
    "#3b82f6", // blue-500
    "#2563eb", // blue-600
    "#1d4ed8", // blue-700
    "#1e40af", // blue-800
    "#6366f1", // indigo-500
    "#4f46e5", // indigo-600
    "#4338ca", // indigo-700
    "#3730a3", // indigo-800
    "#8b5cf6", // violet-500
    "#7c3aed", // violet-600
    "#6d28d9", // violet-700
    "#5b21b6", // violet-800
    "#ec4899", // pink-500
    "#db2777", // pink-600
    "#be185d", // pink-700
    "#9d174d", // pink-800
    "#ef4444", // red-500
    "#dc2626", // red-600
    "#b91c1c", // red-700
    "#991b1b", // red-800
    "#f97316", // orange-500
    "#ea580c", // orange-600
    "#c2410c", // orange-700
    "#9a3412", // orange-800
    "#eab308", // yellow-500
    "#ca8a04", // yellow-600
    "#a16207", // yellow-700
    "#854d0e", // yellow-800
    "#22c55e", // green-500
    "#16a34a", // green-600
    "#15803d", // green-700
    "#166534", // green-800
    "#06b6d4", // cyan-500
    "#0891b2", // cyan-600
    "#0e7490", // cyan-700
    "#155e75", // cyan-800
  ];

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 p-1 border-blue-500/30 bg-blue-900/30 hover:bg-blue-800/50"
        >
          <div className="flex items-center justify-between w-full">
            <div
              className="w-6 h-6 rounded-md border border-blue-500/50"
              style={{ backgroundColor: color }}
            />
            <span className="text-blue-200">{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-blue-950 border-blue-500/50 p-4">
        <div className="space-y-4">
          <div>
            <div
              className="w-full h-24 rounded-md mb-2 border border-blue-500/30"
              style={{ backgroundColor: currentColor }}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="hex-color" className="sr-only">
                  Hex Color
                </Label>
                <Input
                  id="hex-color"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="bg-blue-900/30 border-blue-500/30 text-blue-100 focus-visible:ring-blue-500"
                />
              </div>
              <Button
                onClick={() => colorInputRef.current?.click()}
                variant="outline"
                className="border-blue-500/30 bg-blue-900/30 hover:bg-blue-800/50"
              >
                Pick
              </Button>
              <input
                ref={colorInputRef}
                type="color"
                value={currentColor}
                onChange={handleColorChange}
                className="sr-only"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-blue-300 mb-2 block">Presets</Label>
            <div className="grid grid-cols-8 gap-1">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`w-6 h-6 rounded-md border ${currentColor === presetColor ? "border-white" : "border-blue-500/30"}`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    setCurrentColor(presetColor);
                    setInputValue(presetColor);
                  }}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="border-blue-500/30 text-blue-300 hover:bg-blue-800/50"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
