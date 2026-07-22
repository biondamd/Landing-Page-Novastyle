// Datos de ejemplo tomados del prototipo de Figma (Catalog.tsx y Collections.tsx).
// Es la única fuente de datos hasta que Strapi esté listo: los componentes nunca
// importan de aquí, siempre pasan por lib/data.ts.
//
// Las imágenes viven en public/images/ y se sirven con next/image, que genera el
// tamaño de cada breakpoint. El recorte 3:4 lo hace el CSS con object-cover.

import type { Collection, Product } from "./types";

// Tres productos aún no tienen foto propia y reutilizan provisionalmente la de
// otra prenda. Cada uno lleva un TODO con el nombre exacto que debe tener su
// archivo definitivo. Solo se repiten fotos del catálogo, nunca de las
// colecciones: eso mostraría la misma imagen dos veces en la misma pantalla.

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vestido Lino Natural",
    price: 189,
    category: "Vestidos",
    color: "Arena",
    tag: "Nuevo",
    sold: false,
    // TODO(foto): /images/productos/vestido-lino-natural.jpg
    // Provisional: reutiliza la Blusa Bordada, la de tonos más cercanos a "Arena".
    image: "/images/productos/blusa-bordada.jpg",
  },
  {
    id: 2,
    name: "Blusa Seda Cruda",
    price: 129,
    category: "Blusas",
    color: "Crudo",
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
    tag: null,
    sold: false,
    // TODO(foto): /images/productos/pantalon-wide-leg.jpg
    // Provisional: reutiliza el Blazer Sastre, la única foto con pierna ancha.
    image: "/images/productos/blazer-sastre.jpg",
  },
  {
    id: 6,
    name: "Blusa Bordada",
    price: 139,
    category: "Blusas",
    color: "Blanco",
    tag: "Edición limitada",
    sold: true,
    image: "/images/productos/blusa-bordada.jpg",
  },
  {
    id: 7,
    name: "Vestido Midi Floral",
    price: 199,
    category: "Vestidos",
    color: "Multicolor",
    tag: "Nuevo",
    sold: false,
    // TODO(foto): /images/productos/vestido-midi-floral.jpg
    // Provisional: reutiliza la Blusa Seda Cruda, de caída suelta y fluida.
    image: "/images/productos/blusa-seda-cruda.jpg",
  },
  {
    id: 8,
    name: "Camisa Oversize",
    price: 115,
    category: "Blusas",
    color: "Azul",
    tag: null,
    sold: false,
    image: "/images/productos/camisa-oversize.jpg",
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: 1,
    name: "Esenciales",
    description: "Lo que nunca pasa de moda. Básicos con alma.",
    tag: "Atemporal",
    itemCount: 42,
    image: "/images/colecciones/esenciales.jpg",
  },
  {
    id: 2,
    name: "Verano 2026",
    description: "Livianos, frescos y llenos de color.",
    tag: "Nueva temporada",
    itemCount: 38,
    image: "/images/colecciones/verano-2026.jpg",
  },
  {
    id: 3,
    name: "Noche",
    description: "Para los momentos que merecen brillar.",
    tag: "Ocasiones especiales",
    itemCount: 27,
    image: "/images/colecciones/noche.jpg",
  },
];

/**
 * Imágenes de secciones que no provienen del catálogo.
 * El Hero (HU-06) reutiliza la foto del Vestido Carmesí, como en el prototipo.
 */
export const SECTION_IMAGES = {
  hero: "/images/productos/vestido-carmesi.jpg",
  about: "/images/secciones/taller.jpg",
} as const;