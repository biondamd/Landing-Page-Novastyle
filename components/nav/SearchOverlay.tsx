"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Cuántos resultados se listan como máximo. */
const MAX_RESULTS = 5;

/**
 * Quita acentos y pasa a minúsculas para que "carmesi" encuentre "Carmesí".
 * Sin esto habría que escribir la tilde exacta, que en móvil casi nadie pone.
 */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

type SearchOverlayProps = {
  products: Product[];
  onClose: () => void;
};

export default function SearchOverlay({ products, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Bloquea el scroll del fondo mientras el buscador está abierto. No provoca
    // salto de layout porque las barras de scroll están ocultas globalmente.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return [];
    return products
      .filter(
        (product) =>
          normalize(product.name).includes(term) ||
          normalize(product.category).includes(term),
      )
      .slice(0, MAX_RESULTS);
  }, [products, query]);

  const hasQuery = query.trim().length > 0;

  /**
   * Cierra y lleva al producto dentro del catálogo.
   * TODO(HU-08): las cards deben renderizarse con id="producto-{id}". Mientras
   * no existan, el salto cae en la sección de catálogo.
   */
  const goToProduct = (productId: number) => {
    onClose();
    requestAnimationFrame(() => {
      const target =
        document.getElementById(`producto-${productId}`) ??
        document.getElementById("catalogo");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
      // Clic fuera: solo cuenta si el objetivo es el fondo, no un hijo del panel.
      onMouseDown={(event) => {
        if (!panelRef.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar prendas"
        className="border-b border-border bg-background"
      >
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Search size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o categoría…"
              aria-label="Buscar prendas por nombre o categoría"
              className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar buscador"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Anuncia el número de resultados a los lectores de pantalla. */}
          <p role="status" aria-live="polite" className="sr-only">
            {hasQuery
              ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`
              : ""}
          </p>

          {hasQuery && (
            <div className="pt-4">
              {results.length > 0 ? (
                <ul className="flex flex-col">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => goToProduct(product.id)}
                        className="flex w-full items-center gap-4 px-2 py-3 text-left transition-colors hover:bg-card"
                      >
                        <Image
                          src={product.image}
                          alt=""
                          width={48}
                          height={64}
                          className="h-16 w-12 shrink-0 bg-muted object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-foreground">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {product.category}
                          </span>
                        </span>
                        <span className="shrink-0 font-serif text-base text-foreground">
                          {formatPrice(product.price)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2 py-6 text-sm text-muted-foreground">
                  No encontramos prendas con ese nombre.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}