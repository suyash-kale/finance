import type { FC } from "react";
import { Outlet } from "react-router";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const LayoutPublic: FC = () => {
  return (
    <div className="bg-gray-100 flex flex-col h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
