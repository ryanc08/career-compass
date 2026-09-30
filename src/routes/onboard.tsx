import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ImagePlus, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RolePicker } from "@/components/RolePicker";
import { Logo } from "@/components/SiteHeader";
import { addCandidate } from "@/lib/candidates";
import { DOMAINS } from "@/lib/jobs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboard")({
  head: () => ({
    meta: [
      { title: "Candidate Onboarding — TalentDeck" },
      { name: "description", content: "Join TalentDeck: share your quick pitch, upload your resume and select the roles you're qualified for." },
      { property: "og:title", content: "Candidate Onboarding — TalentDeck" },
      { property: "og:description", content: "Create your TalentDeck candidate profile in minutes." },
    ],
  }),
  component: Onboard,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  location: z.string().trim().min(2, "Enter your location").max(100),
  bio: z.string().trim().min(20, "Write a 2-sentence pitch").max(500).refine((s) => (s.match(/[.!?](\s|$)/g) ?? []).length === 2, "Quick Pitch must be exactly 2 sentences"),
  history: z.string().trim().max(3000),
  certs: z.string().trim().max(1000),
  systems: z.string().trim().max(500),
});

const readFile = (f: File) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); });

function Onboard() {
  const nav = useNavigate();
  const [form, setForm] = useState({ full_name: "", location: "", bio: "", history: "", certs: "", systems: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [domains, setDomains] = useState<string[]>([]);
  const [roles, setRoles] = useState<Set<string>>(new Set());
  const [avatar, setAvatar] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!r.success) r.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
    if (!roles.size) errs.roles = "Select at least one role";
    if (avatar && avatar.size > 1.5e6) errs.avatar = "Image must be under 1.5 MB";
    setErrors(errs);
    if (Object.keys(errs).length || !r.success) return toast.error("Please fix the highlighted fields");
    const id = crypto.randomUUID();
    addCandidate({
      id,
      full_name: r.data.full_name,
      location: r.data.location,
      bio: r.data.bio,
      readiness_score: 75,
      is_vetted: false,
      available_jobs: [...roles],
      experience_summary: r.data.history,
      certifications: r.data.certs.split(/\n|,/).map((s) => s.trim()).filter(Boolean),
      systems: r.data.systems.split(/,|\n/).map((s) => s.trim()).filter(Boolean),
      avatar_url: avatar ? await readFile(avatar) : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(r.data.full_name)}`,
      resume_url: resume ? URL.createObjectURL(resume) : "",
      created_at: new Date().toISOString(),
    });
    toast.success("Profile submitted — welcome to TalentDeck");
    nav({ to: "/candidate/$id", params: { id } });
  };

  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="text-xs text-destructive">{errors[k]}</p> : null);

  return (
    <div className="min-h-screen">
      <header className="border-b"><div className="mx-auto max-w-4xl px-4 py-3"><Logo /></div></header>
      <form onSubmit={submit} className="mx-auto max-w-4xl space-y-10 px-4 py-10">
        <div>
          <h1 className="text-4xl font-semibold md:text-5xl">Candidate Onboarding</h1>
          <p className="mt-2 text-muted-foreground">Five minutes. One profile employers can evaluate at a glance.</p>
        </div>

        <Step n={1} title="The basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name"><Input value={form.full_name} onChange={set("full_name")} maxLength={100} /><Err k="full_name" /></Field>
            <Field label="Location"><Input value={form.location} onChange={set("location")} placeholder="City, State" maxLength={100} /><Err k="location" /></Field>
          </div>
          <Field label="Quick Pitch (exactly 2 sentences)">
            <Textarea value={form.bio} onChange={set("bio")} rows={3} maxLength={500} placeholder="Sentence one: your operational strengths. Sentence two: where your career is heading." />
            <Err k="bio" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Upload icon={ImagePlus} label="Profile image" accept="image/*" file={avatar} onFile={setAvatar} />
            <Upload icon={FileUp} label="PDF resume" accept="application/pdf" file={resume} onFile={setResume} />
          </div>
          <Err k="avatar" />
        </Step>

        <Step n={2} title="Standardized role selection">
          <p className="text-sm text-muted-foreground">Pick your industry domains, then open subcategories and check every role you're qualified and comfortable performing.</p>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => {
              const on = domains.includes(d);
              return (
                <label key={d} className={cn("flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition", on ? "border-primary bg-accent text-accent-foreground" : "bg-card hover:bg-secondary")}>
                  <Checkbox checked={on} onCheckedChange={() => setDomains(on ? domains.filter((x) => x !== d) : [...domains, d])} /> {d}
                </label>
              );
            })}
          </div>
          {domains.length > 0 && (
            <div className="rounded-xl border bg-card p-3">
              <RolePicker domains={domains} selected={roles} onToggle={(t) => setRoles((s) => { const n = new Set(s); n.has(t) ? n.delete(t) : n.add(t); return n; })} />
            </div>
          )}
          {roles.size > 0 && <p className="text-sm font-medium text-primary">{roles.size} role{roles.size > 1 ? "s" : ""} selected</p>}
          <Err k="roles" />
        </Step>

        <Step n={3} title="Experience & credentials">
          <Field label="Operational History"><Textarea rows={5} value={form.history} onChange={set("history")} maxLength={3000} placeholder="Roles, teams led, metrics moved…" /></Field>
          <Field label="Certifications (one per line)"><Textarea rows={3} value={form.certs} onChange={set("certs")} maxLength={1000} /></Field>
          <Field label="Systems Experience (comma separated)"><Textarea rows={2} value={form.systems} onChange={set("systems")} maxLength={500} placeholder="Jira, Power BI, Tableau" /></Field>
        </Step>

        <Button type="submit" size="lg" className="w-full sm:w-auto">Submit profile</Button>
      </form>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border bg-card/60 p-5 md:p-7">
      <h2 className="flex items-center gap-3 text-2xl font-semibold"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-sans text-sm text-ink-foreground">{n}</span>{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
function Upload({ icon: Icon, label, accept, file, onFile }: { icon: typeof FileUp; label: string; accept: string; file: File | null; onFile: (f: File | null) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed bg-background p-4 transition hover:border-primary">
      <Icon className="h-6 w-6 shrink-0 text-primary" />
      <div className="min-w-0"><p className="text-sm font-semibold">{label}</p><p className="truncate text-xs text-muted-foreground">{file ? file.name : "Click to upload"}</p></div>
      <input type="file" accept={accept} className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
    </label>
  );
}
