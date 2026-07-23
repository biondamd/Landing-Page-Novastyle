// Única puerta de entrada a los datos para toda la UI.
//
// Hoy devuelven los mocks de lib/mock-data.ts. Cuando Strapi esté listo, se
// cambia el cuerpo de estas funciones por los fetch correspondientes (ver
// lib/strapi.ts) y ningún componente necesita tocarse: por eso son async
// desde el principio, aunque ahora resuelvan de inmediato.

import { COLLECTIONS, FEATURED_PRODUCT_ID, PRODUCTS } from "./mock-data";
import { CATEGORIES, type Category, type Collection, type Product } from "./types";

/** Catálogo completo. TODO(strapi): GET /products */
export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
}

/**
 * Prenda destacada en el Hero. Devuelve el producto real del catálogo, de modo
 * que su precio nunca puede contradecir al de la grilla.
 * TODO(strapi): GET /products?filters[destacado]=true
 */
export async function getFeaturedProduct(): Promise<Product> {
  const featured = PRODUCTS.find((product) => product.id === FEATURED_PRODUCT_ID);
  if (!featured) {
    throw new Error(`No existe el producto destacado con id ${FEATURED_PRODUCT_ID}`);
  }
  return featured;
}

/** Colecciones por temporada. TODO(strapi): GET /collections */
export async function getCollections(): Promise<Collection[]> {
  return COLLECTIONS;
}

/**
 * Categorías disponibles para los filtros del catálogo.
 * No incluye "Todos": ese es el estado inicial del filtro, no una categoría.
 */
export async function getCategories(): Promise<readonly Category[]> {
  return CATEGORIES;
}