// Tipos de dominio de la landing.
// Order y Subscriber llegarán con el panel de administración (fase 2).

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