import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "./PlatformBadge";
import { Evidence } from "@/lib/types";
import { SOURCE_LABELS } from "@/lib/constants";

const SOURCE_COLORS: Record<string, string> = {
  google_play: "bg-green-500/15 text-green-400 border-green-500/30",
  reddit: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  garmin_forums: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

interface Props {
  evidence: Evidence;
}

export function EvidenceCard({ evidence }: Props) {
  const sourceColor = SOURCE_COLORS[evidence.source] ?? "bg-slate-500/15 text-slate-400 border-slate-500/30";

  return (
    <Card className="border border-slate-800 bg-slate-900/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="outline" className={`text-xs ${sourceColor}`}>
            {SOURCE_LABELS[evidence.source] ?? evidence.source}
          </Badge>
          {evidence.platform && <PlatformBadge platform={evidence.platform as any} />}
          {evidence.rating && (
            <span className="text-xs text-amber-400">
              {"★".repeat(evidence.rating)}{"☆".repeat(5 - evidence.rating)}
            </span>
          )}
          {evidence.date && (
            <span className="text-xs text-slate-600 ml-auto">{evidence.date}</span>
          )}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{evidence.text}</p>
        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 inline-block"
          >
            View source →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
