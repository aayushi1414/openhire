import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL as string;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OpenHire",
  description: "AI-powered Interviews",
  icons: {
    icon: "/browser-client-icon.ico",
  },
  openGraph: {
    title: "OpenHire",
    description: "AI-powered Interviews",
    siteName: "OpenHire",
    images: [
      {
        url: new URL("/openhire.png", siteUrl).toString(),
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <Providers>
          {children}
          <Toaster
            toastOptions={{
              classNames: {
                toast: "bg-white",
                title: "text-black",
                description: "text-red-400",
                actionButton: "bg-indigo-400",
                cancelButton: "bg-orange-400",
                closeButton: "bg-white-400",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
