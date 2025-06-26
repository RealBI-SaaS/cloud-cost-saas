import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./custom.css";
import App from "./App.jsx";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { AppSidebar } from "@/components/sidebars/app-sidebar";
import { UserProvider, useUser } from "@/context/UserContext";
import { BrowserRouter } from "react-router-dom";
//import { ThemeProvider } from "./context/ThemeContext";
import { CompanyProvider } from "./stores/CompanyStore";
import Landing from "./pages/main/Landing";
import useUserStore from "./stores/userStore";

import { PostHogProvider } from 'posthog-js/react'

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
}


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
      <main className="w-full h-full relative">
        {/* <SidebarTrigger
              className="m-5 fixed bottom-0"
              style={{ display: "block" }}
            /> */}
        <App />
      </main>
    </CompanyProvider>
    // </OrganizationProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
    <BrowserRouter>
      {/* <UserProvider> */}
      <AppWrapper />
      {/* </UserProvider> */}
    </BrowserRouter>

    </PostHogProvider>
  </StrictMode>,
);


