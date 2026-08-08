// Datos de ejemplo tomados del prototipo de Figma (Catalog.tsx y Collections.tsx).
// Es la única fuente de datos hasta que Strapi esté listo: los componentes nunca
// importan de aquí, siempre pasan por lib/data.ts.
//
// Las imágenes viven en public/images/ y se sirven con next/image, que genera el
// tamaño de cada breakpoint. El recorte 3:4 lo hace el CSS con object-cover.

import type {
  AboutContent,
  Collection,
  FooterContent,
  HeaderContent,
  HeroContent,
  NewsletterContent,
  Product,
  ProductOption,
  Promotion,
} from "./types";

/**
 * Tallas de un producto: la escalera que ofrece (XS–3XL según el corte), con
 * todas disponibles salvo las que se listen como agotadas.
 */
function sizeSet(ladder: readonly string[], soldOut: string[] = []): ProductOption[] {
  return ladder.map((label) => ({ label, available: !soldOut.includes(label) }));
}

/** Atajo para declarar un color con su muestra y disponibilidad. */
function color(label: string, swatch: string, available = true): ProductOption {
  return { label, swatch, available };
}

// El set de fotos es limitado, así que —siguiendo el diseño de referencia—
// algunas imágenes se comparten entre catálogo y colecciones. Los productos sin
// foto propia llevan un TODO con el nombre que debería tener su archivo final.
// Cada tarjeta del catálogo usa una imagen distinta para que la grilla se vea
// completa.

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vestido Lino Natural",
    price: 189,
    category: "Vestidos",
    color: "Arena",
    sizes: sizeSet(["XS", "S", "M", "L", "XL"], ["XS"]),
    colors: [
      color("Arena", "#d9c7a8"),
      color("Blanco roto", "#efe7d6"),
      color("Terracota", "#b5623c", false),
    ],
    tag: "Nuevo",
    sold: false,
    // TODO(foto): /images/productos/vestido-lino-natural.jpg
    // Provisional: la foto del traje claro (archivo blusa-bordada.jpg), tono "Arena".
    image: "/images/productos/blusa-bordada.jpg",
  },
  {
    id: 2,
    name: "Blusa Seda Cruda",
    price: 129,
    category: "Blusas",
    color: "Crudo",
    sizes: sizeSet(["XS", "S", "M", "L", "XL", "XXL"], ["L"]),
    colors: [color("Crudo", "#ede4d3"), color("Negro", "#1a1714")],
    tag: "Popular",
    sold: false,
    image: "/images/productos/blusa-seda-cruda.jpg",
  },
  {
    id: 3,
    name: "Vestido Carmesí",
    price: 229,
    category: "Vestidos",
    color: "Rojo",
    // "Últimas unidades": quedan pocas tallas.
    sizes: sizeSet(["S", "M", "L"], ["L"]),
    colors: [color("Carmesí", "#9e2b25"), color("Vino", "#5b2130", false)],
    tag: "Últimas unidades",
    sold: false,
    image: "/images/productos/vestido-carmesi.jpg",
  },
  {
    id: 4,
    name: "Blazer Sastre",
    price: 299,
    category: "Outerwear",
    // La foto es un tweed gris, no negro como decía el prototipo.
    color: "Gris",
    sizes: sizeSet(["S", "M", "L", "XL", "XXL"]),
    colors: [
      color("Gris", "#8a8a88"),
      color("Negro", "#1a1714"),
      color("Camel", "#b08d57"),
    ],
    tag: "Nuevo",
    sold: false,
    image: "/images/productos/blazer-sastre.jpg",
  },
  {
    id: 5,
    name: "Pantalón Wide Leg",
    price: 159,
    category: "Pantalones",
    color: "Camel",
    sizes: sizeSet(["XS", "S", "M", "L", "XL"], ["XS", "XL"]),
    colors: [
      color("Camel", "#b08d57"),
      color("Negro", "#1a1714"),
      color("Arena", "#d9c7a8", false),
    ],
    tag: null,
    sold: false,
    // TODO(foto): /images/productos/pantalon-wide-leg.jpg
    // Provisional: la foto del perchero de "Esenciales" (tonos camel).
    image: "/images/colecciones/esenciales.jpg",
  },
  {
    id: 6,
    name: "Blusa Bordada",
    price: 139,
    category: "Blusas",
    color: "Blanco",
    // Agotada: todas las tallas y colores sin stock.
    sizes: sizeSet(["XS", "S", "M", "L"], ["XS", "S", "M", "L"]),
    colors: [color("Blanco", "#f2ece0", false)],
    tag: "Edición limitada",
    sold: true,
    // Agotada: usa la foto de la percha vacía de "Verano 2026".
    image: "/images/colecciones/verano-2026.jpg",
  },
  {
    id: 7,
    name: "Vestido Midi Floral",
    price: 199,
    category: "Vestidos",
    color: "Multicolor",
    sizes: sizeSet(["XS", "S", "M", "L", "XL", "XXL"], ["XXL"]),
    colors: [
      color("Estampado crema", "linear-gradient(135deg,#e9dfc9,#c9a98a,#8aa9c9)"),
      color("Estampado azul", "linear-gradient(135deg,#c9d3e0,#7c93b5,#3f5878)"),
    ],
    tag: "Nuevo",
    sold: false,
    // TODO(foto): /images/productos/vestido-midi-floral.jpg
    // Provisional: la foto del vestido de "Noche".
    image: "/images/colecciones/noche.jpg",
  },
  {
    id: 8,
    name: "Camisa Oversize",
    price: 115,
    category: "Blusas",
    color: "Azul",
    sizes: sizeSet(["S", "M", "L", "XL", "XXL", "3XL"]),
    colors: [
      color("Azul", "#6e86a8"),
      color("Blanco", "#efe7d6"),
      color("Celeste", "#afc3d6", false),
    ],
    tag: null,
    sold: false,
    image: "/images/productos/camisa-oversize.jpg",
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: 1,
    name: "Verano 2026",
    description: "Livianos, frescos y llenos de color.",
    tag: "Nueva temporada",
    itemCount: 38,
    // Comparte la foto de la Camisa Oversize del catálogo (camiseta azul).
    image: "/images/productos/camisa-oversize.jpg",
  },
  {
    id: 2,
    name: "Noche",
    description: "Para los momentos que merecen brillar.",
    tag: "Ocasiones especiales",
    itemCount: 27,
    image: "/images/colecciones/noche.jpg",
  },
  {
    id: 3,
    name: "Esenciales",
    description: "Lo que nunca pasa de moda. Básicos con alma.",
    tag: "Atemporal",
    itemCount: 42,
    // Comparte la foto del Blazer Sastre del catálogo (blazer gris).
    image: "/images/productos/blazer-sastre.jpg",
  },
];

