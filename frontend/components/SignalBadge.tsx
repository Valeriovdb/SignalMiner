import { Badge } from "@/components/ui/badge";
import { SignalLevel } from "@/lib/types";

const CONFIG: Record<SignalLevel, { label: string; className: string }> = {
  high: { label: "High", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Medium", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  low: { label: "Low", className: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
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
