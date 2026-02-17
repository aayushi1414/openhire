import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "OpenHire",
  description: "AI powered Interviews",
  icons: {
    icon: "/browser-user-icon.ico",
  },
  openGraph: {
    title: "OpenHire",
    description: "AI-powered Interviews",
    siteName: "OpenHire",
    images: [
      {
        url: "/openhire.png",
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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            toastOptions={{
              classNames: {
                toast: "bg-white border-2 border-indigo-400",
                title: "text-black",
                description: "text-red-400",
                actionButton: "bg-indigo-400",
                cancelButton: "bg-orange-400",
                closeButton: "bg-lime-400",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
