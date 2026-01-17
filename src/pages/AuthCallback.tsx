import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthCallbackProps {
  onCallbackComplete: (complete: boolean) => void;
}

export default function AuthCallback({ onCallbackComplete }: AuthCallbackProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically handles the hash params
        // Just need to get the session after redirect
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          setTimeout(() => {
            // Clean the URL and mark as complete
            window.location.hash = "";
            onCallbackComplete(true);
          }, 2000);
          return;
        }

        if (session) {
          // Session established successfully
          // Clean the URL and mark as complete to trigger re-render
          window.location.hash = "";
          onCallbackComplete(true);
        } else {
          setError("No session found");
          setTimeout(() => {
            window.location.hash = "";
            onCallbackComplete(true);
          }, 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setTimeout(() => {
          window.location.hash = "";
          onCallbackComplete(true);
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [onCallbackComplete]);

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
