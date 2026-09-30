import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-display text-lg font-bold text-ink-foreground">T</span>
      <span className="hidden font-display text-xl font-semibold sm:inline">TalentDeck</span>
    </Link>
  );
}

export function OnboardButton() {
  return (
    <Button asChild className="shrink-0">
      <Link to="/onboard"><Plus className="h-4 w-4" /><span className="hidden md:inline">Candidate Onboarding</span></Link>
    </Button>
  );
}
