import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!URL || !API_KEY) {
  throw new Error("Missing Supabase environment variables.");
}

const options = {};

if (import.meta.env.SSR) {
  const { default: ws } = await import("ws");
  options.realtime = {
    transport: ws,
  };
}

export const supabase = createClient(URL, API_KEY, options);
