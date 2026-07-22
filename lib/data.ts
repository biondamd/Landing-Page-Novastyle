// Única puerta de entrada a los datos para toda la UI.
//
// Hoy devuelven los mocks de lib/mock-data.ts. Cuando Strapi esté listo, se
// cambia el cuerpo de estas funciones por los fetch correspondientes (ver
// lib/strapi.ts) y ningún componente necesita tocarse: por eso son async
// desde el principio, aunque ahora resuelvan de inmediato.

import { COLLECTIONS, PRODUCTS } from "./mock-data";
import { CATEGORIES, type Category, type Collection, type Product } from "./types";

/** Catálogo completo. TODO(strapi): GET /products */
export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
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