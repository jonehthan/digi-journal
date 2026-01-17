import { useState } from "react";
import { supabase } from "../lib/supabase";

interface ShortPostFormProps {
  user: any;
}

const ShortPostForm = ({ user }: ShortPostFormProps) => {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const authorName = user?.user_metadata?.full_name || user?.email || "Unknown";

    const { error } = await supabase.from("short_posts").insert([
      {
        author_id: user.id,
        author_name: authorName,
        content,
        link: link || null,
        type: "short",
      },
    ]);

    if (error) console.error("Insert failed:", error);
    else {
      setContent("");
      setLink("");
    }

    setLoading(false);
  };

  return (
    <form
      className="flex flex-col space-y-4 bg-gray-900 bg-opacity-60 p-5 rounded-2xl border border-gray-800"
      onSubmit={handleSubmit}
    >
      <textarea
        className="p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 text-white placeholder-gray-500 min-h-28 resize-none"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
      />
      <input
        className="p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 text-white placeholder-gray-500"
        placeholder="Add a link (optional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-500 transition disabled:opacity-50 font-semibold active:scale-95"
        disabled={loading}
      >
        {loading ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
};

export default ShortPostForm;
