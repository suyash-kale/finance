import { useEffect, type FC } from "react";
import { useQuery } from "@tanstack/react-query";

import { Router } from "@/router";
import { useSessionStore } from "@/store/session";
import { authOptions } from "@/services/auth";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export const App: FC = () => {
  const { user, signIn } = useSessionStore();

  const token = localStorage.getItem("token");

  const { isLoading, data } = useQuery(
    authOptions(token, { enabled: !user && !!token }),
  );

  useEffect(() => {
    if (data) {
      signIn(data);
    }
  }, [data, signIn]);

  return isLoading ? (
    <div className="flex flex-col h-full items-center justify-center">
      <Card className="w-100">
        <CardHeader>
          <CardTitle className="text-xl text-center">Please wait ..</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            <Spinner /> We are getting things ready for you.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ) : (
    <Router />
  );
};
