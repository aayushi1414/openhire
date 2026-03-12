import { Button } from "../ui/button";
import { MarketingGetStartedDialog } from "./marketing-get-started-dialog";

export default function MarketingCta() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-2 font-semibold text-xl sm:text-2xl">Deploy OpenHire in minutes.</p>
        <p className="mb-5 text-base text-muted-foreground">
          Self-hosted, MIT licensed, and ready for Vercel or Docker.
        </p>
        <MarketingGetStartedDialog>
          <Button size="lg">Get Started</Button>
        </MarketingGetStartedDialog>
        <p className="mt-4 text-muted-foreground text-sm">
          Support us by giving OpenHire a star on{" "}
          <a
            href="https://github.com/brijeshmarch16/openhire"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            GitHub.
          </a>
        </p>
      </div>
    </section>
  );
}
