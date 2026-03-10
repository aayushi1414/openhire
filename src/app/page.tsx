export const dynamic = "force-dynamic";

import {
  BarChart3,
  FileText,
  Github,
  Link2,
  Linkedin,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Twitter,
  UserCheck,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";

const GITHUB_REPO_API = "https://api.github.com/repos/brijeshmarch16/openhire";

const getGithubStars = async (): Promise<number> => {
  try {
    const response = await fetch(GITHUB_REPO_API, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
};

export const metadata: Metadata = {
  title: "OpenHire — AI-Powered Voice Interviews",
  description:
    "Create AI-driven voice interviews, auto-score candidates, and share interview links — no scheduling needed. Currently in private alpha.",
  openGraph: {
    title: "OpenHire — AI-Powered Voice Interviews",
    description:
      "Create AI-driven voice interviews, auto-score candidates, and share interview links — no scheduling needed. Currently in private alpha.",
    url: "/",
    siteName: "OpenHire",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenHire — AI-Powered Voice Interviews",
    description:
      "Create AI-driven voice interviews, auto-score candidates, and share interview links — no scheduling needed. Currently in private alpha.",
    creator: "@brijeshmarch",
  },
  alternates: { canonical: "/" },
};

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

const features = [
  {
    icon: Sparkles,
    title: "AI Question Generation",
    description:
      "Paste a job description or upload a PDF and get tailored interview questions instantly.",
  },
  {
    icon: Mic,
    title: "Voice Interviews",
    description: "Candidates complete interviews via a real-time AI voice call, no human needed.",
  },
  {
    icon: UserCheck,
    title: "Custom AI Interviewers",
    description:
      "Choose from built-in interviewer personas, each with different communication styles.",
  },
  {
    icon: BarChart3,
    title: "Automated Scoring",
    description:
      "Every response is analyzed for communication skills, soft skills, and overall fit.",
  },
  {
    icon: Link2,
    title: "Shareable Interview Links",
    description: "Send candidates a one-time link, no scheduling or account required.",
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

export default async function LandingPage() {
  const stars = await getGithubStars();

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-border/40 border-b bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-2xl text-foreground">
              Open<span className="font-extrabold text-primary">Hire</span>
            </span>
            <Badge variant="secondary" className="text-[10px]">
              Alpha
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com/brijeshmarch16/openhire/blob/main/docs/quick-start.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Quick Start
            </a>
            <a
              href="https://github.com/brijeshmarch16/openhire/blob/main/docs/deployment-guide.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Deployment Guide
            </a>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-24">
          {/* Subtle radial gradient behind hero */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
            }}
          />

          <h1 className="font-extrabold text-5xl leading-tight tracking-tight sm:text-6xl">
            AI voice interviews,{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              open source and self-hosted.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Create role-specific voice interviews, share a link, and get AI scores — fully open
            source, self-hosted, and deployable on your own infrastructure.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="#try">Want to try?</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href="https://github.com/brijeshmarch16/openhire"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                Star on GitHub 🌟
                <NumberTicker value={stars} />
              </a>
            </Button>
          </div>

          {/* Browser-frame dashboard screenshot */}
          <div className="mt-12 w-full max-w-4xl overflow-hidden rounded-xl border shadow-xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b bg-muted/60 px-4 py-2.5">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-yellow-400" />
              <span className="size-3 rounded-full bg-green-400" />
              <span className="ml-3 flex-1 rounded bg-muted px-3 py-1 text-muted-foreground text-xs">
                openhire-web.vercel.app
              </span>
            </div>
            <Image
              src="/screenshots/hero.gif"
              alt="OpenHire dashboard showing interview management and candidate scoring"
              width={896}
              height={504}
              className="w-full"
              unoptimized
              priority
            />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-8 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
              What&apos;s included
            </p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
              {features.map((f) => (
                <div key={f.title}>
                  <f.icon size={20} className="mb-3 text-primary" />
                  <h3 className="mb-1 font-semibold text-sm">{f.title}</h3>
                  <p className="text-muted-foreground text-xs">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
              How it works
            </p>
            <h2 className="mb-12 font-extrabold text-3xl tracking-tight sm:text-4xl">
              From job description to scored candidate in minutes.
            </h2>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon size={20} className="text-primary" />
                    </div>
                    <span className="font-extrabold text-3xl text-muted-foreground/20">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mb-1 font-semibold text-sm">{step.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Try the Demo */}
        <section id="try" className="bg-muted/30 py-20 text-center sm:py-24">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="mb-4 font-extrabold text-3xl tracking-tight sm:text-4xl">
              Want to try it out?
            </h2>
            <p className="mb-8 text-muted-foreground">
              DM me on X and LinkedIn. I will share credentials and a link privately, but we cannot
              make credentials public because we want to protect paid AI API usage.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="outline" size="lg">
                <a href="https://x.com/brijeshmarch" target="_blank" rel="noopener noreferrer">
                  <Twitter className="mr-2 size-4" />
                  DM on X
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://linkedin.com/in/brijeshmarch16"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 size-4" />
                  DM on LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} OpenHire. All rights reserved.
      </footer>
    </div>
  );
}
