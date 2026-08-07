// Tipos de dominio compartidos por la landing y el CMS.

/** Categorías reales de producto. "Todos" es un filtro de la UI, no un dato. */
export const CATEGORIES = [
  "Vestidos",
  "Blusas",
  "Pantalones",
  "Accesorios",
  "Outerwear",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: number;
  name: string;
  slug?: string;
  /** Precio en soles. Se muestra siempre con formatPrice(). */
  price: number;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  category: string;
  categorySlug?: string;
  collectionId?: number | null;
  collectionSlug?: string | null;
  color: string;
  image: string;
  images?: ProductImage[];
  description?: string | null;
  /** Tallas disponibles del producto, con la disponibilidad de cada una. */
  sizes?: ProductOption[];
  /** Colores disponibles del producto, con la disponibilidad de cada uno. */
  colors?: ProductOption[];
  /** Etiqueta destacada ("Nuevo", "Popular"…). null cuando no lleva. */
  tag: string | null;
  /** Agotado: la card se atenúa y oculta el botón de carrito. */
  sold: boolean;
  published?: boolean;
};

/** Opción de variante (talla o color) con su disponibilidad individual. */
export type ProductOption = {
  label: string;
  available: boolean;
  /** Solo para colores: muestra de color en CSS (hex o gradiente). */
  swatch?: string;
};

/** Promoción vigente que muestra el apartado de promociones de la landing. */
export type Promotion = {
  id: number;
  name: string;
  percentage: number;
  scope: "product" | "category" | "collection";
  /** Nombre de aquello a lo que se aplica (categoría, colección o producto). */
  targetLabel: string | null;
  startsAt: string;
  endsAt: string;
};

export type Collection = {
  id: number;
  name: string;
  slug?: string;
  description: string;
  tag: string;
  image: string;
  /** Cuántas prendas agrupa la colección. */
  itemCount: number;
};

export type ProductImage = {
  id?: number;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
};

export type HeaderLink = {
  id: number;
  label: string;
  href: string;
  order: number;
  active: boolean;
};

export type HeaderContent = {
  logoText: string;
  links: HeaderLink[];
};

export type HeroCta = {
  id: number;
  label: string;
  href: string;
  variant: "primary" | "secondary";
  order: number;
};

export type HeroStat = {
  id: number;
  value: string;
  label: string;
  order: number;
};

export type HeroContent = {
  badgeText: string;
  titlePrefix: string;
  titleEmphasis: string;
  titleSuffix: string;
  description: string;
  featuredProductId: number | null;
  ctas: HeroCta[];
  stats: HeroStat[];
};

export type AboutValue = {
  id: number;
  icon: "leaf" | "scissors" | "heart" | "map-pin";
  title: string;
  description: string;
  order: number;
};

export type AboutStat = {
  id: number;
  value: string;
  label: string;
  order: number;
};

export type AboutContent = {
  badgeText: string;
  title: string;
  body: string;
  image: string;
  floatingQuote: string;
  stats: AboutStat[];
  values: AboutValue[];
};

export type NewsletterContent = {
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  privacyNote: string;
};

export type FooterLink = {
  id: number;
  label: string;
  href: string | null;
  order: number;
  active: boolean;
};

export type FooterGroup = {
  id: number;
  title: string;
  order: number;
  links: FooterLink[];
};

export type FooterSocialLink = {
  id: number;
  platform: "instagram" | "facebook";
  href: string | null;
  active: boolean;
};

export type FooterContent = {
  logoText: string;
  description: string;
  groups: FooterGroup[];
  legalLinks: FooterLink[];
  socialLinks: FooterSocialLink[];
};
