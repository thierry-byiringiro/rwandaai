import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Hotel,
  Mountain,
  Plane,
  Inbox,
  MessageSquare,
  LogOut,
  Home,
  Sparkles,
  StickyNote,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Bookings", url: "/admin/bookings", icon: Inbox },
  { title: "Inquiries", url: "/admin/inquiries", icon: MessageSquare },
  { title: "Hotels", url: "/admin/hotels", icon: Hotel },
  { title: "Activities", url: "/admin/activities", icon: Mountain },
  { title: "Flights", url: "/admin/flights", icon: Plane },
  { title: "AI Analyzer", url: "/admin/analyzer", icon: Sparkles },
  { title: "Notes", url: "/admin/notes", icon: StickyNote },
];

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="px-4 py-5 border-b border-sidebar-border">
              <p className="font-display text-lg font-bold text-sidebar-foreground">Strong Peak</p>
              <p className="text-xs text-sidebar-foreground/60">Admin Console</p>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Manage</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.end}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "hover:bg-sidebar-accent/50"
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/" className="hover:bg-sidebar-accent/50">
                        <Home className="h-4 w-4" />
                        <span>View site</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-background px-4 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="font-display text-lg font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
