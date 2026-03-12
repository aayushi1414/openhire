import { BarChart3, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const features = [
  {
    icon: UserCheck,
    title: "Custom AI Interviewers",
    description:
      "Choose from built-in interviewer personas, each with different communication styles.",
  },
  {
    icon: Users,
    title: "Candidate Pipeline",
    description: "Manage candidate status (Selected, Potential, Not Selected) from the dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity Monitoring",
    description: "Detects tab switching during interviews.",
  },
  {
    icon: BarChart3,
    title: "Interview Analytics",
    description:
      "Track completion rates, sentiment distribution, and average duration per interview.",
  },
];

export default function MarketingFeatures() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          What&apos;s included
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group transition-all hover:-translate-y-1 hover:shadow-lg"
              size="sm"
            >
              <CardContent>
                <f.icon size={20} className="mb-3 text-primary" />
                <h3 className="mb-1 font-semibold text-base">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
