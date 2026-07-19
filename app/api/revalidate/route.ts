import { revalidatePath } from "next/cache";

// Webhook mínimo para disparar revalidación manual cuando cambie el contenido.
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/");

  return Response.json({
    ok: true,
    revalidated: ["/"],
    timestamp: new Date().toISOString(),
  });
}
