import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { useSessionStore } from "@/store/session";
import { LayoutPublic } from "@/components/layout/public";
import { LayoutPrivate } from "@/components/layout/private";
import { SignIn } from "@/pages/sign-in";
import { SignUp } from "@/pages/sign-up";
import { Dashboard } from "@/pages/dashboard";

export const Router: FC = () => {
  const { user } = useSessionStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPublic />}>
          {!user ? <Route index element={<SignIn />} /> : null}
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>

        <Route element={<LayoutPrivate />}>
          {user ? <Route index element={<Dashboard />} /> : null}
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
