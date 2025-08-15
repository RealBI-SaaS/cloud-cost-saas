import IntegrationSources from "@/pages/data/IntegrationSources";
import useCloudAccountsStore from "@/stores/CloudAccountStore";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
//import AiChat from "./components/ai/ChatBot";
//import { UserProvider } from "./context/UserContext";
import Login from "./pages/auth/login";
import Home from "./pages/main/Home";
//import Nav from "./components/Nav";
//import Account from "./components/Account";
import Logout from "./pages/auth/logout";
// import { useUser } from "./context/UserContext";
import CreateCompanyForm from "./pages/company/CreateCompanyForm";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AskEmailVerificatioin from "./pages/auth/AskEmailVerification";
import AskForPasswordReset from "./pages/auth/AskForPasswordReset";
import ResetPassword from "./pages/auth/ResetPassword";
//import ManageAll from "./components/ManageAll";
//import OrganizationDetails from "./components/org/OrganizationDetails";
import AcceptInvitation from "./pages/org/AcceptInvitation";
import { useLocation } from "react-router-dom";
//import { OrganizationProvider } from "./context/OrganizationContext";
// import NavigationManagement from "@/pages/org/NavigationsManagement";
//import { MenuProvider } from "./context/MenuContext";
// import OrganizationDetailsPage from "./pages/org/OrganizationDetail";
import { Toaster } from "sonner";
import SettingsLayout from "./layout/SettingsLayout";
import MainLayout from "./layout/MainLayout";
import AccountInfo from "./pages/user/AccountInfo";
import AccountPassword from "./pages/user/AccountPassword";
//import UserOrganization from "./components/org/UserOrganizations";
//import Organizations from "./components/Organizations";
//import OrganizationDetail from "./components/OrganizationDetail";
// import OrganizationSettings from "./pages/org/OrganizationSettings";
// import OrganizationMembers from "./pages/org/OrganizationMembers";
import DataIntegration from "./pages/data/DataIntegration";
import { GeneralSettings } from "./components/settings/GeneralSettings";
import { Loading } from "@/components/misc/loading";
import CompanyDetails from "./pages/company/CompanyDetail";
import AdminSignIn from "@/pages/admin/AdminSignIn";

import { AppSidebar } from "@/components/sidebars/app-sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Landing from "./pages/main/Landing";
import { CompanyStyles } from "./pages/company/CompanyStyles";
import Welcome from "./pages/main/Welcome";
import HomeAuthenticated from "./pages/main/HomeAuthenticated";
import useUserStore from "@/stores/userStore";
// import { useOrgInitializer } from "./stores/OrgStore";
// import NavigationManagement from "./components/org/NavigationsManagement";
// import useOrgStore from "./stores/OrgStore";
import NotFound from "./pages/misc/NotFound";
import CompanyMembers from "@/pages/company/CompanyMembers";
import { useThemeStore } from "@/stores/ThemeStore";
// import { useThemeInitializer, useThemeStore } from "./stores/ThemeStore";
import { useEffect, useState } from "react";
import useCompany from "@/stores/CompanyStore";
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const location = useLocation();
  const userComp = useCompany((state) => state.userComp);
  //const currentOrg = useOrgStore((state) => state.currentOrg);

  // const initializeTheme = useThemeStore((state) => state.initializeTheme);
  //
  // if (!userComp) {
  //   await initializeTheme(userComp?.id);
  // }

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login redirectTo={location.pathname} />;
  }

  // For admin users, only redirect to admin signin if they're not already there
  if (user.is_staff && !userComp) {
    return <AdminSignIn />;
  }

  return children;
};

// Auth Route component for non-authenticated users
const AuthRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const location = useLocation();

  if (loading) {
    // console.log("loading");
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const initializeCompany = useCompany((state) => state.initializeCompany);
  // const userComp = useUserStore((state)=> state.userComp)

  // const userComp = useOrgStore((state) => state.userComp);
  // const initializeOrg = useOrgStore((state) => state.initialize);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  const fetchAccounts = useCloudAccountsStore((state) => state.fetchAccounts);

  const userComp = useCompany((state) => state.userComp);
  const noUserComp = useCompany((state) => state.noUserComp);
  useEffect(() => {
    if (noUserComp && !location.pathname.startsWith("/accept-invitation")) {
      console.log("DFDDFDF");
      setOpen(true);
    }
  }, [noUserComp, location.pathname]);
  const onCreateCompany = () => {
    navigate("/settings/company/details");
  };
  // const currentOrg = useOrgStore((state) => state.currentOrg);
  // console.log("usercomp", userComp)
  //const { loading } = useUser();
  //if (loading) return <Loading />; // or a full-screen spinner
  useEffect(() => {
    if (user) {
      // console.log("initializing org and theme");
      // initializeOrg(); // Always call the hook
      initializeCompany();
      // if (currentOrg) {
      //   initializeTheme(currentOrg?.company);
      // console.log("comp", userComp);
      // if (userComp) {
      // allow only dark and light
      // console.log("theme initialized");
      // initializeTheme(userComp.id);
      // }
    }
  }, []);

  useEffect(() => {
    if (user) {
      // console.log("initializing org and theme");
      //initializeOrg(); // Always call the hook
      if (userComp) {
        console.log("comp", userComp);
        initializeTheme(userComp?.id);
        fetchAccounts(userComp?.id);
      }
    }
  }, [userComp]);

  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} position="top-center" />
      {/* create company warning */}
      <div className="w-full   grid grid-cols-1   mx-auto bg-background">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <DialogTitle className="text-lg font-semibold">
                  No Company Found
                </DialogTitle>
              </div>
              <DialogDescription>
                You are not currently part of any company. You can create a new
                company and invite team members, or contact your administrator
                to send you an invite.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                onClick={() => {
                  setOpen(false);
                  onCreateCompany();
                }}
              >
                Create Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* ----------------------- */}
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/landing"
            element={
              <AuthRoute>
                <Landing />
              </AuthRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="/activate/:uid/:token" element={<VerifyEmail />} />
          <Route
            path="/ask-email-verification"
            element={<AskEmailVerificatioin />}
          />
          <Route path="/reset-password" element={<AskForPasswordReset />} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/accept-invitation/:token"
            element={<AcceptInvitation />}
          />

          {/* Protected routes with MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard/" element={<HomeAuthenticated />} />
            <Route
              path="/dashboard/:parentId"
              element={<HomeAuthenticated />}
            />
            <Route
              path="/dashboard/:parentId/:subId"
              element={<HomeAuthenticated />}
            />

            {/* Setting pages */}
            <Route element={<SettingsLayout />}>
              <Route
                path="/settings/organization/members"
                element={
                  <ProtectedRoute>
                    <CompanyMembers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings/account/info"
                element={
                  <ProtectedRoute>
                    <AccountInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/account/password"
                element={
                  <ProtectedRoute>
                    <AccountPassword />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings/general/preferences"
                element={
                  <ProtectedRoute>
                    <GeneralSettings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings/company/details"
                element={
                  <ProtectedRoute>
                    <CompanyDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings/organization/data"
                element={
                  <ProtectedRoute>
                    <DataIntegration />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/welcome" element={<Welcome />} />
          </Route>

          {/* Other protected routes without MainLayout */}
          <Route
            path="/admin/signin"
            element={
              <ProtectedRoute>
                <AdminSignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/create"
            element={
              <ProtectedRoute>
                <CreateCompanyForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
