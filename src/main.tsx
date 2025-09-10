import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./custom.css";
import App from "./App.jsx";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { OrganizationProvider } from "@/context/OrganizationContext";
import { AppSidebar } from "@/components/sidebars/app-sidebar";
// import { UserProvider, useUser } from "@/context/UserContext";
import { BrowserRouter } from "react-router-dom";
// import { CompanyProvider } from "./stores/CompanyStore";
import Landing from "./pages/main/Landing";
import useUserStore from "./stores/userStore";

import { PostHogProvider } from "posthog-js/react";

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
};

const AppWrapper = () => {
  return (
    <main className="w-full h-full relative bg-background text-foreground ">
      <App />
    </main>
  );
};

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
  // </StrictMode>
);
