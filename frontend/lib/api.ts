const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/api/overview`);
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}

export async function fetchThemes() {
  const res = await fetch(`${API_BASE}/api/themes`);
  if (!res.ok) throw new Error("Failed to fetch themes");
  return res.json();
}

export async function fetchTheme(themeId: string) {
  const res = await fetch(`${API_BASE}/api/themes/${themeId}`);
  if (!res.ok) throw new Error("Failed to fetch theme");
  return res.json();
}

export async function fetchOpportunities() {
  const res = await fetch(`${API_BASE}/api/opportunities`);
  if (!res.ok) throw new Error("Failed to fetch opportunities");
  return res.json();
}

export async function fetchEvidence(params?: { source?: string; theme_id?: string }) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${API_BASE}/api/evidence${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch evidence");
  return res.json();
}
