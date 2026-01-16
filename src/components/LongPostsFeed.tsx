import { useEffect, useState, forwardRef } from "react";
import { supabase } from "../lib/supabase";

interface LongPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
}

const LongPostsFeed = forwardRef(() => {
  const [posts, setPosts] = useState<LongPost[]>([]);

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

    if (error) console.error(error);
    else setPosts(data || []);
  };

  return (
    <>
      {posts.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-400">
          No posts yet. Be the first to share!
        </div>
      ) : (
        posts.map((post, idx) => (
          <div key={post.id} className="border-b border-gray-700 last:border-b-0">
            <div className="px-6 py-4 hover:bg-gray-800 hover:bg-opacity-50 transition cursor-pointer">
              <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
              <p className="text-gray-300 mb-3 line-clamp-3">{post.content}</p>
              <small className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</small>
            </div>
          </div>
        ))
      )}
    </>
  );
});

LongPostsFeed.displayName = "LongPostsFeed";

export default LongPostsFeed;
