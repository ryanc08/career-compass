import framework from "@/data/job_hierarchy_framework.json";

export type JobFramework = Record<string, Record<string, Record<string, string>>>;
export const JOBS = framework as JobFramework;

export type TitleMeta = { domain: string; subcategory: string; description: string };

export const TITLE_INDEX: Map<string, TitleMeta> = (() => {
  const m = new Map<string, TitleMeta>();
  for (const [domain, subs] of Object.entries(JOBS))
    for (const [subcategory, titles] of Object.entries(subs))
      for (const [title, description] of Object.entries(titles))
        if (!m.has(title)) m.set(title, { domain, subcategory, description });
  return m;
})();

export const DOMAINS = Object.keys(JOBS);

/** Groups a list of titles as domain -> subcategory -> titles[] */
export function groupTitles(titles: string[]) {
  const out: Record<string, Record<string, string[]>> = {};
  for (const t of titles) {
    const meta = TITLE_INDEX.get(t);
    if (!meta) continue;
    ((out[meta.domain] ??= {})[meta.subcategory] ??= []).push(t);
  }
  return out;
}

export function stripLicense(desc: string) {
  return desc.replace(/\s*\[.*?\]\s*$/, "");
}
export function licenseOf(desc: string) {
  return desc.match(/\[(.*?)\]\s*$/)?.[1];
}
