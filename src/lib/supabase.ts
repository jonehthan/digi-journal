// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

// Helper to ensure profile exists
export async function createProfileIfNotExists(user: any) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    await supabase.from("profiles").insert({
      user_id: user.id,
      email: user.email,
      created_at: new Date(),
    });
  }
}
