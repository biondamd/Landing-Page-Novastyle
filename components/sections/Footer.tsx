import type { FooterContent, FooterLink as FooterLinkType } from "@/lib/types";

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

function FooterItem({ link, className = "" }: { link: FooterLinkType; className?: string }) {
  if (link.href) {
    return (
      <a href={link.href} className={`transition-colors hover:text-accent ${className}`}>
        {link.label}
      </a>
    );
  }
  // Pendiente: texto, no enlace. `title` avisa; no engaña con un href muerto.
  // white/50 (5.26:1) queda más tenue que los enlaces activos, pero pasa AA.
  return (
    <span className={`cursor-default text-white/50 ${className}`} title="Próximamente">
      {link.label}
    </span>
  );
}

type FooterProps = {
  content: FooterContent;
};

export default function Footer({ content }: FooterProps) {
  const year = new Date().getFullYear();
  const socialLinks = new Map(content.socialLinks.map((link) => [link.platform, link]));

  return (
    <footer id="contacto" className="bg-foreground px-6 py-16 text-white/60">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="mb-4 font-serif text-2xl uppercase tracking-widest text-white">
              {content.logoText}
            </p>
            <p className="text-sm font-light leading-relaxed">
              {content.description}
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.get("instagram")?.href ? (
                <a
                  href={socialLinks.get("instagram")?.href ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-colors hover:text-accent"
                >
                  <Instagram size={18} />
                </a>
              ) : null}
              {socialLinks.get("facebook")?.href ? (
                <a
                  href={socialLinks.get("facebook")?.href ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition-colors hover:text-accent"
                >
                  <Facebook size={18} />
                </a>
              ) : null}
            </div>
          </div>

          {content.groups.map((group) => (
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
            {content.legalLinks.map((link) => (
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
