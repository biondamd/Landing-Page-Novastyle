import { Mail } from "lucide-react";

import type { FooterContent, Link, SocialLink } from "@/lib/types";

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

function Tiktok({ size = 18 }: { size?: number }) {
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
      <path d="M9 18a4 4 0 1 1 0-8" />
      <path d="M13 2v13a4 4 0 0 1-4 4" />
      <path d="M13 6a6 6 0 0 0 5 3" />
    </svg>
  );
}

function Whatsapp({ size = 18 }: { size?: number }) {
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
      <path d="M3 21l1.6-4.8A8 8 0 1 1 8 19.4L3 21z" />
      <path d="M9 10c.5 2 2 3.5 4 4l1.5-1.5" />
    </svg>
  );
}

function FooterItem({ link, className = "" }: { link: Link; className?: string }) {
  return (
    <a href={link.href} className={`transition-colors hover:text-accent ${className}`}>
      {link.label}
    </a>
  );
}

function SocialItem({ link }: { link: SocialLink }) {
  const icons = {
    instagram: Instagram,
    facebook: Facebook,
    tiktok: Tiktok,
    whatsapp: Whatsapp,
    email: Mail,
  };
  const Icon = icons[link.platform];

  return (
    <a
      href={link.url}
      aria-label={link.platform}
      className="transition-colors hover:text-accent"
    >
      <Icon size={18} />
    </a>
  );
}

type FooterProps = {
  content: FooterContent;
};

export default function Footer({ content }: FooterProps) {
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
              {content.socialLinks.map((link) => (
                <SocialItem key={`${link.platform}-${link.url}`} link={link} />
              ))}
            </div>
          </div>

          {content.columns.map((group) => (
            <div key={group.title}>
              <p className="mb-5 font-mono text-xs uppercase tracking-widest text-white">
                {group.title}
              </p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <FooterItem link={link} className="text-sm" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-wider">
            {content.copyrightText}
          </p>
          <div className="flex gap-6">
            {content.bottomLinks.map((link) => (
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
