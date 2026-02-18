import Navbar from "@/components/navbar";
import SideMenu from "@/components/sideMenu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenHire Dashboard",
  icons: {
    icon: "/browser-client-icon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <div className="flex flex-row h-screen overflow-hidden">
        <SideMenu />
        <div className="ml-[200px] pt-[64px] h-full overflow-y-auto flex-grow">{children}</div>
      </div>
    </>
  );
}
