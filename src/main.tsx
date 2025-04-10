import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "antd/dist/reset.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { AppSidebar } from "@/components/app-sidebar";
import { UserProvider, useUser } from "@/context/UserContext";
import { BrowserRouter } from "react-router-dom";

const AppWrapper = () => {
  const { user } = useUser();

  if (!user) {
    return <App />;
  }

  return (
    <OrganizationProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
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

//
//<div className="gradient container  min-h-screen min-w-screen grid grid-cols-1 justify-center ">
//  <App />
//</div>
//
