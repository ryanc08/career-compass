import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { JOBS } from "@/lib/jobs";
import { cn } from "@/lib/utils";

/** Cascading Domain -> Subcategory -> Title multi-select, driven by job_hierarchy_framework.json */
export function RolePicker({ selected, onToggle, domains, filter = "" }: { selected: Set<string>; onToggle: (title: string) => void; domains?: string[]; filter?: string }) {
  const [openD, setOpenD] = useState<Set<string>>(new Set());
  const [openS, setOpenS] = useState<Set<string>>(new Set());
  const q = filter.trim().toLowerCase();
  const flip = (set: Set<string>, k: string, fn: (s: Set<string>) => void) => { const n = new Set(set); n.has(k) ? n.delete(k) : n.add(k); fn(n); };

  const tree = useMemo(() => {
    const ds = domains ?? Object.keys(JOBS);
    return ds.map((d) => ({
      d,
      subs: Object.entries(JOBS[d]).map(([s, titles]) => ({ s, titles: Object.keys(titles).filter((t) => !q || t.toLowerCase().includes(q)) })).filter((x) => x.titles.length),
    })).filter((x) => x.subs.length);
  }, [domains, q]);

  return (
    <div className="space-y-1">
      {tree.map(({ d, subs }) => {
        const dOpen = !!q || openD.has(d);
        const count = subs.reduce((n, s) => n + s.titles.filter((t) => selected.has(t)).length, 0);
        return (
          <div key={d} className="rounded-lg">
            <button type="button" onClick={() => flip(openD, d, setOpenD)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold hover:bg-secondary">
              <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform", dOpen && "rotate-90")} />
              <span className="min-w-0 flex-1 truncate">{d}</span>
              {count > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{count}</span>}
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-300", dOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden pl-4">
                {subs.map(({ s, titles }) => {
                  const key = d + "|" + s;
                  const sOpen = !!q || openS.has(key);
                  return (
                    <div key={key}>
                      <button type="button" onClick={() => flip(openS, key, setOpenS)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <ChevronRight className={cn("h-3 w-3 shrink-0 transition-transform", sOpen && "rotate-90")} />
                        <span className="min-w-0 flex-1 truncate">{s}</span>
                      </button>
                      {sOpen && (
                        <ul className="space-y-0.5 py-1 pl-6">
                          {titles.map((t) => (
                            <li key={t}>
                              <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-secondary">
                                <Checkbox checked={selected.has(t)} onCheckedChange={() => onToggle(t)} />
                                <span className="min-w-0 truncate">{t}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
