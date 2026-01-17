import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          setTimeout(() => {
            window.location.hash = "";
            window.location.pathname = "/digi-journal/";
          }, 3000);
          return;
        }

        if (session) {
          // Session established successfully, redirect to home
          window.location.hash = "";
          window.location.pathname = "/digi-journal/";
        } else {
          setError("No session found");
          setTimeout(() => {
            window.location.hash = "";
            window.location.pathname = "/digi-journal/";
          }, 3000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setTimeout(() => {
          window.location.hash = "";
          window.location.pathname = "/digi-journal/";
        }, 3000);
      }
    };

    handleAuthCallback();
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Completing sign in...</h2>
      <p>Please wait while we authenticate you.</p>
    </div>
  );
}
