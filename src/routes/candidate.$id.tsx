import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Award, BookOpen, Download, FileText, Heart, Mail, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonImage } from "@/components/SkeletonImage";
import { ReadinessPill, VettedBadge } from "@/components/Badges";
import { Logo, OnboardButton } from "@/components/SiteHeader";
import { toggleSaved, useCandidates, useSaved } from "@/lib/candidates";
import { groupTitles, TITLE_INDEX, stripLicense } from "@/lib/jobs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/candidate/$id")({
  head: () => ({
    meta: [
      { title: "Candidate Profile — TalentDeck" },
      { name: "description", content: "Executive candidate portfolio: roles matrix, operational history, credentials and verified documents." },
      { property: "og:title", content: "Candidate Profile — TalentDeck" },
      { property: "og:description", content: "Executive candidate portfolio on TalentDeck." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { id } = Route.useParams();
  const c = useCandidates().find((x) => x.id === id);
  const saved = useSaved();

  if (!c) return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div><h1 className="text-3xl font-semibold">Candidate not found</h1><Link to="/" className="mt-4 inline-block text-primary underline">Back to directory</Link></div>
    </div>
  );

  const grouped = groupTitles(c.available_jobs);
  const exportJson = () => {
    const { avatar_url, ...rest } = c;
    const payload = { ...rest, avatar_url: avatar_url.startsWith("data:") ? null : avatar_url, roles: c.available_jobs.map((t) => ({ title: t, ...TITLE_INDEX.get(t) })) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${c.full_name.replace(/\s+/g, "-").toLowerCase()}-ats.json` });
    a.click(); URL.revokeObjectURL(url);
  };
  const isSaved = saved.has(c.id);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Logo />
          <OnboardButton />
        </div>
      </header>

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Directory</Link>

        <section className="grid gap-8 md:grid-cols-[280px_minmax(0,1fr)]">
          <SkeletonImage src={c.avatar_url} alt={c.full_name} eager className="rounded-2xl shadow-lift" />
          <div className="flex min-w-0 flex-col justify-end gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {c.is_vetted && <VettedBadge className="border" />}
              <ReadinessPill score={c.readiness_score} />
            </div>
            <h1 className="text-4xl font-semibold md:text-6xl">{c.full_name}</h1>
            <p className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" /> {c.location}</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild><a href={`mailto:?subject=${encodeURIComponent("Opportunity for " + c.full_name)}`}><Mail className="h-4 w-4" /> Contact Candidate</a></Button>
              <Button variant="outline" onClick={exportJson}><Download className="h-4 w-4" /> Export Candidate JSON / ATS</Button>
              <Button variant="ghost" onClick={() => toggleSaved(c.id)} aria-pressed={isSaved}>
                <Heart className={cn("h-4 w-4", isSaved && "fill-destructive text-destructive")} /> {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-ink p-6 text-ink-foreground md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">The Quick Pitch</p>
          <p className="mt-3 font-display text-xl leading-snug md:text-3xl">{c.bio}</p>
        </section>

        <Section title="Skills & Roles Matrix" icon={Award}>
          <TooltipProvider delayDuration={150}>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(grouped).map(([d, subs]) => (
                <div key={d} className="rounded-xl border bg-card p-4">
                  <h3 className="text-lg font-semibold">{d}</h3>
                  {Object.entries(subs).map(([s, titles]) => (
                    <div key={s} className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {titles.map((t) => (
                          <Tooltip key={t}>
                            <TooltipTrigger asChild>
                              <span className="cursor-default rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground transition hover:bg-primary hover:text-primary-foreground">{t}</span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">{stripLicense(TITLE_INDEX.get(t)?.description ?? "")}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </Section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Section title="Experience & Operational History" icon={BookOpen}>
            <p className="mb-5 text-sm text-muted-foreground">{c.experience_summary}</p>
            {c.history?.length ? (
              <ol className="relative space-y-6 border-l pl-6">
                {c.history.map((h) => (
                  <li key={h.role + h.org} className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <p className="text-xs font-semibold text-muted-foreground">{h.period}</p>
                    <h3 className="text-lg font-semibold">{h.role} · <span className="font-normal">{h.org}</span></h3>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-foreground/80">{h.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  </li>
                ))}
              </ol>
            ) : null}
            {c.systems?.length ? (
              <div className="mt-6">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Wrench className="h-4 w-4" /> Systems Mastered</p>
                <div className="flex flex-wrap gap-1.5">{c.systems.map((s) => <span key={s} className="rounded-md border bg-card px-2 py-1 text-xs font-semibold">{s}</span>)}</div>
              </div>
            ) : null}
          </Section>

          <div>
            <Section title="Education & Credentials" icon={Award}>
              <ul className="space-y-2">
                {c.certifications.map((x) => <li key={x} className="rounded-lg border bg-card px-3 py-2 text-sm">{x}</li>)}
                {c.coursework?.map((x) => <li key={x} className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">Coursework · {x}</li>)}
              </ul>
            </Section>
            <Section title="Documents & Media" icon={FileText}>
              <div className="space-y-2">
                {(c.documents ?? [{ label: "Resume", kind: "Resume" as const, url: c.resume_url }]).filter((d) => d.url).map((d) => (
                  <div key={d.label} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><FileText className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{d.label}</p><p className="text-xs text-muted-foreground">{d.kind} · PDF</p></div>
                    <Button asChild size="sm" variant="outline"><a href={d.url} download><Download className="h-4 w-4" /></a></Button>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Award; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold"><Icon className="h-5 w-5 text-primary" /> {title}</h2>
      {children}
    </section>
  );
}
