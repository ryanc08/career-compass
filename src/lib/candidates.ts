import { useSyncExternalStore } from "react";
import marcus from "@/assets/avatar-marcus.jpg";
import priya from "@/assets/avatar-priya.jpg";
import danielle from "@/assets/avatar-danielle.jpg";
import diego from "@/assets/avatar-diego.jpg";

/** Mirrors the `candidates` table (see supabase/schema.sql). Extra fields are optional enrichments. */
export type Candidate = {
  id: string;
  full_name: string;
  location: string;
  bio: string;
  readiness_score: number;
  is_vetted: boolean;
  available_jobs: string[];
  experience_summary: string;
  certifications: string[];
  avatar_url: string;
  resume_url: string;
  created_at: string;
  systems?: string[];
  history?: { role: string; org: string; period: string; points: string[] }[];
  coursework?: string[];
  documents?: { label: string; kind: "Resume" | "Work Sample" | "Credential"; url: string }[];
};

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "8f1c2a4e-6b7d-4e1a-9c3f-2d5b7a9e1c01",
    full_name: "Marcus Hale",
    location: "Morehead City, NC",
    bio: "Operations leader who has scaled coastal distribution and hospitality businesses by tightening P&L discipline, cutting cycle times, and building accountable teams. Now pairs 12 years of general management with a proven B2B sales engine, closing multi-year regional accounts.",
    readiness_score: 96,
    is_vetted: true,
    available_jobs: ["Operations Manager", "General Manager", "Sales Representative", "Business Development Manager", "Account Executive", "IT Project Manager"],
    experience_summary: "12 years across operations leadership and B2B sales. Led 40+ person teams, owned $18M P&L, and grew regional B2B revenue 38% YoY.",
    certifications: ["PMP — Project Management Professional", "Lean Six Sigma Green Belt", "Certified Sales Professional (CSP)"],
    avatar_url: marcus,
    resume_url: "/docs/marcus-hale-resume.pdf",
    created_at: "2026-08-14T10:00:00Z",
    systems: ["Jira", "Power BI", "Tableau", "Asana", "Salesforce", "HubSpot", "NetSuite", "Smartsheet"],
    history: [
      { role: "General Manager", org: "Crystal Coast Supply Co.", period: "2020 — Present", points: ["Owned $18M P&L across 3 distribution sites", "Reduced order-to-ship cycle 31% using Jira + Power BI dashboards", "Scaled team from 22 to 44 with 91% retention"] },
      { role: "Director of B2B Sales", org: "Harborline Hospitality Group", period: "2016 — 2020", points: ["Built outbound program closing 60+ corporate accounts", "Grew regional B2B revenue 38% YoY", "Rolled out Salesforce pipeline governance"] },
      { role: "Operations Manager", org: "Beaufort Marine Services", period: "2013 — 2016", points: ["Launched Tableau KPI reporting for 5 departments", "Cut vendor spend 14% through consolidated sourcing"] },
    ],
    coursework: ["Advanced Financial Modeling — UNC Kenan-Flagler Exec Ed", "Agile Leadership (Scrum.org)"],
    documents: [
      { label: "Verified Resume", kind: "Resume", url: "/docs/marcus-hale-resume.pdf" },
      { label: "Operations Turnaround Case Study", kind: "Work Sample", url: "/docs/marcus-case-study.pdf" },
      { label: "PMP Certificate", kind: "Credential", url: "/docs/marcus-pmp.pdf" },
    ],
  },
  {
    id: "3b9e7c21-4a5f-4d8b-8e6a-1f2c3d4e5f02",
    full_name: "Priya Raman",
    location: "Austin, TX",
    bio: "Analytics leader who turns messy operational data into forecasting systems executives actually use. Moving from senior analyst to data product ownership after shipping ML-driven demand models across two SaaS scale-ups.",
    readiness_score: 91,
    is_vetted: true,
    available_jobs: ["Data Analyst", "Scrum Master", "Financial Analyst"],
    experience_summary: "8 years in analytics and data products; built forecasting models saving $2.4M in annual inventory costs.",
    certifications: ["Google Professional Data Engineer", "Certified ScrumMaster (CSM)"],
    avatar_url: priya,
    resume_url: "/docs/priya-raman-resume.pdf",
    created_at: "2026-09-02T10:00:00Z",
    systems: ["Tableau", "Power BI", "Snowflake", "dbt", "Python", "Jira"],
    history: [
      { role: "Lead Data Analyst", org: "Northwind SaaS", period: "2021 — Present", points: ["Shipped demand forecasting model (MAPE 6%)", "Managed 4 analysts in a Scrum cadence"] },
      { role: "Financial Analyst", org: "Lumen Retail", period: "2017 — 2021", points: ["Owned monthly variance reporting for $120M budget"] },
    ],
    coursework: ["Machine Learning Specialization — Stanford Online"],
    documents: [
      { label: "Verified Resume", kind: "Resume", url: "/docs/priya-raman-resume.pdf" },
      { label: "Forecasting Dashboard Sample", kind: "Work Sample", url: "/docs/priya-dashboard.pdf" },
    ],
  },
  {
    id: "5d2a8f10-7c3b-4b9e-a1d4-6e7f8a9b0c03",
    full_name: "Danielle Brooks",
    location: "Raleigh, NC",
    bio: "Registered nurse and clinical operations lead known for cutting ED wait times while keeping patient-satisfaction scores in the top decile. Transitioning toward nursing administration after leading a 60-bed unit's staffing redesign.",
    readiness_score: 88,
    is_vetted: true,
    available_jobs: ["Registered Nurse"],
    experience_summary: "11 years in acute care nursing; charge nurse for 5 years; led staffing redesign reducing overtime 22%.",
    certifications: ["RN License — North Carolina", "BLS / ACLS", "CEN — Certified Emergency Nurse"],
    avatar_url: danielle,
    resume_url: "/docs/danielle-brooks-resume.pdf",
    created_at: "2026-07-21T10:00:00Z",
    systems: ["Epic", "Cerner", "Kronos", "Excel"],
    history: [
      { role: "Charge Nurse, Emergency Dept.", org: "WakeMed Health", period: "2019 — Present", points: ["Reduced door-to-provider time 18 minutes", "Precepted 30+ new graduate nurses"] },
    ],
    coursework: ["Healthcare Leadership Certificate — Duke CE"],
    documents: [{ label: "Verified Resume", kind: "Resume", url: "/docs/danielle-brooks-resume.pdf" }, { label: "RN License", kind: "Credential", url: "/docs/danielle-rn.pdf" }],
  },
  {
    id: "9e4b6c32-1d2e-4f5a-b6c7-8d9e0f1a2b04",
    full_name: "Diego Alvarez",
    location: "Savannah, GA",
    bio: "Port and fleet logistics coordinator who keeps high-volume freight moving on tight vessel windows. Building toward supply chain management after digitizing dispatch workflows for a 120-truck operation.",
    readiness_score: 83,
    is_vetted: false,
    available_jobs: ["Software Engineer", "Sales Representative"],
    experience_summary: "6 years in freight coordination and dispatch; automated scheduling that lifted on-time delivery to 97%.",
    certifications: ["CDL Class A", "APICS CSCP (in progress)"],
    avatar_url: diego,
    resume_url: "/docs/diego-alvarez-resume.pdf",
    created_at: "2026-09-18T10:00:00Z",
    systems: ["SAP TM", "Samsara", "Excel", "Power BI"],
    history: [{ role: "Dispatch Coordinator", org: "Coastal Freightways", period: "2020 — Present", points: ["Lifted on-time delivery from 88% to 97%", "Built Power BI lane profitability report"] }],
    coursework: ["Supply Chain Fundamentals — Georgia Tech"],
    documents: [{ label: "Verified Resume", kind: "Resume", url: "/docs/diego-alvarez-resume.pdf" }],
  },
];

