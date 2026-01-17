// App.tsx
import { useEffect, useState } from "react";
import { supabase, createProfileIfNotExists } from "./lib/supabase";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCallback, setIsCallback] = useState(false);
  
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${import.meta.env.VITE_SITE_URL}auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    // Check if we're on the callback route
    const hash = window.location.hash;
    if (hash.includes("access_token") || hash.includes("code")) {
      setIsCallback(true);
      return;
    }

    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await createProfileIfNotExists(session.user);
      }

      setLoading(false);
    }

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) setUser(session.user);
        else setUser(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (isCallback) {
    return <AuthCallback />;
  }

  if (loading) return <div>Loading...</div>;

  if (!user)
    return (
      <div style={{ padding: 40 }}>
        <h1>Digi Journal</h1>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    );

  return <Home user={user} onSignOut={signOut} />;
}

export default App;
