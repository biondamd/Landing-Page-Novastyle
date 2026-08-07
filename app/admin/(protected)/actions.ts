"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SUPABASE_STORAGE_BUCKET, SUPABASE_URL } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function numberValue(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

function booleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

type VariantInput = { label: string; available: boolean; swatch?: string };

/** Lee el JSON de tallas/colores que serializa el VariantEditor del panel. */
function parseVariants(formData: FormData, key: string): VariantInput[] {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is { label: string; available?: boolean; swatch?: string } =>
          Boolean(item) && typeof (item as { label?: unknown }).label === "string",
      )
      .map((item) => ({
        label: item.label.trim(),
        available: item.available !== false,
        swatch: item.swatch ? String(item.swatch).trim() : undefined,
      }))
      .filter((item) => item.label.length > 0);
  } catch {
    return [];
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadFile(file: File, folder: string) {
  const supabase = await createClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadImage(formData: FormData, key: string, folder: string, fallback: string | null) {
  const file = formData.get(key);

  if (!(file instanceof File) || file.size === 0) return fallback;

  return uploadFile(file, folder);
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url || !SUPABASE_URL) return null;

  try {
    const parsed = new URL(url);
    const publicBase = new URL(SUPABASE_URL);
    const prefix = `/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;

    if (parsed.origin !== publicBase.origin || !parsed.pathname.startsWith(prefix)) return null;

    return decodeURIComponent(parsed.pathname.slice(prefix.length));
  } catch {
    return null;
  }
}

async function isImageReferenced(url: string) {
  const supabase = await createClient();
  const [{ data: collection }, { data: about }, { data: productImage }] = await Promise.all([
    supabase.from("collections").select("id").eq("image_url", url).limit(1).maybeSingle(),
    supabase.from("about_section").select("id").eq("image_url", url).limit(1).maybeSingle(),
    supabase.from("product_images").select("id").eq("image_url", url).limit(1).maybeSingle(),
  ]);

  return Boolean(collection || about || productImage);
}

async function deleteUnusedImage(url: string | null) {
  const path = storagePathFromPublicUrl(url);

  if (!path || !url) return;
  if (await isImageReferenced(url)) return;

  const supabase = await createClient();
  await supabase.storage.from(SUPABASE_STORAGE_BUCKET).remove([path]);
}

async function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveHeader(formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from("site_header")
    .upsert({ id: true, logo_text: text(formData, "logo_text"), status: text(formData, "status") });

  for (const href of ["#colecciones", "#catalogo", "#sobre-nosotras", "#contacto"]) {
    await supabase
      .from("header_links")
      .update({
        label: text(formData, `label:${href}`),
        display_order: numberValue(formData, `order:${href}`),
        active: booleanValue(formData, `active:${href}`),
      })
      .eq("href", href);
  }

  await revalidatePublic();
  redirect("/admin/cabecera?saved=1");
}

export async function saveHero(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("hero_section").upsert({
    id: true,
    badge_text: text(formData, "badge_text"),
    title_prefix: text(formData, "title_prefix"),
    title_emphasis: text(formData, "title_emphasis"),
    title_suffix: text(formData, "title_suffix"),
    description: text(formData, "description"),
    featured_product_id: numberValue(formData, "featured_product_id") || null,
    status: text(formData, "status"),
  });

  for (const id of formData.getAll("cta_id")) {
    await supabase
      .from("hero_ctas")
      .update({
        label: text(formData, `cta_label:${id}`),
        href: text(formData, `cta_href:${id}`),
        display_order: numberValue(formData, `cta_order:${id}`),
        active: booleanValue(formData, `cta_active:${id}`),
      })
      .eq("id", Number(id));
  }

  for (const id of formData.getAll("stat_id")) {
    await supabase
      .from("hero_stats")
      .update({
        value: text(formData, `stat_value:${id}`),
        label: text(formData, `stat_label:${id}`),
        display_order: numberValue(formData, `stat_order:${id}`),
        active: booleanValue(formData, `stat_active:${id}`),
      })
      .eq("id", Number(id));
  }

  await revalidatePublic();
  redirect("/admin/portada?saved=1");
}

export async function saveCategory(formData: FormData) {
  const supabase = await createClient();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const payload = {
    name,
    slug: slugify(name),
    display_order: numberValue(formData, "display_order"),
    status: text(formData, "status"),
  };

  if (id) await supabase.from("categories").update(payload).eq("id", Number(id));
  else await supabase.from("categories").insert(payload);

  await revalidatePublic();
  redirect(nullableText(formData, "redirect_to") ?? "/admin/categorias?saved=1");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient();
  const id = Number(text(formData, "id"));
  if (!id) redirect("/admin/categorias");

  // Una categoría con productos no se puede borrar (romperia la relación).
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    redirect(`/admin/categorias?error=${encodeURIComponent("Tiene productos asociados.")}`);
  }

  await supabase.from("categories").delete().eq("id", id);

  await revalidatePublic();
  redirect("/admin/categorias?deleted=1");
}

export async function saveTag(formData: FormData) {
  const supabase = await createClient();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const payload = {
    name,
    slug: slugify(name),
    display_order: numberValue(formData, "display_order"),
    status: text(formData, "status"),
  };

  if (id) await supabase.from("tags").update(payload).eq("id", Number(id));
  else await supabase.from("tags").insert(payload);

  await revalidatePublic();
  redirect(nullableText(formData, "redirect_to") ?? "/admin/productos?saved=1");
}

export async function saveCollection(formData: FormData) {
  const supabase = await createClient();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const previous =
    id
      ? await supabase.from("collections").select("image_url").eq("id", Number(id)).maybeSingle()
      : null;
  const image = await uploadImage(formData, "image", "colecciones", nullableText(formData, "image_url"));

  if (!image) throw new Error("Selecciona una imagen para la colección.");

  const payload = {
    name,
    slug: slugify(name),
    badge_label: text(formData, "badge_label"),
    description: text(formData, "description"),
    image_url: image,
    display_order: numberValue(formData, "display_order"),
    status: text(formData, "status"),
  };

  if (id) await supabase.from("collections").update(payload).eq("id", Number(id));
  else await supabase.from("collections").insert(payload);

  if (previous?.data?.image_url && previous.data.image_url !== image) {
    await deleteUnusedImage(previous.data.image_url);
  }

  await revalidatePublic();
  redirect(nullableText(formData, "redirect_to") ?? "/admin/colecciones?saved=1");
}

type ProductImagePayload = {
  id: number | null;
  key: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
};

async function productImagePayloads(formData: FormData, name: string) {
  const keys = formData.getAll("product_image_key").map(String);
  const primaryKey = text(formData, "product_image_primary");
  const payloads: ProductImagePayload[] = [];

  for (const [index, key] of keys.entries()) {
    const file = formData.get(`product_image_file:${key}`);
    const existingUrl = nullableText(formData, `product_image_url:${key}`);
    const imageUrl = file instanceof File && file.size > 0
      ? await uploadFile(file, "productos")
      : existingUrl;

    if (!imageUrl) continue;

    payloads.push({
      id: numberValue(formData, `product_image_id:${key}`) || null,
      key,
      imageUrl,
      displayOrder: numberValue(formData, `product_image_order:${key}`) || index + 1,
      isPrimary: key === primaryKey,
    });
  }

  if (!payloads.length) throw new Error("Selecciona al menos una imagen para el producto.");

  if (!payloads.some((payload) => payload.isPrimary)) {
    payloads[0].isPrimary = true;
  }

  return payloads.map((payload) => ({
    ...payload,
    alt: name,
  }));
}

export async function saveProduct(formData: FormData) {
  const supabase = await createClient();
  const id = text(formData, "id");
  const name = text(formData, "name");

  const payload = {
    name,
    slug: slugify(name),
    price: numberValue(formData, "price"),
    color: text(formData, "color"),
    description: nullableText(formData, "description"),
    sold_out: booleanValue(formData, "sold_out"),
    status: text(formData, "status"),
    category_id: numberValue(formData, "category_id"),
    collection_id: numberValue(formData, "collection_id") || null,
    tag_id: numberValue(formData, "tag_id") || null,
  };

  const result = id
    ? await supabase.from("products").update(payload).eq("id", Number(id)).select("id").single()
    : await supabase.from("products").insert(payload).select("id").single();

  if (result.error || !result.data) throw new Error(result.error?.message ?? "No se guardó producto.");

  const productId = Number(result.data.id);
  const [{ data: previousImages }, nextImages] = await Promise.all([
    supabase.from("product_images").select("id,image_url").eq("product_id", productId),
    productImagePayloads(formData, name),
  ]);
  const keptIds = nextImages
    .map((image) => image.id)
    .filter((id): id is number => Boolean(id));
  const removedImages = (previousImages ?? []).filter((image) => !keptIds.includes(Number(image.id)));

  if (removedImages.length) {
    await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId)
      .in("id", removedImages.map((image) => image.id));
  }

  await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);

  for (const image of nextImages) {
    const payload = {
      product_id: productId,
      image_url: image.imageUrl,
      alt: image.alt,
      display_order: image.displayOrder,
      is_primary: image.isPrimary,
    };

    if (image.id) {
      await supabase.from("product_images").update(payload).eq("id", image.id).eq("product_id", productId);
    } else {
      await supabase.from("product_images").insert(payload);
    }
  }

  await Promise.all(removedImages.map((image) => deleteUnusedImage(image.image_url)));

  // Variantes: se reemplazan por completo las del producto (borrar + insertar).
  const sizes = parseVariants(formData, "sizes");
  const colors = parseVariants(formData, "colors");

  await Promise.all([
    supabase.from("product_sizes").delete().eq("product_id", productId),
    supabase.from("product_colors").delete().eq("product_id", productId),
  ]);

  if (sizes.length) {
    await supabase.from("product_sizes").insert(
      sizes.map((size, index) => ({
        product_id: productId,
        label: size.label,
        available: size.available,
        display_order: index + 1,
      })),
    );
  }

  if (colors.length) {
    await supabase.from("product_colors").insert(
      colors.map((variant, index) => ({
        product_id: productId,
        label: variant.label,
        swatch: variant.swatch ?? null,
        available: variant.available,
        display_order: index + 1,
      })),
    );
  }

  await revalidatePublic();
  redirect("/admin/productos?saved=1");
}

export async function savePromotion(formData: FormData) {
  const supabase = await createClient();
  const id = text(formData, "id");
  const scope = text(formData, "scope");
  const targetId = numberValue(formData, `${scope}_target_id`);
  const payload = {
    name: text(formData, "name"),
    percentage: numberValue(formData, "percentage"),
    scope,
    starts_at: text(formData, "starts_at"),
    ends_at: text(formData, "ends_at"),
    status: text(formData, "status"),
  };

  const result = id
    ? await supabase.from("promotions").update(payload).eq("id", Number(id)).select("id").single()
    : await supabase.from("promotions").insert(payload).select("id").single();

  if (result.error || !result.data) throw new Error(result.error?.message ?? "No se guardó promoción.");

  const promotionId = Number(result.data.id);
  await Promise.all([
    supabase.from("promotion_products").delete().eq("promotion_id", promotionId),
    supabase.from("promotion_categories").delete().eq("promotion_id", promotionId),
    supabase.from("promotion_collections").delete().eq("promotion_id", promotionId),
  ]);

  if (scope === "product") {
    await supabase.from("promotion_products").insert({ promotion_id: promotionId, product_id: targetId });
  } else if (scope === "category") {
    await supabase.from("promotion_categories").insert({ promotion_id: promotionId, category_id: targetId });
  } else if (scope === "collection") {
    await supabase.from("promotion_collections").insert({ promotion_id: promotionId, collection_id: targetId });
  }

  await revalidatePublic();
  redirect("/admin/promociones?saved=1");
}

export async function deletePromotion(formData: FormData) {
  const supabase = await createClient();
  const id = Number(text(formData, "id"));
  if (!id) redirect("/admin/promociones");

  // Las tablas de alcance (promotion_products/…) tienen ON DELETE CASCADE.
  await supabase.from("promotions").delete().eq("id", id);

  await revalidatePublic();
  redirect("/admin/promociones?deleted=1");
}

export async function saveNewsletter(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("newsletter_section").upsert({
    id: true,
    badge_text: text(formData, "badge_text"),
    title: text(formData, "title"),
    description: text(formData, "description"),
    button_text: text(formData, "button_text"),
    privacy_note: text(formData, "privacy_note"),
    status: text(formData, "status"),
  });

  await revalidatePublic();
  redirect("/admin/comunidad?saved=1");
}

export async function saveAbout(formData: FormData) {
  const supabase = await createClient();
  const previous = await supabase.from("about_section").select("image_url").eq("id", true).maybeSingle();
  const image = await uploadImage(formData, "image", "secciones", nullableText(formData, "image_url"));

  if (!image) throw new Error("Selecciona una imagen para Nuestra historia.");

  await supabase.from("about_section").upsert({
    id: true,
    badge_text: text(formData, "badge_text"),
    title: text(formData, "title"),
    body: text(formData, "body"),
    image_url: image,
    floating_quote: text(formData, "floating_quote"),
    status: text(formData, "status"),
  });

  for (const id of formData.getAll("stat_id")) {
    await supabase
      .from("about_stats")
      .update({
        value: text(formData, `stat_value:${id}`),
        label: text(formData, `stat_label:${id}`),
        display_order: numberValue(formData, `stat_order:${id}`),
        active: booleanValue(formData, `stat_active:${id}`),
      })
      .eq("id", Number(id));
  }

  for (const id of formData.getAll("value_id")) {
    await supabase
      .from("about_values")
      .update({
        icon: text(formData, `value_icon:${id}`),
        title: text(formData, `value_title:${id}`),
        description: text(formData, `value_description:${id}`),
        display_order: numberValue(formData, `value_order:${id}`),
        active: booleanValue(formData, `value_active:${id}`),
      })
      .eq("id", Number(id));
  }

  if (previous.data?.image_url && previous.data.image_url !== image) {
    await deleteUnusedImage(previous.data.image_url);
  }

  await revalidatePublic();
  redirect("/admin/nuestra-historia?saved=1");
}

export async function saveFooter(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("footer_section").upsert({
    id: true,
    logo_text: text(formData, "logo_text"),
    description: text(formData, "description"),
    status: text(formData, "status"),
  });

  for (const id of formData.getAll("group_id")) {
    await supabase
      .from("footer_link_groups")
      .update({
        title: text(formData, `group_title:${id}`),
        display_order: numberValue(formData, `group_order:${id}`),
        active: booleanValue(formData, `group_active:${id}`),
      })
      .eq("id", Number(id));
  }

  for (const id of formData.getAll("link_id")) {
    await supabase
      .from("footer_links")
      .update({
        label: text(formData, `link_label:${id}`),
        href: nullableText(formData, `link_href:${id}`),
        display_order: numberValue(formData, `link_order:${id}`),
        active: booleanValue(formData, `link_active:${id}`),
      })
      .eq("id", Number(id));
  }

  for (const id of formData.getAll("social_id")) {
    await supabase
      .from("footer_social_links")
      .update({
        href: nullableText(formData, `social_href:${id}`),
        active: booleanValue(formData, `social_active:${id}`),
      })
      .eq("id", Number(id));
  }

  await revalidatePublic();
  redirect("/admin/pie-de-pagina?saved=1");
}
