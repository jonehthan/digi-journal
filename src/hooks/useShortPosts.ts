import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useShortPosts() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("short_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching short posts:", error);
      else setPosts(data || []);
    }

    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  return posts;
}
