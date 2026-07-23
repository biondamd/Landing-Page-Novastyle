import { Heart, Leaf, Scissors } from "lucide-react";
import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import { SECTION_IMAGES } from "@/lib/mock-data";

const STATS = [
  { value: "6", label: "Mujeres" },
  { value: "2.400+", label: "Clientas felices" },
  { value: "100%", label: "Hecho a mano" },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Materiales conscientes",
    description:
      "Usamos linos, algodones orgánicos y telas naturales que cuidan tanto tu piel como el planeta.",
  },
  {
    icon: Scissors,
    title: "Producción local",
    description:
      "Cada prenda se confecciona a mano por talleristas locales. Apoyamos el trabajo justo y la economía cercana.",
  },
  {
    icon: Heart,
    title: "Diseño inclusivo",
    // "Tallas", no "talles": la tienda es peruana (ver docs 4.1).
    description:
      "Tallas del XS al 3XL. Porque la moda bonita no debería tener límites de talla.",
  },
];

export default function About() {
  return (
    <section id="sobre-nosotras" className="bg-foreground px-6 py-24 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal direction="left">
          <span className="mb-5 block font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Nuestra historia
          </span>
          <h2 className="mb-8 font-serif text-4xl font-medium leading-[1.1] md:text-5xl">
            Nació de un sueño,
            <br />
            <em>creció con amor</em>
          </h2>
          <p className="mb-5 font-light leading-relaxed text-white/70">
            Novastyle nació en 2022 desde el taller de casa de Valentina, en Lima, con una
            máquina de coser heredada y la certeza de que la moda peruana podía ser
            diferente: más honesta, más bonita, más cercana.
          </p>
          <p className="font-light leading-relaxed text-white/70">
            Hoy somos un equipo de 6 mujeres apasionadas que diseñan, cosen y empacan cada
            pedido con el mismo cuidado del primer día. Cada prenda lleva horas de trabajo,
            materiales elegidos con criterio y mucho cariño.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {STATS.map((stat) => (
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
                src={SECTION_IMAGES.about}
                alt="Taller de producción de Novastyle en Lima"
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
                Moda que se siente bien por dentro y por fuera.
              </blockquote>
            </figure>
          </div>

          <ul className="mt-10 flex flex-col gap-5">
            {VALUES.map(({ icon: Icon, title, description }) => (
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
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}