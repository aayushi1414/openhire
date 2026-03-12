import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { MarketingGetStartedDialog } from "./marketing-get-started-dialog";

export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-border/40 border-b bg-background/60 backdrop-blur">
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
          <ThemeToggle />
          <MarketingGetStartedDialog triggerAriaLabel="Open setup options dialog">
            <Button>Get Started</Button>
          </MarketingGetStartedDialog>
        </div>
      </div>
    </header>
  );
}