/* ---------- local store: onboarded candidates + bookmarks (until Supabase is connected) ---------- */
const LS_CANDS = "talentdeck:candidates";
const LS_SAVED = "talentdeck:saved";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));

let localCands: Candidate[] | null = null;
let saved: Set<string> | null = null;
let allSnapshot: Candidate[] = MOCK_CANDIDATES;

function load() {
  if (typeof window === "undefined" || localCands) return;
  try { localCands = JSON.parse(localStorage.getItem(LS_CANDS) ?? "[]"); } catch { localCands = []; }
  try { saved = new Set(JSON.parse(localStorage.getItem(LS_SAVED) ?? "[]")); } catch { saved = new Set(); }
  allSnapshot = [...localCands!, ...MOCK_CANDIDATES];
}

export function useCandidates() {
  return useSyncExternalStore(subscribe, () => (load(), allSnapshot), () => MOCK_CANDIDATES);
}
export function addCandidate(c: Candidate) {
  load();
  localCands = [c, ...(localCands ?? [])];
  allSnapshot = [...localCands, ...MOCK_CANDIDATES];
  try { localStorage.setItem(LS_CANDS, JSON.stringify(localCands)); } catch { /* quota */ }
  emit();
}

const EMPTY = new Set<string>();
export function useSaved() {
  return useSyncExternalStore(subscribe, () => (load(), saved ?? EMPTY), () => EMPTY);
}
export function toggleSaved(id: string) {
  load();
  const next = new Set(saved);
  next.has(id) ? next.delete(id) : next.add(id);
  saved = next;
  emit(); // optimistic: UI updates before persistence
  queueMicrotask(() => localStorage.setItem(LS_SAVED, JSON.stringify([...next])));
}

/* ---------- fuzzy search ---------- */
function fuzzyScore(hay: string, needle: string) {
  hay = hay.toLowerCase();
  if (hay.includes(needle)) return 2;
  let i = 0;
  for (const ch of hay) if (ch === needle[i]) i++;
  return i === needle.length ? 1 : 0;
}
export function fuzzyMatch(c: Candidate, q: string) {
  const tokens = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  return tokens.every((t) => fuzzyScore(c.full_name, t) || fuzzyScore(c.location, t) || fuzzyScore(c.bio, t) === 2);
}
