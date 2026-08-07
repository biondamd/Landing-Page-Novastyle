"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import ProductDetail from "@/components/sections/ProductDetail";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Cuántas prendas se añaden con cada "Cargar más". */
const PAGE_SIZE = 8;

/** Opción de filtro que muestra todo; no es una categoría real. */
const ALL = "Todos";

type Filter = string;

type CatalogProps = {
  products: Product[];
  categories: readonly string[];
};

export default function Catalog({ products, categories }: CatalogProps) {
  const [filter, setFilter] = useState<Filter>(ALL);
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Producto cuya ficha de detalle está abierta (null = ninguna).
  const [selected, setSelected] = useState<Product | null>(null);

  // Al cerrar la ficha, el foco vuelve al nombre de la card que la abrió.
  const closeDetail = useCallback(() => {
    setSelected((current) => {
      if (current) {
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLElement>(`#producto-${current.id} [data-detail-trigger]`)
            ?.focus();
        });
      }
      return null;
    });
  }, []);

  const filters: Filter[] = [ALL, ...categories];
  const filtered = products.filter((product) => {
    const categoryMatches = filter === ALL || product.category === filter;
    const collectionMatches = !collectionFilter || product.collectionSlug === collectionFilter;
    return categoryMatches && collectionMatches;
  });
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setCollectionFilter(null);
    setVisibleCount(PAGE_SIZE); // Cada filtro empieza desde su primera página.
  };

  useEffect(() => {
    const applyCollection = () => {
      const params = new URLSearchParams(window.location.hash.split("?")[1]);
      const collection = params.get("coleccion");
      if (!collection) return;
      setCollectionFilter(collection);
      setVisibleCount(PAGE_SIZE);
    };

    applyCollection();
    window.addEventListener("hashchange", applyCollection);
    return () => window.removeEventListener("hashchange", applyCollection);
  }, []);

  return (
    <section id="catalogo" className="bg-card px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <span className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-accent-strong">
            Catálogo virtual
          </span>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-serif text-4xl font-medium text-foreground md:text-5xl">
              Todas las prendas
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {filtered.length}{" "}
              {filtered.length === 1 ? "artículo encontrado" : "artículos encontrados"}
              {collectionFilter ? " en esta colección" : ""}
            </p>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          {filters.map((option) => {
            const active = option === filter;
            return (
              <button
                key={option}
                type="button"
                onClick={() => changeFilter(option)}
                aria-pressed={active}
                className={`inline-flex min-h-11 items-center border px-5 text-sm transition-all duration-200 ${
                  active
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                  {option}
                </button>
              );
            })}
          {collectionFilter && (
            <button
              type="button"
              onClick={() => {
                setCollectionFilter(null);
                window.history.replaceState(null, "", "#catalogo");
              }}
              className="inline-flex min-h-11 items-center border border-foreground px-5 text-sm text-foreground transition-all duration-200 hover:bg-foreground hover:text-primary-foreground"
            >
              Limpiar colección
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No hay prendas en esta categoría por ahora.
          </p>
        ) : (
          <MotionConfig reducedMotion="user">
            <motion.ul
              layout
              className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((product) => (
                  <motion.li
                    key={product.id}
                    id={`producto-${product.id}`}
                    layout
                    // initial={false}: el producto se renderiza ya visible en el
                    // servidor (opacity:1). Así la grilla nunca queda vacía si el
                    // JavaScript no llega a ejecutarse; la animación de entrada al
                    // filtrar/cargar más sigue funcionando cuando sí hay JS.
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                          product.sold ? "opacity-60" : ""
                        }`}
                      />

                      {(product.sold || product.tag) && (
                        <span
                          className={`pointer-events-none absolute left-3 top-3 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${
                            product.sold
                              ? "bg-muted text-muted-foreground"
                              : "bg-background text-foreground"
                          }`}
                        >
                          {product.sold ? "Agotado" : product.tag}
                        </span>
                      )}

                      {/* Cubre la imagen para abrir la ficha con un clic. Es
                          redundante para el teclado (lo hace el nombre), por eso
                          va oculto a lectores de pantalla y fuera del tabulador. */}
                      <button
                        type="button"
                        aria-hidden="true"
                        tabIndex={-1}
                        onClick={() => setSelected(product)}
                        className="absolute inset-0 z-10 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 pt-4">
                      <div className="min-w-0">
                        <button
                          type="button"
                          data-detail-trigger
                          onClick={() => setSelected(product)}
                          className="text-left text-sm font-medium leading-snug text-foreground underline-offset-2 hover:underline"
                        >
                          {product.name}
                        </button>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {product.color}
                        </p>
                      </div>
                      <p
                        className={`shrink-0 font-serif text-base ${
                          product.sold ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                      >
                        {formatPrice(product.price)}
                      </p>
                      {product.originalPrice && (
                        <p className="shrink-0 font-serif text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </MotionConfig>
        )}

        {hasMore && (
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="border border-foreground px-10 py-3 text-sm text-foreground transition-all duration-300 hover:bg-foreground hover:text-primary-foreground"
            >
              Cargar más prendas
            </button>
          </div>
        )}
      </div>

      {selected && <ProductDetail product={selected} onClose={closeDetail} />}
    </section>
  );
}
