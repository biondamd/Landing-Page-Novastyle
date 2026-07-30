import { Heart, Leaf, MapPin, Scissors } from "lucide-react";
import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { AboutContent } from "@/lib/types";

const ICONS = {
  leaf: Leaf,
  scissors: Scissors,
  heart: Heart,
  "map-pin": MapPin,
};

type AboutProps = {
  content: AboutContent;
};

export default function About({ content }: AboutProps) {
  const paragraphs = content.body.split(/\n{2,}/).filter(Boolean);

  return (
    <section id="sobre-nosotras" className="bg-foreground px-6 py-24 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal direction="left">
          <span className="mb-5 block font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {content.badgeText}
          </span>
          <h2 className="mb-8 font-serif text-4xl font-medium leading-[1.1] md:text-5xl">
            {content.title}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`${index < paragraphs.length - 1 ? "mb-5" : ""} font-light leading-relaxed text-white/70`}
            >
              {paragraph}
            </p>
          ))}

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {content.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs text-white/60">{stat.label}</dt>
                <dd className="font-serif text-3xl font-medium text-accent">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal direction="right" delay={0.15} className="flex flex-col gap-6">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden bg-white/5">
              <Image
                src={content.image}
                alt="Taller de producción de Novastyle"
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            {/* Cita superpuesta. El margen del contenedor deja sitio a los -6
                para que no se salga por el borde en móvil. */}
            <figure className="absolute -bottom-6 -left-6 max-w-[200px] bg-accent p-6 text-accent-foreground">
              <p className="font-serif text-2xl font-medium leading-none">&ldquo;</p>
              <blockquote className="mt-1 text-sm leading-snug">
                {content.floatingQuote}
              </blockquote>
            </figure>
          </div>

          <ul className="mt-10 flex flex-col gap-5">
            {content.values.map(({ icon, title, description }) => {
              const Icon = ICONS[icon] ?? Leaf;
              return (
                <li key={title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-white/20">
                    <Icon size={16} className="text-accent" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mb-1 text-sm font-medium text-white">{title}</p>
                    <p className="text-sm font-light leading-relaxed text-white/60">
                      {description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