// Promociones vigentes de ejemplo (respaldo cuando Supabase no está disponible).
// Con la migración aplicada, la landing las lee de public_promotions_view.
export const PROMOTIONS: Promotion[] = [
  {
    id: 1,
    name: "Rebaja de Temporada",
    percentage: 20,
    scope: "category",
    targetLabel: "Vestidos",
    startsAt: "2026-06-01T00:00:00Z",
    endsAt: "2026-09-30T23:59:59Z",
  },
  {
    id: 2,
    name: "Blusas seleccionadas",
    percentage: 15,
    scope: "category",
    targetLabel: "Blusas",
    startsAt: "2026-06-15T00:00:00Z",
    endsAt: "2026-08-31T23:59:59Z",
  },
];

/**
 * Prenda que el Hero muestra como "Nuevo ingreso". Su foto es también la imagen
 * principal de la sección, así que la card y el catálogo no pueden desincronizarse.
 * TODO(strapi): sustituir por un campo "destacado" en el modelo de producto.
 */
export const FEATURED_PRODUCT_ID = 3;

/** Imágenes de secciones que no provienen del catálogo. */
export const SECTION_IMAGES = {
  about: "/images/secciones/taller.jpg",
} as const;

export const HEADER_CONTENT: HeaderContent = {
  logoText: "Novastyle",
  links: [
    { id: 1, label: "Colecciones", href: "#colecciones", order: 1, active: true },
    { id: 2, label: "Catálogo", href: "#catalogo", order: 2, active: true },
    { id: 3, label: "Sobre nosotras", href: "#sobre-nosotras", order: 3, active: true },
    { id: 4, label: "Contacto", href: "#contacto", order: 4, active: true },
  ],
};

export const HERO_CONTENT: HeroContent = {
  badgeText: "Colección Verano 2026 · Hecho en Perú",
  titlePrefix: "Moda que",
  titleEmphasis: "cuenta",
  titleSuffix: "una historia",
  description:
    "Prendas pensadas para mujeres reales. Diseños únicos, tejidos naturales y producción local — porque la moda debería sentirse tan bien como verse.",
  featuredProductId: FEATURED_PRODUCT_ID,
  ctas: [
    { id: 1, label: "Ver catálogo", href: "#catalogo", variant: "primary", order: 1 },
    { id: 2, label: "Ver colecciones", href: "#colecciones", variant: "secondary", order: 2 },
  ],
  stats: [
    { id: 1, value: "200+", label: "Prendas únicas", order: 1 },
    { id: 2, value: "100%", label: "Producción local", order: 2 },
    { id: 3, value: "4 años", label: "Vistiendo sueños", order: 3 },
  ],
};

