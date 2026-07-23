import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { Collection } from "@/lib/types";

type CollectionsProps = {
  collections: Collection[];
};

export default function Collections({ collections }: CollectionsProps) {
  return (
    <section id="colecciones" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <span className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Temporadas
            </span>
            <h2 className="font-serif text-4xl font-medium text-foreground md:text-5xl">
              Nuestras colecciones
            </h2>
          </div>
          <a
            href="#catalogo"
            className="hidden border-b border-muted-foreground/30 pb-0.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground md:inline-block"
          >
            Ver todo
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {collections.map((collection, index) => (
            <Reveal key={collection.id} delay={index * 0.12}>
              {/* TODO(HU-08): al hacer clic, el catálogo debe filtrarse por esta
                  colección. Hasta que exista el filtro, solo lleva al catálogo. */}
              <a
                href="#catalogo"
                aria-label={`Ver la colección ${collection.name} en el catálogo`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={collection.image}
                    alt={`Prendas de la colección ${collection.name}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10"
                  />
                  <span className="absolute left-4 top-4 bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground">
                    {collection.tag}
                  </span>
                </div>

                <div className="pt-5">
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl font-medium text-foreground">
                      {collection.name}
                    </h3>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {collection.itemCount} prendas
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{collection.description}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}