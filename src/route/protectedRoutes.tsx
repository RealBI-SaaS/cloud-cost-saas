import HomeAuthenticated from "@/pages/main/HomeAuthenticated";
import Welcome from "@/pages/main/Welcome";
import { AppRoute } from "./types";
import Dashboard from "@/pages/dashboard";
import CostAnalysis from "@/pages/costAnalysis";

export const protectedRoutes: AppRoute[] = [
  { path: "/dashboard/", element: <HomeAuthenticated /> },
  { path: "/dashboard/:parentId", element: <HomeAuthenticated /> },
  { path: "/dashboard/:parentId/:subId", element: <HomeAuthenticated /> },
  { path: "/welcome", element: <Welcome /> },

  // { path: "/org/*", element: <HomeAuthenticated /> },
  { path: "/org/:orgId/dashboard", element: <Dashboard /> },
  { path: "/org/:orgId/cost-analysis", element: <CostAnalysis /> },
];
