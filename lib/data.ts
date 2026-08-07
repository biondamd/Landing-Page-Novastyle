import {
  ABOUT_CONTENT,
  COLLECTIONS,
  FOOTER_CONTENT,
  HEADER_CONTENT,
  HERO_CONTENT,
  PRODUCTS,
  NEWSLETTER_CONTENT,
} from "./mock-data";
import { hasSupabaseConfig } from "./supabase/config";
import { createClient } from "./supabase/server";
import type {
  AboutContent,
  Collection,
  FooterContent,
  HeaderContent,
  HeroContent,
  NewsletterContent,
  Product,
} from "./types";

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  discounted_price: number | string | null;
  color: string;
  description: string | null;
  sold_out: boolean;
  category_name: string;
  category_slug: string;
  collection_id: number | null;
  collection_slug: string | null;
  tag_name: string | null;
  image_url: string | null;
  // Arrays JSON que aporta la vista (ausentes hasta aplicar la migración de variantes).
  sizes?: { label: string; available: boolean }[] | null;
  colors?: { label: string; available: boolean; swatch: string | null }[] | null;
};

type CollectionRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  badge_label: string;
  image_url: string;
  item_count: number;
};

function numberValue(value: number | string | null): number | null {
  if (value === null) return null;
  return typeof value === "number" ? value : Number(value);
}

function mapProduct(row: ProductRow): Product {
  const price = numberValue(row.price) ?? 0;
  const discounted = numberValue(row.discounted_price);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: discounted ?? price,
    originalPrice: discounted ? price : null,
    discountedPrice: discounted,
    category: row.category_name,
    categorySlug: row.category_slug,
    collectionId: row.collection_id,
    collectionSlug: row.collection_slug,
    color: row.color,
    image: row.image_url ?? "/images/productos/vestido-carmesi.jpg",
    description: row.description,
    // La vista devuelve variantes como arrays JSON. Si la migración aún no se
    // aplicó, la columna no existe (undefined) y withVariants recurre al mock.
    sizes: row.sizes
      ? row.sizes.map((size) => ({ label: size.label, available: size.available }))
      : undefined,
    colors: row.colors
      ? row.colors.map((c) => ({
          label: c.label,
          available: c.available,
          swatch: c.swatch ?? undefined,
        }))
      : undefined,
    tag: row.tag_name,
    sold: row.sold_out,
    published: true,
  };
}

function mapCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    tag: row.badge_label,
    image: row.image_url,
    itemCount: row.item_count,
  };
}

async function withFallback<T>(fallback: T, query: () => Promise<T>): Promise<T> {
  if (!hasSupabaseConfig()) return fallback;

  try {
    return await query();
  } catch {
    return fallback;
  }
}

// Respaldo de variantes por si la migración de tallas/colores aún no se aplicó:
// mientras la vista no devuelva esas columnas, la ficha de detalle usa las del
// mock, emparejadas por id. Con la migración aplicada, la vista manda y esto no
// interviene (así las ediciones del panel se reflejan en la landing).
const VARIANTS_BY_ID = new Map(
  PRODUCTS.map((product) => [product.id, { sizes: product.sizes, colors: product.colors }]),
);

function withVariants(product: Product): Product {
  // Si la vista ya trajo variantes (aunque sean listas vacías), se respetan.
  if (product.sizes !== undefined || product.colors !== undefined) return product;
  const variants = VARIANTS_BY_ID.get(product.id);
  return variants ? { ...product, sizes: variants.sizes, colors: variants.colors } : product;
}

export async function getProducts(): Promise<Product[]> {
  return withFallback(PRODUCTS, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_products_view")
      .select("*")
      .order("id", { ascending: true });

    if (error || !data) return PRODUCTS;
    return (data as ProductRow[]).map(mapProduct).map(withVariants);
  });
}

export async function getFeaturedProduct(): Promise<Product> {
  const [hero, products] = await Promise.all([getHeroContent(), getProducts()]);
  const featuredId = hero.featuredProductId ?? HERO_CONTENT.featuredProductId;
  const featured = products.find((product) => product.id === featuredId) ?? products[0];

  if (!featured) {
    throw new Error("No existe producto destacado para la portada.");
  }

  return featured;
}

export async function getCollections(): Promise<Collection[]> {
  return withFallback(COLLECTIONS, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_collections_view")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data) return COLLECTIONS;
    return (data as CollectionRow[]).map(mapCollection);
  });
}

export async function getCategories(): Promise<readonly string[]> {
  return withFallback(
    [...new Set(PRODUCTS.map((product) => product.category))],
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (error || !data) return [...new Set(PRODUCTS.map((product) => product.category))];
      return data.map((category) => category.name);
    },
  );
}

