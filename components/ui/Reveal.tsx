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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Una sola vez.
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
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