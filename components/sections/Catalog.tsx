"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

/** Cuántas prendas se añaden con cada "Cargar más". */
const PAGE_SIZE = 8;

/** Opción de filtro que muestra todo; no es una categoría real. */
const ALL = "Todos";

type Filter = typeof ALL | Category;

type CatalogProps = {
  products: Product[];
  categories: readonly Category[];
};

export default function Catalog({ products, categories }: CatalogProps) {
  const [filter, setFilter] = useState<Filter>(ALL);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Set de ids marcados. Persiste mientras la página siga abierta.
  const [wishlist, setWishlist] = useState<ReadonlySet<number>>(new Set());

  const filters: Filter[] = [ALL, ...categories];
  const filtered = filter === ALL ? products : products.filter((p) => p.category === filter);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setVisibleCount(PAGE_SIZE); // Cada filtro empieza desde su primera página.
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="catalogo" className="bg-card px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <span className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Catálogo virtual
          </span>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-serif text-4xl font-medium text-foreground md:text-5xl">
              Todas las prendas
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {filtered.length}{" "}
              {filtered.length === 1 ? "artículo encontrado" : "artículos encontrados"}
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
                className={`border px-5 py-2 text-sm transition-all duration-200 ${
                  active
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            );
          })}
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
                    initial={{ opacity: 0, y: 20 }}
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
                          className={`absolute left-3 top-3 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${
                            product.sold
                              ? "bg-muted text-muted-foreground"
                              : "bg-background text-foreground"
                          }`}
                        >
                          {product.sold ? "Agotado" : product.tag}
                        </span>
                      )}

                      <div className="absolute right-3 top-3 flex translate-x-8 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-pressed={wishlist.has(product.id)}
                          aria-label={
                            wishlist.has(product.id)
                              ? `Quitar ${product.name} de favoritos`
                              : `Añadir ${product.name} a favoritos`
                          }
                          className={`flex h-8 w-8 items-center justify-center bg-background transition-colors ${
                            wishlist.has(product.id)
                              ? "text-destructive"
                              : "text-foreground/60 hover:text-foreground"
                          }`}
                        >
                          <Heart
                            size={14}
                            aria-hidden="true"
                            fill={wishlist.has(product.id) ? "currentColor" : "none"}
                          />
                        </button>

                        {!product.sold && (
                          <button
                            type="button"
                            aria-label={`Añadir ${product.name} al carrito`}
                            className="flex h-8 w-8 items-center justify-center bg-foreground text-primary-foreground transition-colors hover:bg-accent hover:text-foreground"
                          >
                            <ShoppingBag size={14} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 pt-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug text-foreground">
                          {product.name}
                        </p>
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
    </section>
  );
}