export async function getHeaderContent(): Promise<HeaderContent> {
  return withFallback(HEADER_CONTENT, async () => {
    const supabase = await createClient();
    const [{ data: header }, { data: links }] = await Promise.all([
      supabase.from("site_header").select("logo_text").eq("id", true).single(),
      supabase
        .from("header_links")
        .select("id,label,href,display_order,active")
        .eq("active", true)
        .order("display_order", { ascending: true }),
    ]);

    return {
      logoText: header?.logo_text ?? HEADER_CONTENT.logoText,
      // Sin enlaces (lista vacía o sin permisos de lectura) se usan los del mock:
      // el `?? ` no basta porque un array vacío no es null.
      links:
        links && links.length
          ? links.map((link) => ({
              id: link.id,
              label: link.label,
              href: link.href,
              order: link.display_order,
              active: link.active,
            }))
          : HEADER_CONTENT.links,
    };
  });
}

export async function getHeroContent(): Promise<HeroContent> {
  return withFallback(HERO_CONTENT, async () => {
    const supabase = await createClient();
    const [{ data: hero }, { data: ctas }, { data: stats }] = await Promise.all([
      supabase.from("hero_section").select("*").eq("id", true).eq("status", "published").single(),
      supabase
        .from("hero_ctas")
        .select("id,label,href,variant,display_order")
        .eq("active", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("hero_stats")
        .select("id,value,label,display_order")
        .eq("active", true)
        .order("display_order", { ascending: true }),
    ]);

    if (!hero) return HERO_CONTENT;

    return {
      badgeText: hero.badge_text,
      titlePrefix: hero.title_prefix,
      titleEmphasis: hero.title_emphasis,
      titleSuffix: hero.title_suffix,
      description: hero.description,
      featuredProductId: hero.featured_product_id,
      ctas:
        ctas?.map((cta) => ({
          id: cta.id,
          label: cta.label,
          href: cta.href,
          variant: cta.variant,
          order: cta.display_order,
        })) ?? HERO_CONTENT.ctas,
      stats:
        stats?.map((stat) => ({
          id: stat.id,
          value: stat.value,
          label: stat.label,
          order: stat.display_order,
        })) ?? HERO_CONTENT.stats,
    };
  });
}

export async function getAboutContent(): Promise<AboutContent> {
  return withFallback(ABOUT_CONTENT, async () => {
    const supabase = await createClient();
    const [{ data: about }, { data: stats }, { data: values }] = await Promise.all([
      supabase.from("about_section").select("*").eq("id", true).eq("status", "published").single(),
      supabase
        .from("about_stats")
        .select("id,value,label,display_order")
        .eq("active", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("about_values")
        .select("id,icon,title,description,display_order")
        .eq("active", true)
        .order("display_order", { ascending: true }),
    ]);

    if (!about) return ABOUT_CONTENT;

    return {
      badgeText: about.badge_text,
      title: about.title,
      body: about.body,
      image: about.image_url,
      floatingQuote: about.floating_quote,
      stats:
        stats?.map((stat) => ({
          id: stat.id,
          value: stat.value,
          label: stat.label,
          order: stat.display_order,
        })) ?? ABOUT_CONTENT.stats,
      values:
        values?.map((value) => ({
          id: value.id,
          icon: value.icon,
          title: value.title,
          description: value.description,
          order: value.display_order,
        })) ?? ABOUT_CONTENT.values,
    };
  });
}

export async function getNewsletterContent(): Promise<NewsletterContent> {
  return withFallback(NEWSLETTER_CONTENT, async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("newsletter_section")
      .select("*")
      .eq("id", true)
      .eq("status", "published")
      .single();

    if (!data) return NEWSLETTER_CONTENT;
    return {
      badgeText: data.badge_text,
      title: data.title,
      description: data.description,
      buttonText: data.button_text,
      privacyNote: data.privacy_note,
    };
  });
}

export async function getFooterContent(): Promise<FooterContent> {
  return withFallback(FOOTER_CONTENT, async () => {
    const supabase = await createClient();
    const [{ data: footer }, { data: groups }, { data: links }, { data: socialLinks }] =
      await Promise.all([
        supabase.from("footer_section").select("*").eq("id", true).eq("status", "published").single(),
        supabase
          .from("footer_link_groups")
          .select("id,title,display_order")
          .eq("active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("footer_links")
          .select("id,group_id,kind,label,href,display_order,active")
          .eq("active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("footer_social_links")
          .select("id,platform,href,active")
          .eq("active", true),
      ]);

    if (!footer) return FOOTER_CONTENT;

    const groupedLinks = links?.filter((link) => link.kind === "group") ?? [];
    const legalLinks = links?.filter((link) => link.kind === "legal" && link.href) ?? [];

    return {
      logoText: footer.logo_text,
      description: footer.description,
      groups:
        groups?.map((group) => ({
          id: group.id,
          title: group.title,
          order: group.display_order,
          links: groupedLinks
            .filter((link) => link.group_id === group.id)
            .map((link) => ({
              id: link.id,
              label: link.label,
              href: link.href,
              order: link.display_order,
              active: link.active,
            })),
        })) ?? FOOTER_CONTENT.groups,
      legalLinks: legalLinks.map((link) => ({
        id: link.id,
        label: link.label,
        href: link.href,
        order: link.display_order,
        active: link.active,
      })),
      socialLinks:
        socialLinks?.map((link) => ({
          id: link.id,
          platform: link.platform,
          href: link.href,
          active: link.active,
        })) ?? FOOTER_CONTENT.socialLinks,
    };
  });
}
