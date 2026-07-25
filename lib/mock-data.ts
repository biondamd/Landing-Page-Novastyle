// Datos de ejemplo tomados del prototipo de Figma (Catalog.tsx y Collections.tsx).
// Es la única fuente de datos hasta que Strapi esté listo: los componentes nunca
// importan de aquí, siempre pasan por lib/data.ts.
//
// Las imágenes viven en public/images/ y se sirven con next/image, que genera el
// tamaño de cada breakpoint. El recorte 3:4 lo hace el CSS con object-cover.

import type { Collection, Product } from "./types";

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
    // Provisional: la foto del perchero de "Esenciales" (tonos camel).
    image: "/images/colecciones/esenciales.jpg",
  },
  {
    id: 6,
    name: "Blusa Bordada",
    price: 139,
    category: "Blusas",
    color: "Blanco",
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