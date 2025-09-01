import CompanyMembers from "@/pages/company/CompanyMembers";
import AccountInfo from "@/pages/user/AccountInfo";
import AccountPassword from "@/pages/user/AccountPassword";
import { GeneralSettings } from "@/components/settings_deprecated/GeneralSettings";
import CompanyDetails from "@/pages/company/CompanyDetail";
import DataIntegration from "@/pages/data/DataIntegration";
import { AppRoute } from "./types";
import Profile from "@/pages/user/profile";
import ProfilePage from "@/pages/user/ProfilePage";
import Settings from "@/pages/setting";

export const settingsRoutes: AppRoute[] = [
  { path: "/settings/organization/members", element: <CompanyMembers /> },
  // { path: "/settings/account/info", element: <AccountInfo /> },
  // { path: "/settings/account/password", element: <AccountPassword /> },
  // { path: "/settings/general/preferences", element: <GeneralSettings /> },
  { path: "/settings/company/details", element: <CompanyDetails /> },
  { path: "/settings/organization/data", element: <DataIntegration /> },
  // personal account
  { path: "/account/me", element: <ProfilePage /> },
  { path: "/settings", element: <Settings /> },
];
