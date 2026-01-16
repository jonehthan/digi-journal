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

    const { error } = await supabase.from("short_posts").insert([
      {
        author_id: user.id,
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
      className="flex flex-col space-y-2 bg-gray-800 p-4 rounded shadow-md"
      onSubmit={handleSubmit}
    >
      <textarea
        className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
      />
      <input
        className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Link (optional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default ShortPostForm;
