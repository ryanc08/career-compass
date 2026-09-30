import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Heart, MapPin, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Candidate } from "@/lib/candidates";
import { toggleSaved } from "@/lib/candidates";
import { SkeletonImage } from "./SkeletonImage";
import { ReadinessPill, VettedBadge } from "./Badges";
import { cn } from "@/lib/utils";

const stop = (e: React.SyntheticEvent) => e.stopPropagation();

export function CandidateCard({ c, saved, compact }: { c: Candidate; saved: boolean; compact?: boolean }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const go = () => navigate({ to: "/candidate/$id", params: { id: c.id } });

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => e.key === "Enter" && e.target === e.currentTarget && go()}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative">
        <SkeletonImage src={c.avatar_url} alt={c.full_name} className="transition-transform duration-500" />
        <div className="absolute inset-x-2 top-2 flex flex-wrap items-start justify-between gap-1">
          {c.is_vetted ? <VettedBadge /> : <span />}
          <ReadinessPill score={c.readiness_score} />
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col gap-3", compact ? "p-3" : "p-4")}>
        <div className="min-w-0">
          <h3 className={cn("truncate font-semibold", compact ? "text-base" : "text-xl")}>{c.full_name}</h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" /> {c.location}
          </p>
        </div>
        {!compact && <p className="line-clamp-4 text-sm leading-relaxed text-foreground/80">{c.bio}</p>}

        <div className="rounded-lg border bg-secondary/60" onClick={stop} onKeyDown={stop}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
            aria-expanded={open}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold"
          >
            Qualified Roles ({c.available_jobs.length})
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-wrap gap-1 overflow-hidden px-3"
              >
                {c.available_jobs.map((j) => (
                  <li key={j} className="mb-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">{j}</li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            aria-label={saved ? "Remove bookmark" : "Bookmark candidate"}
            aria-pressed={saved}
            onClick={(e) => { e.stopPropagation(); toggleSaved(c.id); }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-card transition active:scale-90"
          >
            <Heart className={cn("h-4 w-4 transition-colors", saved ? "fill-destructive text-destructive" : "text-muted-foreground")} />
          </button>
          <Link
            to="/candidate/$id"
            params={{ id: c.id }}
            onClick={stop}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Evaluate Profile <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
