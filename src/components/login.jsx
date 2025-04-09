import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { validatePassword } from "../utils/auth/password_validate";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  // const [error, setError] = useState('');
  const { error, setError } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useUser();

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
        const response = await signup(formData);
        // After successful signup, login automatically

        //await login(formData.email, formData.password);
        navigate("/ask-email-verification", {
          state: { user_email: formData.email },
        });
      } else {
        await login(formData.email, formData.password);
        const from = location.state?.from?.pathname || "/home";
        //console.log(location, location.state, from);
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.log(err?.response?.data);
      //setError(err?.response?.data);
      // error message already set in context
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
    <div className="signin-container rounded-md p-4 m-10 flex flex-col justify-center gap-4 items-center">
      <p className="text-2xl font-bold">{isSignUp ? "Sign Up" : "Login"}</p>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className=" w-100 border border-black rounded-md p-2 flex flex-row items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
      >
        <FcGoogle size={32} />
        Sign in with Google
      </button>
      <div className="or-txt w-100">
        <span>or</span>
      </div>
      <div className="signin-container rounded-md py-4 bg-gray-100 w-100">
        <form
          onSubmit={handleSubmit}
          className="signin-form rounded-md flex flex-col gap-4"
        >
          {isSignUp && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="form-input border border-black rounded-sm p-2 w-full mx-0"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="form-input border border-black rounded-sm p-2 w-full mx-0"
                  required
                />
              </div>
            </>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
              className="form-input border border-black rounded-sm p-2 w-full mx-0"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="form-input border border-black rounded-sm p-2 w-full"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className=" border border-indigo-500 p-2 rounded-md bg-indigo-500 hover:bg-indigo-400 shadow-md"
          >
            {loading
              ? isSignUp
                ? "Signing up..."
                : "Signing in..."
              : isSignUp
                ? "Sign Up"
                : "Sign In"}
          </button>
        </form>
        {!isSignUp && (
          <a
            href="/reset-password"
            className="text-sm mt-2 text-muted hover:underline"
          >
            Forgot password?
          </a>
        )}
      </div>
      <div className="">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm mt-2 text-muted hover:underline"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>

      <Button>Button</Button>
    </div>
  );
};

export default Login;
