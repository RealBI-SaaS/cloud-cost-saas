import AdminSignIn from "@/pages/admin/AdminSignIn";
import CreateCompanyForm from "@/pages/company/CreateCompanyForm";
import { AppRoute } from "./types";

export const otherProtectedRoutes: AppRoute[] = [
  { path: "/admin/signin", element: <AdminSignIn /> },
  { path: "/company/create", element: <CreateCompanyForm /> },
];
