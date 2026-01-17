import { useEffect, useState, forwardRef } from "react";
import { supabase } from "../lib/supabase";

interface ShortPost {
  id: string;
  author_id: string;
  author_name?: string;
  content: string;
  type: string;
  link?: string;
  created_at: string;
}

interface ShortPostsFeedProps {
  currentUserId?: string;
}

const ShortPostsFeed = forwardRef<any, ShortPostsFeedProps>(({ currentUserId }, ref) => {
  const [posts, setPosts] = useState<ShortPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editLink, setEditLink] = useState("");

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("public:short_posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "short_posts" },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from<ShortPost>("short_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPosts(data || []);
    }
  };

  const fetchAuthorNames = async (authorIds: string[]) => {
    const uniqueIds = [...new Set(authorIds)];
    const names: { [key: string]: string } = {};

    for (const id of uniqueIds) {
      const { data: { user }, error } = await supabase.auth.admin.getUserById(id);
      if (!error && user) {
        names[id] = user.user_metadata?.full_name || user.email || "Unknown";
      }
    }
    setAuthorNames(names);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("short_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post");
    } else {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const handleEdit = (post: ShortPost) => {
    setEditingId(post.id);
    setEditContent(post.content);
    setEditLink(post.link || "");
  };

  const handleSaveEdit = async (postId: string) => {
    const { error } = await supabase
      .from("short_posts")
      .update({ content: editContent, link: editLink || null })
      .eq("id", postId);

    if (error) {
      console.error("Edit error:", error);
      alert("Failed to update post");
    } else {
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, content: editContent, link: editLink || undefined }
          : p
      ));
      setEditingId(null);
    }
  };

  return (
    <>
      {posts.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-400">
          <p className="text-lg">No notes yet.</p>
          <p className="text-sm mt-2">Share your first thought</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border-b border-gray-800 last:border-b-0">
            <div className="px-4 py-5 hover:bg-gray-950 hover:bg-opacity-50 transition">
              {editingId === post.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 min-h-24 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <input
                    type="text"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    placeholder="Link (optional)"
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
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
                  <p className="text-gray-200 mb-3 leading-relaxed">{post.content}</p>
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm block mb-3 truncate transition"
                    >
                      {post.link}
                    </a>
                  )}
                  <div className="flex items-center justify-between">
                    <small className="text-gray-500">
                      {post.author_name || "Unknown"} • {new Date(post.created_at).toLocaleDateString()}
                    </small>
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

ShortPostsFeed.displayName = "ShortPostsFeed";

export default ShortPostsFeed;
