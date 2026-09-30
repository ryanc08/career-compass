import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CandidateCard } from "@/components/CandidateCard";
import { RolePicker } from "@/components/RolePicker";
import { Logo, OnboardButton } from "@/components/SiteHeader";
import { fuzzyMatch, useCandidates, useSaved } from "@/lib/candidates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentDeck — Vetted Candidate Directory" },
      { name: "description", content: "Browse vetted, readiness-scored candidates and filter by industry, subcategory and exact job title." },
      { property: "og:title", content: "TalentDeck — Vetted Candidate Directory" },
      { property: "og:description", content: "Browse vetted, readiness-scored candidates filtered by a standardized job framework." },
    ],
  }),
  component: Directory,
});

type Density = "2" | "4" | "6";
const GRID: Record<Density, string> = {
  "2": "grid-cols-1 sm:grid-cols-2",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
  "6": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
};

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

function Directory() {
  const candidates = useCandidates();
  const saved = useSaved();
  const [query, setQuery] = useState("");
  const [density, setDensity] = useState<Density>("4");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"any" | "all">("any");

  const dSel = useDebounced(selected, 250);
  const dQuery = useDebounced(query, 250);
  const dMode = useDebounced(mode, 250);

  const toggle = (t: string) => setSelected((s) => { const n = new Set(s); n.has(t) ? n.delete(t) : n.add(t); return n; });

  const results = useMemo(() => {
    const sel = [...dSel];
    return candidates.filter((c) => {
      if (!fuzzyMatch(c, dQuery)) return false;
      if (!sel.length) return true;
      return dMode === "any" ? sel.some((t) => c.available_jobs.includes(t)) : sel.every((t) => c.available_jobs.includes(t));
    });
  }, [candidates, dSel, dQuery, dMode]);

  const filters = (
    <FilterPanel selected={selected} toggle={toggle} clear={() => setSelected(new Set())} mode={mode} setMode={setMode} />
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
          <Logo />
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, bio, location…" className="h-10 bg-card pl-9" />
          </div>
          <Select value={density} onValueChange={(v) => setDensity(v as Density)}>
            <SelectTrigger className="hidden h-10 w-[130px] shrink-0 bg-card sm:flex" aria-label="Grid density"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
              <SelectItem value="6">6 Columns</SelectItem>
            </SelectContent>
          </Select>
          <OnboardButton />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-72 shrink-0 overflow-y-auto rounded-xl border bg-sidebar p-4 lg:block">{filters}</aside>

        <main className="min-w-0 flex-1">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold md:text-4xl">Candidate Directory</h1>
              <p className="mt-1 text-sm text-muted-foreground">{results.length} of {candidates.length} candidates · {saved.size} saved</p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="shrink-0 lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters{selected.size ? ` (${selected.size})` : ""}</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
                <SheetHeader><SheetTitle>Filter candidates</SheetTitle></SheetHeader>
                <div className="px-4 pb-6">{filters}</div>
              </SheetContent>
            </Sheet>
          </div>

          <motion.div layout className={cn("grid gap-4", GRID[density])}>
            <AnimatePresence mode="popLayout">
              {results.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                >
                  <CandidateCard c={c} saved={saved.has(c.id)} compact={density === "6"} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {results.length === 0 && (
            <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">No candidates match these filters.</div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterPanel({ selected, toggle, clear, mode, setMode }: { selected: Set<string>; toggle: (t: string) => void; clear: () => void; mode: "any" | "all"; setMode: (m: "any" | "all") => void }) {
  const [find, setFind] = useState("");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Roles</h2>
        {selected.size > 0 && <button onClick={clear} className="text-xs font-semibold text-primary hover:underline">Clear All</button>}
      </div>
      <ToggleGroup type="single" value={mode} onValueChange={(v) => v && setMode(v as "any" | "all")} className="grid w-full grid-cols-2 rounded-lg border bg-card p-1">
        <ToggleGroupItem value="any" className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Match Any</ToggleGroupItem>
        <ToggleGroupItem value="all" className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Match All</ToggleGroupItem>
      </ToggleGroup>
      {selected.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {[...selected].map((t) => (
            <button key={t} onClick={() => toggle(t)} className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
              {t} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
      <Input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find a job title…" className="h-9 bg-card text-xs" />
      <RolePicker selected={selected} onToggle={toggle} filter={find} />
    </div>
  );
}
