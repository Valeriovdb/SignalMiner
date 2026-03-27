const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const DEMO_BASE = "/data/demo";

// Tracks whether the current session is using bundled demo data.
export const dataStatus = { isDemo: false };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchWithFallback(apiPath: string, demoFile: string): Promise<any> {
  // 1. Try live backend with a 6-second timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${API_BASE}${apiPath}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) return res.json();
  } catch {
    // timeout or network error — fall through to demo data
  }

  // 2. Fall back to bundled demo data
  dataStatus.isDemo = true;
  const res = await fetch(`${DEMO_BASE}/${demoFile}`);
  if (!res.ok) throw new Error("Data unavailable");
  return res.json();
}

export async function fetchOverview() {
  return fetchWithFallback("/api/overview", "overview.json");
}

export async function fetchThemes() {
  return fetchWithFallback("/api/themes", "themes.json");
}

export async function fetchTheme(themeId: string) {
  const data = await fetchThemes();
  const theme = data.themes?.find((t: { theme_id: string }) => t.theme_id === themeId);
  if (!theme) throw new Error("Theme not found");
  return theme;
}

export async function fetchOpportunities() {
  return fetchWithFallback("/api/opportunities", "opportunities.json");
}

export async function fetchEvidence(params?: {
  source?: string;
  platform?: string;
  theme_id?: string;
}) {
  // Always fetch all; filter client-side so demo mode works without extra files
  const data = await fetchWithFallback("/api/evidence", "evidence.json");

  if (!params || Object.keys(params).length === 0) return data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let evidence: any[] = data.evidence ?? [];
  if (params.source) evidence = evidence.filter((e) => e.source === params.source);
  if (params.platform) evidence = evidence.filter((e) => e.platform === params.platform);
  if (params.theme_id) evidence = evidence.filter((e) => e.theme_id === params.theme_id);
  return { evidence, total: evidence.length };
}
