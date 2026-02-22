"use client";

import { LogOut, PlayCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth/client";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/sign-in");
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="border-sidebar-border border-b p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2 group-data-[collapsible=icon]:hidden">
            <div className="font-semibold text-2xl text-slate-800">
              Open<span className="font-extrabold text-primary">Hire</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Alpha
            </Badge>
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/" || pathname.startsWith("/interviews")}
                tooltip="Interviews"
              >
                <Link href="/">
                  <PlayCircleIcon />
                  <span>Interviews</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-2">
        <div className="rounded-md p-2">
          <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm">{session?.user.name}</p>
              <p className="truncate text-muted-foreground text-sm">{session?.user.email}</p>
            </div>
            <Button variant="ghost" onClick={handleLogout} size="icon" aria-label="Log out">
              <LogOut className="cursor-pointer text-muted-foreground" size={16} />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
