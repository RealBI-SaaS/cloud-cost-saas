import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useUserStore from "@/stores/userStore";
import useCompany from "@/stores/CompanyStore";
import useCloudAccountsStore from "@/stores/CloudAccountStore";

import MainLayout from "./layout/MainLayout";
import SettingsLayout from "./layout/SettingsLayout";
import NotFound from "@/pages/misc/NotFound";
import CreateCompanyDialog from "@/components/dialogs/CreateCompanyDialog";
import { publicRoutes } from "./route/publicRoutes";
import { ProtectedWrapper } from "./route/ProtectedWrapper";
import { protectedRoutes } from "./route/protectedRoutes";
import { settingsRoutes } from "./route/settingsRoutes";
import { otherProtectedRoutes } from "./route/otherProtectedRoutes";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const userComp = useCompany((state) => state.userComp);
  const noUserComp = useCompany((state) => state.noUserComp);

  const initializeCompany = useCompany((state) => state.initializeCompany);
  const fetchAccounts = useCloudAccountsStore((state) => state.fetchAccounts);

  useEffect(() => {
    if (noUserComp && location.pathname.startsWith("/cfv")) {
      setOpen(true);
    }
  }, [user, noUserComp, location.pathname]);

  const onCreateCompany = () => {
    navigate("/settings/company/details");
  };

  useEffect(() => {
    // setTheme();
    if (user) {
      initializeCompany();
    }
  }, [user, initializeCompany]);

  useEffect(() => {
    if (user && userComp) {
      fetchAccounts(userComp.id);
    }
  }, [user, userComp, fetchAccounts]);

  return (
    <ThemeProvider
      defaultTheme="system"
      // enableSystem
      // disableTransitionOnChange

      storageKey="vite-ui-theme"
    >
      <Toaster toastOptions={{ duration: 3000 }} position="top-center" />

      <CreateCompanyDialog
        open={open}
        setOpen={setOpen}
        onCreateCompany={onCreateCompany}
      />

      <div className="w-full grid grid-cols-1 mx-auto ">
        <Routes>
          {/* Public routes */}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Protected routes with MainLayout */}
          <Route
            element={
              <ProtectedWrapper>
                <MainLayout />
              </ProtectedWrapper>
            }
          >
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Settings routes with SettingsLayout */}
            <Route
            // element={<SettingsLayout />}
            >
              {settingsRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<ProtectedWrapper>{route.element}</ProtectedWrapper>}
                />
              ))}
            </Route>
          </Route>

          {/* Other protected routes without MainLayout */}
          {otherProtectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedWrapper>{route.element}</ProtectedWrapper>}
            />
          ))}

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}
