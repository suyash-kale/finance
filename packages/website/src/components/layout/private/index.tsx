import { useEffect, type FC } from "react";
import { Outlet, useNavigate } from "react-router";

import { Footer } from "@/components/footer";
import { useSessionStore } from "@/store/session";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SideBar } from "@/components/layout/private/side-bar";

export const LayoutPrivate: FC = () => {
  const navigate = useNavigate();

  const { user } = useSessionStore();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset className="bg-gray-100 flex flex-col h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};
