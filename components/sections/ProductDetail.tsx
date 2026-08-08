"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_URL } from "@/lib/contact";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductDetailProps = {
  product: Product;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];
  const soldOut = product.sold;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Trampa de foco: el tabulador no debe salir del diálogo.
      if (event.key === "Tab") {
        const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (!nodes || nodes.length === 0) return;
        const list = Array.from(nodes);
        const first = list[0];
        const last = list[list.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Bloquea el scroll del fondo mientras la ficha está abierta.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-foreground/50 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      // Clic fuera: solo cuenta si el objetivo es el fondo, no un hijo del panel.
      onMouseDown={(event) => {
        if (!panelRef.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative my-8 w-full max-w-3xl bg-background sm:my-0"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha del producto"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center bg-background/80 text-foreground/70 backdrop-blur-sm transition-colors hover:text-foreground"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative aspect-[3/4] bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className={`object-cover ${soldOut ? "opacity-60" : ""}`}
            />
            {(soldOut || product.tag) && (
              <span
                className={`absolute left-3 top-3 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${
                  soldOut ? "bg-muted text-muted-foreground" : "bg-background text-foreground"
                }`}
              >
                {soldOut ? "Agotado" : product.tag}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {product.category}
              </p>
              <h2 id={titleId} className="font-serif text-2xl font-medium text-foreground md:text-3xl">
                {product.name}
              </h2>
              <div className="mt-2 flex items-baseline gap-3">
                <p
                  className={`font-serif text-xl ${
                    soldOut ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {formatPrice(product.price)}
                </p>
                {product.originalPrice ? (
                  <p className="font-serif text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Disponibilidad general */}
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <span
                aria-hidden="true"
                className={`inline-block h-2 w-2 ${soldOut ? "bg-destructive" : "bg-green-600"}`}
              />
              <span className={soldOut ? "text-destructive" : "text-foreground"}>
                {soldOut ? "Sin stock" : "Disponible"}
              </span>
            </p>

            {product.description ? (
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            ) : null}

            {/* Colores (solo visualización) */}
            {colors.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Color
                </p>
                <ul className="flex flex-wrap gap-2">
                  {colors.map((option) => (
                    <li
                      key={option.label}
                      title={option.available ? option.label : `${option.label} — agotado`}
                      className={`relative h-11 w-11 border border-border ${
                        option.available ? "" : "opacity-40"
                      }`}
                      style={{ background: option.swatch ?? "var(--muted)" }}
                    >
                      <span className="sr-only">
                        {option.label}: {option.available ? "disponible" : "agotado"}
                      </span>
                      {!option.available && (
                        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                          <span className="h-px w-8 rotate-45 bg-foreground/70" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tallas (solo visualización) */}
            {sizes.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Talla
                </p>
                <ul className="flex flex-wrap gap-2">
                  {sizes.map((option) => (
                    <li
                      key={option.label}
                      className={`inline-flex h-11 min-w-11 items-center justify-center border border-border px-3 text-sm ${
                        option.available ? "text-foreground" : "text-muted-foreground line-through"
                      }`}
                    >
                      {option.label}
                      <span className="sr-only">{option.available ? "" : " (agotada)"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Consulta por WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-[#25d366] px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#1fb457]"
            >
              <WhatsAppIcon size={18} />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
