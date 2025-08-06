import React from "react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const IntegrationSources: React.FC = () => {
  const handleGoogleIntegration = async () => {
    const client_id = import.meta.env.VITE_GOOGLE_DATA_CLIENT_ID;
    const state = crypto.randomUUID();
    localStorage.setItem("latestCSRFToken", state);

    const redirectUri = `${import.meta.env.VITE_BASE_URL}/data/google/callback/`;

    const params = new URLSearchParams({
      client_id,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/cloud-platform",
      ].join(" "),
      state,
      access_type: "offline",
      prompt: "consent",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <div className="flex flex-col items-start justify-start h-full p-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        Manage integrated sources and add new ones{" "}
      </h1>
      <div>
        <Button
          onClick={() => {
            handleGoogleIntegration();
          }}
          className="text-secondary bg-amber-300 p-5"
        >
          GOOGLE
        </Button>
      </div>
    </div>
  );
};

export default IntegrationSources;
