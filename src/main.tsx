import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { AppSidebar } from "@/components/app-sidebar";
import { UserProvider, useUser } from "@/context/UserContext";
import { BrowserRouter } from "react-router-dom";

const AppWrapper = () => {
  const { user } = useUser();

  //logic not to display the sidebar with unauthenticated user
  if (!user) {
    return <App />;
  }

  return (
    <OrganizationProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-full relative">
          <SidebarTrigger
            className="m-5 fixed"
            style={{ display: "block", zIndex: 9999 }}
          />
          <App />
        </main>
      </SidebarProvider>
    </OrganizationProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AppWrapper />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
