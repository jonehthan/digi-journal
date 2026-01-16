import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useLongPosts() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("long_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching long posts:", error);
      else setPosts(data || []);
    }

    fetchPosts();

    // Polling every 5s for simplicity (free plan cannot use realtime)
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  return posts;
}
