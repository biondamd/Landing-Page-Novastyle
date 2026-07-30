import { z } from "zod";

import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    return Response.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("subscribers")
    .upsert({ email: parsed.data.email, status: "active" }, { onConflict: "email" });

  if (error) {
    return Response.json({ ok: true });
  }

  return Response.json({ ok: true });
}
