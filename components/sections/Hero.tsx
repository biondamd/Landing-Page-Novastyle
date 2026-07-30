import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { formatPrice } from "@/lib/format";
import type { HeroContent, Product } from "@/lib/types";

type HeroProps = {
  content: HeroContent;
  featured: Product;
};

export default function Hero({ content, featured }: HeroProps) {
  return (
    <section id="inicio" className="flex min-h-screen flex-col pt-20">
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-stretch px-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center py-16 lg:pr-16">
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-accent-strong">
              {content.badgeText}
            </span>

            <h1
              className="mb-8 font-serif font-medium leading-[1.05] text-foreground"
              style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}
            >
              {content.titlePrefix}
              <br />
              <em>{content.titleEmphasis}</em>
              <br />
              {content.titleSuffix}
            </h1>

            <p className="mb-10 max-w-md text-lg font-light leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          </div>

          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {content.ctaButtons.map((button) => {
              const primary = button.style === "primary";
              return (
                <a
                  key={`${button.label}-${button.href}`}
                  href={button.href}
                  target={button.openInNewTab ? "_blank" : undefined}
                  rel={button.openInNewTab ? "noreferrer" : undefined}
                  className={
                    primary
                      ? "group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-sm tracking-wide text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-foreground"
                      : "inline-flex items-center gap-3 border border-foreground/20 px-8 py-4 text-sm tracking-wide text-foreground transition-colors hover:border-foreground"
                  }
                >
                  {button.label}
                  {primary && (
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </a>
              );
            })}
          </div>

          <dl
            className="mt-14 flex items-center gap-8 border-t border-border pt-10 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            {/* column-reverse: el dato va arriba, pero en el DOM manda el término
                (dt) antes que su valor (dd), que es como se lee en voz alta. */}
            {content.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="font-serif text-2xl font-medium text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-muted lg:min-h-[600px]">
          <Image
            src={featured.image}
            alt={`${featured.name} de la colección Verano 2026`}
            fill
            // Es la imagen LCP de la página. En Next 16 `priority` está
            // deprecado: `preload` inserta el <link> en el <head>.
            preload
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent"
          />

          <div className="absolute bottom-8 left-8 max-w-[220px] bg-background/90 px-5 py-4 backdrop-blur-sm">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Nuevo ingreso
            </p>
            <p className="font-serif text-base font-medium text-foreground">
              {featured.name}
            </p>
            {/* El precio sale del catálogo, nunca escrito a mano. */}
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatPrice(featured.price)}
            </p>
          </div>
        </div>
      </div>

      {/* La cinta se duplica para que el bucle no tenga costura; la copia no se lee. */}
      <div className="mt-8 overflow-hidden border-y border-border py-3">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0"
            >
              {content.marqueeItems.map((item) => (
                <li
                  key={item}
                  className="whitespace-nowrap px-8 font-mono text-xs uppercase tracking-widest text-muted-foreground"
                >
                  {item} <span aria-hidden="true">·</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
