import { useState } from "react";
import { supabase } from "../lib/supabase";

interface LongPostFormProps {
  user: any;
}

const LongPostForm = ({ user }: LongPostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const authorName = user?.user_metadata?.full_name || user?.email || "Unknown";

    const { error } = await supabase.from("long_posts").insert([
      {
        author_id: user.id,
        author_name: authorName,
        title,
        content,
      },
    ]);

    if (error) console.error("Insert failed:", error);
    else {
      setTitle("");
      setContent("");
    }

    setLoading(false);
  };

  return (
    <form
      className="flex flex-col space-y-4 bg-gray-900 bg-opacity-60 p-5 rounded-2xl border border-gray-800"
      onSubmit={handleSubmit}
    >
      <input
        className="p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 text-white placeholder-gray-500 font-semibold"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 text-white placeholder-gray-500 min-h-32 resize-none"
        placeholder="Your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
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

export default LongPostForm;
