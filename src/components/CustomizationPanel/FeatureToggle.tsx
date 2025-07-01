import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FeatureToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function FeatureToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: FeatureToggleProps) {
  return (
    <div className="flex items-center justify-between bg-blue-900/30 p-3 rounded-md border border-blue-500/20">
      <Label htmlFor={id} className="cursor-pointer">
        <div className="text-blue-300">{label}</div>
        <p className="text-xs text-blue-400/70 mt-1">{description}</p>
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-blue-600"
      />
    </div>
  );
}
