import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import useCompany from "@/stores/CompanyStore";
import { Loading } from "@/components/misc/loading";
import Login from "@/pages/auth/Login";
import AdminSignIn from "@/pages/admin/AdminSignIn";

interface ProtectedWrapperProps {
  children: ReactNode;
}

export const ProtectedWrapper = ({ children }: ProtectedWrapperProps) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const location = useLocation();
  const userComp = useCompany((state) => state.userComp);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login redirectTo={location.pathname} />;
  }

  if (user.is_staff && !userComp) {
    return <AdminSignIn />;
  }

  return children;
};
