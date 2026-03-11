import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL as string;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OpenHire",
  description: "AI-powered Interviews",
  icons: {
    icon: "/browser-client-icon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(GeistSans.className, "min-h-screen antialiased")}>
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
