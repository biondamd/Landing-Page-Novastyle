"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SUPABASE_STORAGE_BUCKET } from "@/lib/supabase/config";
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

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadImage(formData: FormData, key: string, folder: string, fallback: string | null) {
  const file = formData.get(key);

  if (!(file instanceof File) || file.size === 0) return fallback;

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
  const image = await uploadImage(formData, "image", "colecciones", nullableText(formData, "image_url"));
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

  await revalidatePublic();
  redirect(nullableText(formData, "redirect_to") ?? "/admin/colecciones?saved=1");
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
  const imageUrl = await uploadImage(formData, "image", "productos", nullableText(formData, "image_url"));

  if (imageUrl) {
    await supabase.from("product_images").delete().eq("product_id", productId).eq("is_primary", true);
    await supabase.from("product_images").insert({
      product_id: productId,
      image_url: imageUrl,
      alt: name,
      display_order: 1,
      is_primary: true,
    });
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
  const image = await uploadImage(formData, "image", "secciones", nullableText(formData, "image_url"));

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
