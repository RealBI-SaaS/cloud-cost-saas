import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AiChat from "./components/ai/ChatBot";
import { UserProvider } from "./context/UserContext";
import Login from "./components/login";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Account from "./components/Account";
import Logout from "./components/logout";
import "./index.css";
import { useUser } from "./context/UserContext";
import CreateCompany from "./components/CreateCompany";
import VerifyEmail from "./components/auth/VerifyEmail";
import AskEmailVerificatioin from "./components/auth/AskEmailVerification";
import AskForPasswordReset from "./components/auth/AskForPasswordReset";
import ResetPassword from "./components/auth/ResetPassword";
import ManageAll from "./components/ManageAll";
import OrganizationDetails from "./components/org/OrganizationDetails";
import AcceptInvitation from "./components/org/AcceptInvitation";
import { useLocation } from "react-router-dom";
import { OrganizationProvider } from "./context/OrganizationContext";
import NavigationManagement from "./components/org/NavigationsManagement";
import { MenuProvider } from "./context/MenuContext";
import OrganizationDetailsPage from "./components/OrganizationDetail";
import { Toaster } from "sonner";
import SettingsLayout from "./components/layout/SettingsLayout";
import MainLayout from "./components/layout/MainLayout";
import AccountInfo from "./components/account/AccountInfo";
import AccountPassword from "./components/account/AccountPassword";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <div className="grid grid-cols-1">
      {/* <MenuProvider> */}
        {/* <Nav /> */}
        {/* <AiChat /> */}
        <Toaster toastOptions={{ duration: 3000 }} />
        <div className="w-full   grid grid-cols-1   mx-auto ">
          <Routes>
            <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Navigate to="/home" />} />
            {/* setting pages with */}
            <Route element={<SettingsLayout />}>
              <Route
                path="/manage-all"
                element={
                  <ProtectedRoute>
                    <ManageAll />
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
                path="/create-company"
                element={
                  <ProtectedRoute>
                    <CreateCompany />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organization-detail"
                element={
                  <ProtectedRoute>
                    <OrganizationDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizations/:id"
                element={
                  <ProtectedRoute>
                    <OrganizationDetails />
                  </ProtectedRoute>
                }
              />
            </Route>

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
          </Routes>
        </div>
      {/* </MenuProvider> */}
    </div>
  );
}

export default App;
