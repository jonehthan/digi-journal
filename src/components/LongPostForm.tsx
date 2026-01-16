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

    const { error } = await supabase.from("long_posts").insert([
      {
        author_id: user.id,
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
      className="flex flex-col space-y-2 bg-gray-800 p-4 rounded shadow-md"
      onSubmit={handleSubmit}
    >
      <input
        className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
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

export default LongPostForm;
