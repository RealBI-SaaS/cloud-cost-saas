import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { validatePassword } from "../utils/auth/password_validate";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo_only from "/logo-only.png";
import useUserStore from "@/context/userStore";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  //const { error, setError, login, signup, user } = useUser();
  const user = useUserStore((state) => 
    state.user
  );
  const error = useUserStore((state) => 
    state.error
  );
  const setError = useUserStore((state) => 
    state.setError
  );
  const login = useUserStore((state) => 
    state.login
  );
  const signup = useUserStore((state) => 
    state.signup
  );
  const loading = useUserStore((state) => 
    state.loading
  );
  const setLoading = useUserStore((state) => 
    state.setLoading
  );

  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  //
  //useEffect(() => {
  //  if (redirectToAdmin) {
  //    navigate("/admin/signup", { replace: true });
  //  }
  //}, [redirectToAdmin, navigate]);
  //
  //useEffect(() => {
  //  if (user) {
  //    navigate("/home");
  //  }
  //}, [user]);
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }
        await signup(formData);
        navigate("/ask-email-verification", {
          state: { user_email: formData.email },
        });
      } else {
        const myUser = await login(formData.email, formData.password);
        console.log(myUser);
        if (myUser.is_staff) {
          console.log("Admin");
          navigate("/admin/signin", { replace: true });
          //setRedirectToAdmin(true);
          return; // Stop here to avoid navigating twice
        }
        const from = location.state?.from?.pathname || "/home";
        navigate(from, { replace: true });
      }
    } catch (error) {
      // if (err?.status == 401){
      //   toast("hi", {
      //     title: "Error",
      //     description:
      //       err?.response?.data?.message ||
      //       "An error occurred during login, try again or another account",
      //   });
      // }
      console.log(error);
      //toast.error()
      toast.error(
        error?.response?.data?.detail ||
        "An error occurred, try again or another account",
      );
      toast.error(error?.response?.data?.password[0]);
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const state = crypto.randomUUID(16).toString("hex");
    localStorage.setItem("latestCSRFToken", state);

    const redirectUri = `${import.meta.env.VITE_BASE_URL}/myauth/google/oauth2/callback/`;
    const scope = "email profile";

    const link =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${client_id}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = link;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  justify-center align-center gap-6 max-w-md mx-auto ">
      <img src={logo_only} alt="logo" className=" h-20 object-contain " />
      <Card className="w-100 ">
        <CardHeader>
          <CardTitle>
            {isSignUp ? "Create an account" : "Login to your account"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your information below to create your account"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {isSignUp && (
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="icon"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  
                  {showPassword ? (
                    <EyeClosed className="h-4 w-4 " />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* {error && <p className="text-sm text-red-500">{error}</p>} */}

            <Button type="submit" disabled={loading} className="!text-white">
              {loading
                ? isSignUp
                  ? "Signing up..."
                  : "Signing in..."
                : isSignUp
                  ? "Sign Up"
                  : "Sign In"}
            </Button>
            <Button
              variant="link"
              className="text-sm !text-gray-700"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {!isSignUp && (
        <Button
          onClick={() => {
            navigate("/reset-password");
          }}
          variant="link"
          className="text-sm !text-gray-700"
        >
          <p className="cursor-pointer">Forgot password?</p>
        </Button>
      )}
    </div>
  );
};

export default Login;
