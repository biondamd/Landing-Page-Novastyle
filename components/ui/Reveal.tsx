"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Desde dónde entra el contenido. */
type Direction = "up" | "left" | "right";

const OFFSET: Record<Direction, CSSProperties> = {
  up: { "--reveal-x": "0", "--reveal-y": "20px" } as CSSProperties,
  left: { "--reveal-x": "-30px", "--reveal-y": "0" } as CSSProperties,
  right: { "--reveal-x": "30px", "--reveal-y": "0" } as CSSProperties,
};

type RevealProps = {
  children: ReactNode;
  /** Retardo de entrada en segundos, para escalonar varios Reveal. */
  delay?: number;
  /** Dirección de la que entra el contenido. Por defecto, desde abajo. */
  direction?: Direction;
  className?: string;
};

/**
 * Anima su contenido la primera vez que entra en el viewport, y solo esa vez.
 * Es un componente cliente para no convertir en cliente a toda la sección que
 * lo usa. Quien pide menos movimiento ve el contenido ya visible (resuelto en
 * globals.css con la clase `.reveal`).
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => setVisible(true);

    // Sin IntersectionObserver (o si algo falla al crearlo) el contenido se
    // muestra igualmente: nunca puede quedarse atrapado en opacity:0.
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(raf);
    }

    // Revela el elemento si ya está dentro del viewport. Es la red de seguridad
    // para cuando el observador no llega a notificar —por ejemplo al saltar
    // directo a un ancla— y el contenido quedaría invisible para siempre.
    const revealIfInView = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        reveal();
        return true;
      }
      return false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          cleanup();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);

    // Respaldo por si el observador no notifica: un scroll listener pasivo hace
    // la misma comprobación y se retira en cuanto el contenido se revela.
    const onScroll = () => {
      if (revealIfInView()) cleanup();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Comprobación inicial diferida: deja asentar la posición tras un posible
    // salto a ancla y revela lo que ya esté en pantalla, sin esperar al scroll.
    const raf = requestAnimationFrame(() => {
      if (revealIfInView()) cleanup();
    });

    function cleanup() {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    }

    return cleanup;
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`.trim()}
      style={{ ...OFFSET[direction], animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}