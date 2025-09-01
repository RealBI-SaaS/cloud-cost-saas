import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import { Loading } from "@/components/misc/loading";

interface PublicWrapperProps {
  children: ReactNode;
}

export const PublicWrapper = ({ children }: PublicWrapperProps) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};
