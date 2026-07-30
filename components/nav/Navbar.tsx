"use client";

import { Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import SearchOverlay from "@/components/nav/SearchOverlay";
import type { HeaderContent, Product } from "@/lib/types";

// Cada href apunta a un id que existe en la página y va sin tildes: los ids
// acentuados se codifican en la URL y rompen el salto por ancla.
//
// El prototipo incluía "Novedades", pero no hay sección de novedades: apuntaba
// al mismo destino que "Catálogo". Se retira hasta que el catálogo permita
// filtrar por la etiqueta "Nuevo" (HU-08) y el enlace tenga un destino propio.
type NavbarProps = {
  /** Catálogo que alimenta el buscador. Lo aporta el servidor desde lib/data. */
  products: Product[];
  content: HeaderContent;
};

export default function Navbar({ products, content }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  // Al cerrar con Esc el foco vuelve al botón, o se perdería en el body.
  const closeMenu = useCallback((returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  // El buscador ocupa toda la pantalla, así que el menú móvil no puede quedar
  // abierto debajo.
  const openSearch = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(true);
  }, []);

  // Al cerrar, el foco vuelve a la lupa: es donde estaba antes de abrir.
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    searchButtonRef.current?.focus();
  }, []);

  return (
    <>
      {/* Fondo sólido siempre: con el titular gigante del Hero y la imagen a
          sangre, una barra transparente deja los enlaces ilegibles. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="#inicio"
            className="font-serif text-xl uppercase tracking-widest text-foreground"
          >
            {content.logoText}
          </a>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {content.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm tracking-wide text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={openSearch}
              aria-label="Buscar prendas"
              aria-expanded={searchOpen}
              className="flex h-11 w-11 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
            >
              <Search size={18} aria-hidden="true" />
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              className="flex h-11 w-11 items-center justify-center text-foreground transition-colors md:hidden"
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="menu-movil"
            aria-label="Principal (móvil)"
            className="border-t border-border bg-background md:hidden"
          >
            <ul className="flex flex-col px-6 py-2">
              {content.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => closeMenu()}
                    className="block py-3 text-base text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {searchOpen && (
        <SearchOverlay products={products} onClose={closeSearch} />
      )}
    </>
  );
}
