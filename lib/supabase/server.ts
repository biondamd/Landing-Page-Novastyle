import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

export async function createClient() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Puede ejecutarse desde Server Components, donde no se permite setear cookies.
        }
      },
    },
  });
}