export const ABOUT_CONTENT: AboutContent = {
  badgeText: "Nuestra historia",
  title: "Nació de un sueño, creció con amor",
  body:
    "Novastyle nació en 2022 desde el taller de casa de Valentina, en Lima, con una máquina de coser heredada y la certeza de que la moda peruana podía ser diferente: más honesta, más bonita, más cercana.\n\nHoy somos un equipo de 6 mujeres apasionadas que diseñan, cosen y empacan cada pedido con el mismo cuidado del primer día. Cada prenda lleva horas de trabajo, materiales elegidos con criterio y mucho cariño.",
  image: SECTION_IMAGES.about,
  floatingQuote: "Moda que se siente bien por dentro y por fuera.",
  stats: [
    { id: 1, value: "6", label: "Mujeres", order: 1 },
    { id: 2, value: "2.400+", label: "Clientas felices", order: 2 },
    { id: 3, value: "100%", label: "Hecho a mano", order: 3 },
  ],
  values: [
    {
      id: 1,
      icon: "leaf",
      title: "Materiales conscientes",
      description:
        "Usamos linos, algodones orgánicos y telas naturales que cuidan tanto tu piel como el planeta.",
      order: 1,
    },
    {
      id: 2,
      icon: "scissors",
      title: "Producción local",
      description:
        "Cada prenda se confecciona a mano por talleristas locales. Apoyamos el trabajo justo y la economía cercana.",
      order: 2,
    },
    {
      id: 3,
      icon: "heart",
      title: "Diseño inclusivo",
      description:
        "Tallas del XS al 3XL. Porque la moda bonita no debería tener límites de talla.",
      order: 3,
    },
  ],
};

export const NEWSLETTER_CONTENT: NewsletterContent = {
  badgeText: "Comunidad Novastyle",
  title: "Sé la primera en saberlo",
  description:
    "Nuevos ingresos, preventas exclusivas, descuentos para suscriptoras y detrás de escena del taller. Nada de spam, solo lo lindo.",
  buttonText: "Suscribirme",
  privacyNote: "Sin spam · Cancelas cuando quieras · Solo lo bueno",
};

export const FOOTER_CONTENT: FooterContent = {
  logoText: "Novastyle",
  description: "Moda consciente, hecha a mano, diseñada para ti.",
  socialLinks: [
    {
      id: 1,
      platform: "instagram",
      href: "https://www.instagram.com/novastyle.peru?igsh=c3liN3dtbmY4eDdx",
      active: true,
    },
    {
      id: 2,
      platform: "facebook",
      href: "https://www.facebook.com/share/19Lw49fDNY/?mibextid=wwXIfr",
      active: true,
    },
  ],
  groups: [
    {
      id: 1,
      title: "Tienda",
      order: 1,
      links: [
        { id: 1, label: "Novedades", href: null, order: 1, active: true },
        { id: 2, label: "Colecciones", href: "#colecciones", order: 2, active: true },
        { id: 3, label: "Catálogo completo", href: "#catalogo", order: 3, active: true },
        { id: 4, label: "Preventas", href: null, order: 4, active: true },
        { id: 5, label: "Liquidación", href: null, order: 5, active: true },
      ],
    },
    {
      id: 2,
      title: "Info",
      order: 2,
      links: [
        { id: 6, label: "Sobre nosotras", href: "#sobre-nosotras", order: 1, active: true },
        { id: 7, label: "Cómo comprar", href: null, order: 2, active: true },
        { id: 8, label: "Tallas y medidas", href: null, order: 3, active: true },
        { id: 9, label: "Envíos y devoluciones", href: null, order: 4, active: true },
        { id: 10, label: "Preguntas frecuentes", href: null, order: 5, active: true },
      ],
    },
    {
      id: 3,
      title: "Contacto",
      order: 3,
      links: [
        { id: 11, label: "hola@novastyle.pe", href: "mailto:hola@novastyle.pe", order: 1, active: true },
        { id: 12, label: "WhatsApp", href: null, order: 2, active: true },
        { id: 13, label: "Instagram DM", href: null, order: 3, active: true },
        { id: 14, label: "Lunes a viernes 9-18h", href: null, order: 4, active: true },
      ],
    },
  ],
  legalLinks: [
    { id: 15, label: "Términos", href: null, order: 1, active: true },
    { id: 16, label: "Privacidad", href: null, order: 2, active: true },
    { id: 17, label: "Cookies", href: null, order: 3, active: true },
  ],
};
