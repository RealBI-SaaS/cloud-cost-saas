import HomeAuthenticated from "@/pages/main/HomeAuthenticated";
import Welcome from "@/pages/main/Welcome";
import { AppRoute } from "./types";
import Dashboard from "@/pages/dashboard";
import CostAnalysis from "@/pages/costAnalysis";

export const protectedRoutes: AppRoute[] = [
  // { path: "/dashboard/", element: <HomeAuthenticated /> },
  // { path: "/dashboard/:parentId", element: <HomeAuthenticated /> },
  // { path: "/dashboard/:parentId/:subId", element: <HomeAuthenticated /> },
  { path: "/welcome", element: <Welcome /> },

  //Todo selected org will be provided via context
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/cost-analysis", element: <CostAnalysis /> },
];
