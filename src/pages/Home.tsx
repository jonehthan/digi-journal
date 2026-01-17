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
    <div className="flex min-h-screen bg-black text-white">
      <div className="w-full flex justify-center">
        <div className="w-full" style={{ maxWidth: "600px" }}>
          {/* Header */}
          <div className="sticky top-0 bg-black bg-opacity-95 backdrop-blur-md border-b border-gray-800 px-4 py-3 z-10">
            <div className="flex items-center justify-between mb-5">
              {/* Profile - Left */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 hover:opacity-80 transition active:scale-95"
                >
                  <img
                    src={user?.user_metadata?.avatar_url || user?.picture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                    }}
                  />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute left-0 mt-3 w-72 bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-800 z-50">
                    <div className="flex flex-col items-center mb-6">
                      <img
                        src={user?.user_metadata?.avatar_url || user?.picture || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"}
                        alt="profile"
                        className="w-20 h-20 rounded-full mb-4 border-2 border-gray-700"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                        }}
                      />
                      <h2 className="text-lg font-semibold text-center">{user?.user_metadata?.full_name || user?.name || "User"}</h2>
                      <p className="text-gray-400 text-sm text-center mt-2">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setShowProfileMenu(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-xl transition active:scale-95"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Title - Center */}
              <h1 className="text-2xl font-bold flex-1 text-center">Digi Journal</h1>

              {/* Refresh - Right */}
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-900 rounded-full transition active:scale-90 w-10 h-10 flex items-center justify-center"
                title="Refresh feed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-800">
              <button
                className={`pb-3 font-semibold transition text-sm tracking-tight ${
                  activeTab === "long"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-200 border-b-2 border-transparent"
                }`}
                onClick={() => setActiveTab("long")}
              >
                Essays
              </button>
              <button
                className={`pb-3 font-semibold transition text-sm tracking-tight ${
                  activeTab === "short"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-200 border-b-2 border-transparent"
                }`}
                onClick={() => setActiveTab("short")}
              >
                Notes
              </button>
            </div>
          </div>

          {/* New Post Button */}
          <div className="px-4 py-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-2xl transition active:scale-95 shadow-lg"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "Compose"}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="px-4 py-4 bg-gray-950 bg-opacity-50">
              {activeTab === "long" ? (
                <LongPostForm user={user} />
              ) : (
                <ShortPostForm user={user} />
              )}
            </div>
          )}

          {/* Feed */}
          <div key={refreshKey}>
            {activeTab === "long" ? (
              <LongPostsFeed ref={feedRefLong} currentUserId={user?.id} />
            ) : (
              <ShortPostsFeed ref={feedRefShort} currentUserId={user?.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
