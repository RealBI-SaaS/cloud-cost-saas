import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { AppSidebar } from "@/components/app-sidebar";
import { UserProvider, useUser } from "@/context/UserContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CompanyProvider } from "./context/CompanyContext";
import Landing from "./components/Landing";
import useUserStore from "./context/userStore";

const AppWrapper = () => {
  //const { user } = useUser();
  // const user = useUserStore((state) => state.user);

  //logic not to display the sidebar with unauthenticated user
  //if (!user) {
  //  return <Landing />;
  //}
  //
  return (
    // <OrganizationProvider>
      <CompanyProvider>
        <ThemeProvider>
          <main className="w-full h-full relative">
            {/* <SidebarTrigger
              className="m-5 fixed bottom-0"
              style={{ display: "block" }}
            /> */}
            <App />
          </main>
        </ThemeProvider>
      </CompanyProvider>
    // </OrganizationProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <UserProvider> */}
      <AppWrapper />
      {/* </UserProvider> */}
    </BrowserRouter>
  </StrictMode>,
);
