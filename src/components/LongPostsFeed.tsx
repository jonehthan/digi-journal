import { useEffect, useState, forwardRef } from "react";
import { supabase } from "../lib/supabase";

interface LongPost {
  id: string;
  author_id: string;
  author_name?: string;
  title: string;
  content: string;
  created_at: string;
}

interface LongPostsFeedProps {
  currentUserId?: string;
}

const LongPostsFeed = forwardRef<any, LongPostsFeedProps>(({ currentUserId }, ref) => {
  const [posts, setPosts] = useState<LongPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("public:long_posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "long_posts" },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from<LongPost>("long_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPosts(data || []);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("long_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post");
    } else {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const handleEdit = (post: LongPost) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleSaveEdit = async (postId: string) => {
    const { error } = await supabase
      .from("long_posts")
      .update({ title: editTitle, content: editContent })
      .eq("id", postId);

    if (error) {
      console.error("Edit error:", error);
      alert("Failed to update post");
    } else {
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, title: editTitle, content: editContent }
          : p
      ));
      setEditingId(null);
    }
  };

  return (
    <>
      {posts.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-400">
          <p className="text-lg">No essays yet.</p>
          <p className="text-sm mt-2">Share your first thoughts</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border-b border-gray-800 last:border-b-0">
            <div className="px-4 py-5 hover:bg-gray-950 hover:bg-opacity-50 transition">
              {editingId === post.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 font-bold text-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 min-h-28 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSaveEdit(post.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-xl transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white mb-3 leading-tight">{post.title}</h2>
                  <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <small className="text-gray-500">
                        {post.author_name || "Unknown"} • {new Date(post.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    {currentUserId === post.author_id && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
});

LongPostsFeed.displayName = "LongPostsFeed";

export default LongPostsFeed;
