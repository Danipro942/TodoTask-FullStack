import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContext from "./context/userContext.tsx";
import AppRouter from "./pages/index.tsx";

import "./index.css";
import TaskContext from "./context/useTasks.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContext>
        <TaskContext>
          <AppRouter />
        </TaskContext>
      </UserContext>
    </QueryClientProvider>
  </StrictMode>
);
