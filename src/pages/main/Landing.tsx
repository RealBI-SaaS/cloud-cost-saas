import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">New Platform Features</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            Transform Your Workflow
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience seamless collaboration with our AI-powered platform.
            Connect, create, and achieve more together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
