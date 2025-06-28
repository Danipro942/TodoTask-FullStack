import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContext from "./context/userContext.tsx";
import router from "./pages/index.tsx";
import AppRouter from "./pages/index.tsx";

import "./index.css";
import App from "./App.tsx";
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
