import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
//import AiChat from "./components/ai/ChatBot";
//import { UserProvider } from "./context/UserContext";
import Login from "./components/login";
import Home from "./components/Home";
//import Nav from "./components/Nav";
//import Account from "./components/Account";
import Logout from "./components/logout";
import { useUser } from "./context/UserContext";
import CreateCompany from "./components/company/CreateCompany";
import VerifyEmail from "./components/auth/VerifyEmail";
import AskEmailVerificatioin from "./components/auth/AskEmailVerification";
import AskForPasswordReset from "./components/auth/AskForPasswordReset";
import ResetPassword from "./components/auth/ResetPassword";
//import ManageAll from "./components/ManageAll";
//import OrganizationDetails from "./components/org/OrganizationDetails";
import AcceptInvitation from "./components/org/AcceptInvitation";
import { useLocation } from "react-router-dom";
//import { OrganizationProvider } from "./context/OrganizationContext";
import NavigationManagement from "./components/org/NavigationsManagement";
//import { MenuProvider } from "./context/MenuContext";
import OrganizationDetailsPage from "./components/OrganizationDetail";
import { Toaster } from "sonner";
import SettingsLayout from "./components/layout/SettingsLayout";
import MainLayout from "./components/layout/MainLayout";
import AccountInfo from "./components/account/AccountInfo";
import AccountPassword from "./components/account/AccountPassword";
//import UserOrganization from "./components/org/UserOrganizations";
//import Organizations from "./components/Organizations";
//import OrganizationDetail from "./components/OrganizationDetail";
import OrganizationSettings from "./components/OrganizationSettings";
import OrganizationMembers from "./components/org/OrganizationMembers";
import DataIntegration from "./components/data/DataIntegration";
import { GeneralSettings } from "./components/settings/GeneralSettings";
import { Loading } from "@/misc/loading";
import CompanyDetails from "./components/company/CompanyDetail";
import AdminSignIn from "@/components/admin/AdminSignIn";

import { AppSidebar } from "@/components/app-sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Landing from "./components/Landing";
import { CompanyStyles } from "./components/company/CompanyStyles";
import Welcome from "./components/Welcome";
import HomeAuthenticated from "./components/HomeAuthenticated";
import useUserStore from "@/context/userStore";
import { useOrgInitializer } from "./context/OrgStore";
// import NavigationManagement from "./components/org/NavigationsManagement";
import useOrgStore from "./context/OrgStore";
import NotFound from "./components/pages/NotFound";
import { useThemeInitializer, useThemeStore } from "./context/ThemeStore";
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
  console.log("usercomp", userComp)
  //const { loading } = useUser();
  //if (loading) return <Loading />; // or a full-screen spinner
  useEffect(() => {
    if (user) {
      console.log("initializing org and theme");
      initializeOrg(); // Always call the hook
      if (currentOrg) {
        initializeTheme(currentOrg?.company);
      }else if(userComp){
        initializeTheme(userComp.id)
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
      <Toaster toastOptions={{ duration: 3000 }} position='top-center' />
      <div className="w-full   grid grid-cols-1   mx-auto">
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
