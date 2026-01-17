// App.tsx
import { useEffect, useState } from "react";
import { supabase, createProfileIfNotExists } from "./lib/supabase";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCallback, setIsCallback] = useState(false);
  const [callbackComplete, setCallbackComplete] = useState(false);
  
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
    // Check if we're on the callback route and callback isn't complete yet
    const pathname = window.location.pathname;
    if ((pathname.includes("auth/callback") || window.location.hash.includes("access_token")) && !callbackComplete) {
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
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          createProfileIfNotExists(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [callbackComplete]);

  if (isCallback && !callbackComplete) {
    return <AuthCallback onCallbackComplete={setCallbackComplete} />;
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-4xl font-bold mb-4">Digi Journal</h1>
          <p className="text-gray-400 mb-8 text-lg">Your private space for thoughts and ideas</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-white text-black font-semibold py-4 px-6 rounded-2xl hover:bg-gray-100 transition active:scale-95 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );

  return <Home user={user} onSignOut={signOut} />;
}

export default App;
