import { useEffect, type FC } from "react";
import { Outlet, useNavigate } from "react-router";

import { Footer } from "@/components/footer";
import { useSessionStore } from "@/store/session";

export const LayoutPrivate: FC = () => {
  const navigate = useNavigate();

  const { user } = useSessionStore();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  return (
    <div className="bg-gray-100 flex flex-col h-screen">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
