import { FileText, Link2, Mic, Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Create an interview",
    description:
      "Paste a job description or upload a PDF. AI analyzes the role and generates tailored interview questions in seconds.",
  },
  {
    number: "02",
    icon: Link2,
    title: "Share a link",
    description:
      "Copy the one-time interview link and send it to your candidate. No accounts, installs, or scheduling required.",
  },
  {
    number: "03",
    icon: Mic,
    title: "Candidate interviews",
    description:
      "The candidate joins a real-time AI voice call and answers questions at their own pace — anytime, anywhere.",
  },
  {
    number: "04",
    icon: Search,
    title: "Review results",
    description:
      "Get an AI-generated scorecard covering communication, technical relevance, and soft skills with a detailed breakdown.",
  },
];

export default function MarketingHowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          How it works
        </p>
        <h2 className="mb-12 font-extrabold text-3xl tracking-tight sm:text-4xl">
          From job description to scored candidate in minutes.
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.number} size="sm">
              <CardContent>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon size={20} className="text-primary" />
                  </div>
                  <span className="font-extrabold text-3xl text-muted-foreground/50">
                    {step.number}
                  </span>
                </div>
                <h3 className="mb-1 font-semibold text-base">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
