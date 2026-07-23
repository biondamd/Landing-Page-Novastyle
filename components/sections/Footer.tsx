// lucide 1.25 ya no incluye iconos de marca (Instagram/Facebook), así que se
// dibujan a mano con el mismo estilo de trazo (24px, stroke currentColor).
function Instagram({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Facebook({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// Enlace de pie: si `href` existe, es un destino real; si es null, la página
// aún no existe (fase 2) y se muestra como texto no interactivo con aviso, en
// vez de un href="#" que no lleva a ninguna parte.
type FooterLink = { label: string; href: string | null };

const LINK_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Tienda",
    links: [
      { label: "Novedades", href: null },
      { label: "Colecciones", href: "#colecciones" },
      { label: "Catálogo completo", href: "#catalogo" },
      { label: "Preventas", href: null },
      { label: "Liquidación", href: null },
    ],
  },
  {
    title: "Info",
    links: [
      { label: "Sobre nosotras", href: "#sobre-nosotras" },
      { label: "Cómo comprar", href: null },
      // "Tallas", no "talles": la tienda es peruana (docs 4.1).
      { label: "Tallas y medidas", href: null },
      { label: "Envíos y devoluciones", href: null },
      { label: "Preguntas frecuentes", href: null },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "hola@novastyle.pe", href: "mailto:hola@novastyle.pe" },
      { label: "WhatsApp", href: null },
      { label: "Instagram DM", href: null },
      { label: "Lunes a viernes 9-18h", href: null },
    ],
  },
];

const LEGAL: FooterLink[] = [
  { label: "Términos", href: null },
  { label: "Privacidad", href: null },
  { label: "Cookies", href: null },
];

function FooterItem({ link, className = "" }: { link: FooterLink; className?: string }) {
  if (link.href) {
    return (
      <a href={link.href} className={`transition-colors hover:text-accent ${className}`}>
        {link.label}
      </a>
    );
  }
  // Pendiente: texto, no enlace. `title` avisa; no engaña con un href muerto.
  return (
    <span className={`cursor-default text-white/40 ${className}`} title="Próximamente">
      {link.label}
    </span>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-foreground px-6 py-16 text-white/60">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="mb-4 font-serif text-2xl uppercase tracking-widest text-white">
              Novastyle
            </p>
            <p className="text-sm font-light leading-relaxed">
              Moda consciente, hecha a mano, diseñada para ti.
            </p>
            <div className="mt-6 flex gap-4">
              {/* TODO(fase-2): enlazar a los perfiles reales cuando existan. */}
              <span
                className="cursor-default transition-colors hover:text-accent"
                title="Próximamente"
                role="img"
                aria-label="Instagram (próximamente)"
              >
                <Instagram size={18} />
              </span>
              <span
                className="cursor-default transition-colors hover:text-accent"
                title="Próximamente"
                role="img"
                aria-label="Facebook (próximamente)"
              >
                <Facebook size={18} />
              </span>
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-5 font-mono text-xs uppercase tracking-widest text-white">
                {group.title}
              </p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterItem link={link} className="text-sm" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-wider">
            © {year} Novastyle · Todos los derechos reservados
          </p>
          <div className="flex gap-6">
            {LEGAL.map((link) => (
              <FooterItem
                key={link.label}
                link={link}
                className="font-mono text-[10px] uppercase tracking-wider"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}