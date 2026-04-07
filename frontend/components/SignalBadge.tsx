import { Badge } from "@/components/ui/badge";
import { SignalLevel } from "@/lib/types";

const CONFIG: Record<SignalLevel, { label: string; className: string }> = {
  high: { label: "High", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200" },
  low: { label: "Low", className: "bg-slate-50 text-slate-700 border-slate-200" },
};

interface Props {
  level: SignalLevel;
  label?: string;
  prefix?: string;
}

export function SignalBadge({ level, label, prefix }: Props) {
  const config = CONFIG[level] ?? CONFIG.low;
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {prefix && <span className="text-slate-500 mr-1">{prefix}</span>}
      {label ?? config.label}
    </Badge>
  );
}
