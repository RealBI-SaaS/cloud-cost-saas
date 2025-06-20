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
import CreateCompany from "./pages/company/CreateCompany";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AskEmailVerificatioin from "./pages/auth/AskEmailVerification";
import AskForPasswordReset from "./pages/auth/AskForPasswordReset";
import ResetPassword from "./pages/auth/ResetPassword";
//import ManageAll from "./components/ManageAll";
//import OrganizationDetails from "./components/org/OrganizationDetails";
import AcceptInvitation from "./pages/org/AcceptInvitation";
import { useLocation } from "react-router-dom";
//import { OrganizationProvider } from "./context/OrganizationContext";
import NavigationManagement from "@/pages/org/NavigationsManagement";
//import { MenuProvider } from "./context/MenuContext";
import OrganizationDetailsPage from "./pages/org/OrganizationDetail";
import { Toaster } from "sonner";
import SettingsLayout from "./layout/SettingsLayout";
import MainLayout from "./layout/MainLayout";
import AccountInfo from "./pages/user/AccountInfo";
import AccountPassword from "./pages/user/AccountPassword";
//import UserOrganization from "./components/org/UserOrganizations";
//import Organizations from "./components/Organizations";
//import OrganizationDetail from "./components/OrganizationDetail";
import OrganizationSettings from "./pages/org/OrganizationSettings";
import OrganizationMembers from "./pages/org/OrganizationMembers";
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
import { useOrgInitializer } from "./stores/OrgStore";
// import NavigationManagement from "./components/org/NavigationsManagement";
import useOrgStore from "./stores/OrgStore";
import NotFound from "./pages/misc/NotFound";
import { useThemeInitializer, useThemeStore } from "./stores/ThemeStore";
import { useEffect } from "react";
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const location = useLocation();
  const userComp = useOrgStore((state) => state.userComp);
  //const currentOrg = useOrgStore((state) => state.currentOrg);

  //const initializeTheme = useThemeStore((state) => state.initializeTheme);

  //if (userComp || currentOrg) {
  //await initializeTheme(userComp?.id || currentOrg?.id);
  //}

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
  const user = useUserStore((state) => state.user);
  // const userComp = useUserStore((state)=> state.userComp)

  const userComp = useOrgStore((state) => state.userComp);
  const initializeOrg = useOrgStore((state) => state.initialize);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  // console.log("usercomp", userComp)
  //const { loading } = useUser();
  //if (loading) return <Loading />; // or a full-screen spinner
  useEffect(() => {
    if (user) {
      // console.log("initializing org and theme");
      initializeOrg(); // Always call the hook
      if (currentOrg) {
        initializeTheme(currentOrg?.company);
      } else if (userComp) {
        // allow only dark and light
        // initializeTheme(userComp.id)
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // console.log("initializing org and theme");
      //initializeOrg(); // Always call the hook
      if (currentOrg) {
        initializeTheme(currentOrg?.company);
      }
    }
  }, [currentOrg]);

  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} position="top-center" />
      <div className="w-full   grid grid-cols-1   mx-auto bg-background">
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
                path="/settings/organization/list"
                element={
                  <ProtectedRoute>
                    <OrganizationSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/organization/members"
                element={
                  <ProtectedRoute>
                    <OrganizationMembers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings/organization/navigation"
                element={
                  <ProtectedRoute>
                    <NavigationManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/manage-all/navigations"
                element={
                  <ProtectedRoute>
                    <NavigationManagement />
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
                path="/settings/company/styles"
                element={
                  <ProtectedRoute>
                    <CompanyStyles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings/organization/detail"
                element={
                  <ProtectedRoute>
                    <OrganizationDetailsPage />
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
                <CreateCompany />
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
