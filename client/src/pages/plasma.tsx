import { useEffect } from "react";
import { useLocation } from "wouter";

// Redirect page for plasma.app/plasma to the current user profile
export default function PlasmaRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to alexchen's profile (current user)
    navigate("/alexchen");
  }, [navigate]);

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-plasma-blue mb-4">Redirecting...</h2>
        <p className="text-gray-400">Taking you to your profile...</p>
      </div>
    </div>
  );
}