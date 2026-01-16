import { useState, useRef } from "react";
import LongPostForm from "../components/LongPostForm";
import ShortPostForm from "../components/ShortPostForm";
import LongPostsFeed from "../components/LongPostsFeed";
import ShortPostsFeed from "../components/ShortPostsFeed";

interface HomeProps {
  user: any;
  onSignOut: () => void;
}

const Home = ({ user, onSignOut }: HomeProps) => {
  const [activeTab, setActiveTab] = useState<"long" | "short">("long");
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const feedRefLong = useRef<any>(null);
  const feedRefShort = useRef<any>(null);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-full flex justify-center">
        <div className="w-full" style={{ maxWidth: "900px" }}>
          {/* Header with tabs */}
          <div className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur border-b border-gray-700 px-6 py-4 z-10">
            <div className="flex items-center justify-between mb-4">
              {/* Profile - Left */}
              <div className="relative w-10">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:bg-gray-800 rounded-full p-2 transition"
                >
                  <img
                    src={user.user_metadata?.avatar_url || "https://via.placeholder.com/40"}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/40";
                    }}
                  />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 z-50">
                    <div className="flex flex-col items-center mb-4">
                      <img
                        src={user.user_metadata?.avatar_url || "https://via.placeholder.com/60"}
                        alt="profile"
                        className="w-16 h-16 rounded-full mb-3"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/60";
                        }}
                      />
                      <h2 className="text-lg font-bold text-center">{user.user_metadata?.full_name || "User"}</h2>
                      <p className="text-gray-400 text-sm text-center mt-1">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setShowProfileMenu(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Title - Center */}
              <h1 className="text-xl font-bold flex-1 text-center">Digi Journal</h1>

              {/* Refresh - Right */}
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-800 rounded-full transition w-10"
                title="Refresh feed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 1 1 9-9m.464 9H9m5.464 0a9 9 0 0 1-9-9" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-0 border-b border-gray-700">
              <button
                className={`flex-1 pb-4 px-4 font-semibold transition border-b-2 ${
                  activeTab === "long"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
                onClick={() => setActiveTab("long")}
              >
                Long-form
              </button>
              <button
                className={`flex-1 pb-4 px-4 font-semibold transition border-b-2 ${
                  activeTab === "short"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-gray-500 hover:text-white"
                }`}
                onClick={() => setActiveTab("short")}
              >
                Short-form
              </button>
            </div>
          </div>

          {/* New Post Button */}
          <div className="px-6 py-4 border-b border-gray-700">
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded transition"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close" : "+ New Post"}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800 bg-opacity-50">
              {activeTab === "long" ? (
                <LongPostForm user={user} />
              ) : (
                <ShortPostForm user={user} />
              )}
            </div>
          )}

          {/* Feed */}
          <div className="divide-y divide-gray-700" key={refreshKey}>
            {activeTab === "long" ? (
              <LongPostsFeed ref={feedRefLong} />
            ) : (
              <ShortPostsFeed ref={feedRefShort} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
