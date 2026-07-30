import { strapiGet, strapiMediaUrl } from "./strapi";
import type {
  AboutContent,
  AboutFeature,
  Category,
  Collection,
  CtaButton,
  FooterContent,
  HeaderContent,
  HeroContent,
  Link,
  NewsletterContent,
  Product,
  SocialLink,
  Stat,
} from "./types";

type StrapiEntity<T> = T & {
  id: number;
  documentId?: string;
  attributes?: T;
};

type StrapiResponse<T> = {
  data: StrapiEntity<T>;
};

type StrapiListResponse<T> = {
  data: StrapiEntity<T>[];
};

type StrapiRelation<T> = StrapiEntity<T> | { data: StrapiEntity<T> | null } | null;
type StrapiListRelation<T> = StrapiEntity<T>[] | { data: StrapiEntity<T>[] } | null;
type StrapiMedia = StrapiRelation<{ url: string }>;
type StrapiMediaList = StrapiListRelation<{ url: string }>;

type RawLink = {
  id?: number;
  label: string;
  url: string;
};

type RawCtaButton = RawLink & {
  style?: "primary" | "secondary";
  openInNewTab?: boolean | null;
};

type RawStat = {
  id?: number;
  value: string;
  label: string;
};

type RawCategoria = {
  name: string;
  slug?: string;
};

type RawProducto = {
  name: string;
  slug?: string;
  price: string | number;
  color: string;
  images: StrapiMediaList;
  badge?: "nuevo" | "popular" | "ultimas_unidades" | null;
  soldOut?: boolean | null;
  description?: string | null;
  categoria?: StrapiRelation<RawCategoria>;
};

type RawColeccion = {
  name: string;
  slug?: string;
  badgeLabel: string;
  description: string;
  image: StrapiMedia;
  displayOrder?: number | null;
  productos?: StrapiListRelation<RawProducto>;
};

type RawHeader = {
  logotext: string;
  navlinks?: RawLink[];
};

type RawHero = {
  badgeText: string;
  specialTittle: {
    titlePrefix: string;
    titleEmphasis: string;
    titleSuffix: string;
  };
  description: string;
  ctaButtons?: RawCtaButton[];
  stats?: RawStat[];
  producto?: StrapiRelation<RawProducto>;
};

type RawNuestraHistoria = {
  badgeText: string;
  normalTittle: string;
  cursiveTittle: string;
  paragraph1: string;
  image: StrapiMedia;
  floatingQuote: string;
  stats?: RawStat[];
  features?: {
    id?: number;
    icon: string;
    tittle: string;
    description: string;
  }[];
};

type RawNewsLetter = {
  badgeText: string;
  tittle: string;
  description: string;
  buttonText: string;
  privacyNote?: string | null;
};

type RawFooter = {
  logoText: string;
  description: string;
  columns?: {
    id?: number;
    title: string;
    links?: RawLink[];
  }[];
  socialLinks?: SocialLink[];
  bottomLinks?: RawLink[];
  copyrightText: string;
};

const PRODUCT_MEDIA_FALLBACK = "/images/productos/blusa-bordada.jpg";
const COLLECTION_MEDIA_FALLBACK = "/images/colecciones/esenciales.jpg";
const ABOUT_MEDIA_FALLBACK = "/images/secciones/taller.jpg";

function unwrap<T>(entity: StrapiEntity<T>): T & { id: number } {
  return { id: entity.id, ...(entity.attributes ?? entity) };
}

function relation<T>(value: StrapiRelation<T> | undefined): (T & { id: number }) | null {
  if (!value) return null;
  if ("data" in value) return value.data ? unwrap(value.data) : null;
  return unwrap(value);
}

function relationList<T>(value: StrapiListRelation<T> | undefined): (T & { id: number })[] {
  if (!value) return [];
  const items = Array.isArray(value) ? value : value.data;
  return items.map(unwrap);
}

function mediaList(value: StrapiMediaList | undefined): string[] {
  return relationList(value).map((media) => media.url).filter(Boolean);
}

