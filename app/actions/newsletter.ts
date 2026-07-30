"use server";

import { z } from "zod";

import { StrapiHttpError, strapiPost } from "@/lib/strapi";

const schema = z.object({
  email: z.email("Ingresa un correo válido, por ejemplo hola@correo.com."),
});

export type NewsletterActionState = {
  ok: boolean;
  message: string;
};

const initialState: NewsletterActionState = {
  ok: false,
  message: "",
};

export { initialState as initialNewsletterState };

function isDuplicateEmailError(error: unknown): boolean {
  if (!(error instanceof StrapiHttpError)) return false;
  const body = JSON.stringify(error.body).toLowerCase();
  return error.status === 400 && (body.includes("unique") || body.includes("email"));
}

export async function subscribeNewsletter(
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Ingresa un correo válido.",
    };
  }

  try {
    await strapiPost("/api/suscriptors", {
      data: {
        email: parsed.data.email,
      },
    });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return {
        ok: false,
        message: "Ese correo ya está suscrito a la comunidad.",
      };
    }
    throw error;
  }

  return {
    ok: true,
    message: "¡Bienvenida a la comunidad! Pronto tendrás novedades.",
  };
}
