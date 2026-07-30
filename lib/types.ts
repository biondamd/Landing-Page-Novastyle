// Tipos de dominio de la landing.

/** Categorías reales de producto. "Todos" es un filtro de la UI, no un dato. */
export type Category = string;

export type Product = {
  id: number;
  name: string;
  /** Precio en soles. Se muestra siempre con formatPrice(). */
  price: number;
  category: Category;
  color: string;
  image: string;
  /** Etiqueta destacada ("Nuevo", "Popular"…). null cuando no lleva. */
  tag: string | null;
  /** Agotado: la card se atenúa y oculta el botón de carrito. */
  sold: boolean;
};

export type Collection = {
  id: number;
  name: string;
  description: string;
  tag: string;
  image: string;
  /** Cuántas prendas agrupa la colección. */
  itemCount: number;
};

export type Link = {
  label: string;
  href: string;
};

export type CtaButton = Link & {
  style: "primary" | "secondary";
  openInNewTab: boolean;
};

export type Stat = {
  value: string;
  label: string;
};

export type HeaderContent = {
  logoText: string;
  navLinks: Link[];
};

export type HeroContent = {
  badgeText: string;
  titlePrefix: string;
  titleEmphasis: string;
  titleSuffix: string;
  description: string;
  ctaButtons: CtaButton[];
  stats: Stat[];
  marqueeItems: string[];
};

export type AboutFeature = {
  icon: string;
  title: string;
  description: string;
};

export type AboutContent = {
  badgeText: string;
  normalTitle: string;
  cursiveTitle: string;
  paragraph1: string;
  image: string;
  floatingQuote: string;
  stats: Stat[];
  features: AboutFeature[];
};

export type NewsletterContent = {
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  privacyNote: string | null;
};

export type FooterColumn = {
  title: string;
  links: Link[];
};

export type SocialLink = {
  platform: "instagram" | "facebook" | "tiktok" | "whatsapp" | "email";
  url: string;
};

export type FooterContent = {
  logoText: string;
  description: string;
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  bottomLinks: Link[];
  copyrightText: string;
};
