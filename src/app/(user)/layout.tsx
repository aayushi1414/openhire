import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenHire",
  icons: {
    icon: "/browser-user-icon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
