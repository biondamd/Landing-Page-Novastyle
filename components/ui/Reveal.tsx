"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Retardo de entrada en segundos, para escalonar varios Reveal. */
  delay?: number;
  className?: string;
};

/**
 * Anima su contenido con un fade-up la primera vez que entra en el viewport, y
 * solo esa vez. Es un componente cliente para no convertir en cliente a toda la
 * sección que lo usa. Quien pide menos movimiento ve el contenido ya visible
 * (resuelto en globals.css con la clase `.reveal`).
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
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
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}