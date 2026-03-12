import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MarketingCta from "@/components/marketing/marketing-cta";
import MarketingFeatures from "@/components/marketing/marketing-features";
import MarketingFooter from "@/components/marketing/marketing-footer";
import MarketingHeader from "@/components/marketing/marketing-header";
import MarketingHero from "@/components/marketing/marketing-hero";
import MarketingHowItWorks from "@/components/marketing/marketing-how-it-works";

const getGithubStars = async (): Promise<number> => {
  try {
    const response = await fetch("https://api.github.com/repos/brijeshmarch16/openhire", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) return 0;
    const data = (await response.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
};

export const metadata: Metadata = {
  title: "OpenHire — AI-Powered Voice Interviews",
  description:
    "Create role-specific voice interviews, share a link, and get AI scores — fully open source, self-hosted, and deployable on your own infrastructure.",
  openGraph: {
    title: "OpenHire — AI-Powered Voice Interviews",
    description:
      "Create role-specific voice interviews, share a link, and get AI scores — fully open source, self-hosted, and deployable on your own infrastructure.",
    url: "/",
    siteName: "OpenHire",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenHire — AI-Powered Voice Interviews",
    description:
      "Create role-specific voice interviews, share a link, and get AI scores — fully open source, self-hosted, and deployable on your own infrastructure.",
    creator: "@brijeshmarch",
  },
  alternates: { canonical: "/" },
};

export default async function LandingPage() {
  if (process.env.NEXT_PUBLIC_MARKETING_ENABLED !== "true") {
    redirect("/dashboard");
  }

  const stars = await getGithubStars();

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <MarketingHeader />

      <main className="flex flex-1 flex-col">
        <MarketingHero stars={stars} />

        <MarketingHowItWorks />

        <MarketingFeatures />

        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