function requiredMediaUrl(
  value: string | null | undefined,
  context: string,
  fallback: string,
): string {
  const url = strapiMediaUrl(value);
  if (url) return url;
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Strapi media missing for ${context}`);
  }
  return fallback;
}

function linkFromStrapi(link: RawLink): Link {
  return {
    label: link.label,
    href: link.url,
  };
}

function statFromStrapi(stat: RawStat): Stat {
  return {
    value: stat.value,
    label: stat.label,
  };
}

function badgeLabel(value: RawProducto["badge"]): string | null {
  if (value === "nuevo") return "Nuevo";
  if (value === "popular") return "Popular";
  if (value === "ultimas_unidades") return "Últimas unidades";
  return null;
}

function productFromStrapi(entity: StrapiEntity<RawProducto>): Product {
  const product = unwrap(entity);
  const categoria = relation(product.categoria);
  const firstImage = mediaList(product.images)[0];

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    category: categoria?.name ?? "Sin categoría",
    color: product.color,
    image: requiredMediaUrl(firstImage, `producto ${product.name}`, PRODUCT_MEDIA_FALLBACK),
    tag: badgeLabel(product.badge),
    sold: Boolean(product.soldOut),
  };
}

function collectionFromStrapi(entity: StrapiEntity<RawColeccion>): Collection {
  const collection = unwrap(entity);
  const image = relation(collection.image);
  const productos = relationList(collection.productos);

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    tag: collection.badgeLabel,
    image: requiredMediaUrl(image?.url, `coleccion ${collection.name}`, COLLECTION_MEDIA_FALLBACK),
    itemCount: productos.length,
  };
}

export async function getProducts(): Promise<Product[]> {
  const response = await strapiGet<StrapiListResponse<RawProducto>>("/api/productos", {
    query: {
      populate: {
        images: { fields: ["url"] },
        categoria: { fields: ["name", "slug"] },
        coleccion: { fields: ["name", "slug"] },
      },
      sort: ["name:asc"],
    },
  });

  return response.data.map(productFromStrapi);
}

export async function getCategories(): Promise<readonly Category[]> {
  const response = await strapiGet<StrapiListResponse<RawCategoria>>("/api/categorias", {
    query: {
      fields: ["name", "slug"],
      sort: ["name:asc"],
    },
  });

  return response.data.map((item) => unwrap(item).name);
}

export async function getCollections(): Promise<Collection[]> {
  const response = await strapiGet<StrapiListResponse<RawColeccion>>("/api/coleccions", {
    query: {
      populate: {
        image: { fields: ["url"] },
        productos: { fields: ["name"] },
      },
      sort: ["displayOrder:asc", "name:asc"],
    },
  });

  return response.data.map(collectionFromStrapi);
}

export async function getHeaderContent(): Promise<HeaderContent> {
  const response = await strapiGet<StrapiResponse<RawHeader>>("/api/header", {
    query: {
      populate: { navlinks: true },
    },
  });
  const header = unwrap(response.data);

  return {
    logoText: header.logotext,
    navLinks: (header.navlinks ?? []).map(linkFromStrapi),
  };
}

export async function getHeroSection(): Promise<{ content: HeroContent; featured: Product }> {
  const response = await strapiGet<StrapiResponse<RawHero>>("/api/hero", {
    query: {
      populate: {
        specialTittle: true,
        ctaButtons: true,
        stats: true,
        producto: {
          populate: {
            images: { fields: ["url"] },
            categoria: { fields: ["name", "slug"] },
          },
        },
      },
    },
  });
  const hero = unwrap(response.data);
  const featured = relation(hero.producto);

  if (!featured) {
    throw new Error("Strapi hero.producto relation is required for the featured product");
  }

  return {
    content: {
      badgeText: hero.badgeText,
      titlePrefix: hero.specialTittle.titlePrefix,
      titleEmphasis: hero.specialTittle.titleEmphasis,
      titleSuffix: hero.specialTittle.titleSuffix,
      description: hero.description,
      ctaButtons: (hero.ctaButtons ?? []).map((button): CtaButton => ({
        ...linkFromStrapi(button),
        style: button.style ?? "primary",
        openInNewTab: Boolean(button.openInNewTab),
      })),
      stats: (hero.stats ?? []).map(statFromStrapi),
      marqueeItems: ["Moda consciente", "Diseño local", "Telas naturales", "Hecho con amor"],
    },
    featured: productFromStrapi(featured),
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  const response = await strapiGet<StrapiResponse<RawNuestraHistoria>>(
    "/api/nuestra-historia",
    {
      query: {
        populate: {
          image: { fields: ["url"] },
          stats: true,
          features: true,
        },
      },
    },
  );
  const about = unwrap(response.data);
  const image = relation(about.image);

  return {
    badgeText: about.badgeText,
    normalTitle: about.normalTittle,
    cursiveTitle: about.cursiveTittle,
    paragraph1: about.paragraph1,
    image: requiredMediaUrl(image?.url, "nuestra-historia image", ABOUT_MEDIA_FALLBACK),
    floatingQuote: about.floatingQuote,
    stats: (about.stats ?? []).map(statFromStrapi),
    features: (about.features ?? []).map(
      (feature): AboutFeature => ({
        icon: feature.icon,
        title: feature.tittle,
        description: feature.description,
      }),
    ),
  };
}

export async function getNewsletterContent(): Promise<NewsletterContent> {
  const response = await strapiGet<StrapiResponse<RawNewsLetter>>("/api/news-letter");
  const newsletter = unwrap(response.data);

  return {
    badgeText: newsletter.badgeText,
    title: newsletter.tittle,
    description: newsletter.description,
    buttonText: newsletter.buttonText,
    privacyNote: newsletter.privacyNote ?? null,
  };
}

export async function getFooterContent(): Promise<FooterContent> {
  const response = await strapiGet<StrapiResponse<RawFooter>>("/api/footer", {
    query: {
      populate: {
        columns: { populate: { links: true } },
        socialLinks: true,
        bottomLinks: true,
      },
    },
  });
  const footer = unwrap(response.data);

  return {
    logoText: footer.logoText,
    description: footer.description,
    columns: (footer.columns ?? []).map((column) => ({
      title: column.title,
      links: (column.links ?? []).map(linkFromStrapi),
    })),
    socialLinks: footer.socialLinks ?? [],
    bottomLinks: (footer.bottomLinks ?? []).map(linkFromStrapi),
    copyrightText: footer.copyrightText,
  };
}
