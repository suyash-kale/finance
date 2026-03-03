import "reflect-metadata";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import axios from "axios";

import "@/styles.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient, persister } from "@/lib/query-client";
import { App } from "@/app";
import { Toaster } from "@/components/ui/sonner";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60, // 1 hour
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return query.meta?.persist === true;
          },
        },
      }}
    >
      <TooltipProvider>
        <App />
      </TooltipProvider>
      <Toaster />
    </PersistQueryClientProvider>
  </StrictMode>,
);
