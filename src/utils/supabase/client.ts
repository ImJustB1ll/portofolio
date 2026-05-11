import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

export const createClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Fatal: Supabase URL or Publishable Key is missing in browser environment.");
    }

    return createBrowserClient<Database>(supabaseUrl, supabaseKey);
};