const links = [
  { href: "#hero", label: "Inicio" },
  { href: "#collections", label: "Colecciones" },
  { href: "#catalog", label: "Catálogo" },
  { href: "#about", label: "About" },
];

// Navegación básica con anclas para saltar entre secciones.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-[rgba(11,13,16,0.82)] backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#hero" className="text-sm font-semibold uppercase tracking-[0.35em]">
          Novastyle
        </a>
        <ul className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted">
          {links.map((link) => (
            <li key={link.href}>
              <a className="transition-colors hover:text-foreground" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
