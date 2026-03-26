import { Badge } from "@/components/ui/badge";
import { Platform } from "@/lib/types";
import { PLATFORM_LABELS, PLATFORM_COLORS } from "@/lib/constants";

interface Props {
  platform: Platform;
  size?: "sm" | "xs";
}

export function PlatformBadge({ platform, size = "xs" }: Props) {
  const color = PLATFORM_COLORS[platform] ?? PLATFORM_COLORS.general;
  return (
    <Badge variant="outline" className={`${size === "xs" ? "text-xs" : "text-sm"} font-medium ${color}`}>
      {PLATFORM_LABELS[platform] ?? platform}
    </Badge>
  );
}
