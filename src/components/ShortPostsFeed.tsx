import { useEffect, useState, forwardRef } from "react";
import { supabase } from "../lib/supabase";

interface ShortPost {
  id: string;
  author_id: string;
  content: string;
  type: string;
  link?: string;
  created_at: string;
}

const ShortPostsFeed = forwardRef(() => {
  const [posts, setPosts] = useState<ShortPost[]>([]);

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
        posts.map((post) => (
          <div key={post.id} className="border-b border-gray-700 last:border-b-0">
            <div className="px-6 py-4 hover:bg-gray-800 hover:bg-opacity-50 transition cursor-pointer">
              <p className="text-gray-200 mb-3">{post.content}</p>
              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline text-sm"
                >
                  {post.link}
                </a>
              )}
              <div className="mt-2">
                <small className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</small>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
});

ShortPostsFeed.displayName = "ShortPostsFeed";

export default ShortPostsFeed;
