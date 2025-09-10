import { Navigate } from "react-router-dom";
import { PublicWrapper } from "./PublicWrapper";
import Home from "@/pages/main/Home";
import Login from "@/pages/auth/login";
import Landing from "@/pages/main/Landing";
import Logout from "@/pages/auth/logout";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import AskEmailVerificatioin from "@/pages/auth/AskEmailVerification";
import AskForPasswordReset from "@/pages/auth/AskForPasswordReset";
import ResetPassword from "@/pages/auth/ResetPassword";
import AcceptInvitation from "@/pages/org/AcceptInvitation";
import { AppRoute } from "./types";
import VerifyLink from "@/pages/auth/passworLess/VerifyLink";
import PasswordLessRequest from "@/pages/auth/passworLess";

export const publicRoutes: AppRoute[] = [
  { path: "/home", element: <Home /> },
  { path: "/", element: <Navigate to="/home" /> },
  {
    path: "/login",
    element: (
      <PublicWrapper>
        <Login />
      </PublicWrapper>
    ),
  },
  {
    path: "/landing",
    element: (
      <PublicWrapper>
        <Landing />
      </PublicWrapper>
    ),
  },
  { path: "/logout", element: <Logout /> },
  { path: "/activate/:uid/:token", element: <VerifyEmail /> },
  { path: "/ask-email-verification", element: <AskEmailVerificatioin /> },
  { path: "/reset-password", element: <AskForPasswordReset /> },
  { path: "/password/reset/confirm/:uid/:token", element: <ResetPassword /> },
  { path: "/accept-invitation/:token", element: <AcceptInvitation /> },
  // password less route

  { path: "/login/password-less", element: <PasswordLessRequest /> },
  { path: "/magiclink-activation", element: <VerifyLink /> },
];
