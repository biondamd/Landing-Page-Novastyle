import Reveal from "@/components/ui/Reveal";
import type { Promotion } from "@/lib/types";

type PromotionsProps = {
  promotions: Promotion[];
};

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "En Vestidos", "Colección Noche"… según el alcance de la promoción. */
function scopeLabel(promotion: Promotion): string {
  if (!promotion.targetLabel) return "En toda la tienda";
  if (promotion.scope === "collection") return `Colección ${promotion.targetLabel}`;
  return `En ${promotion.targetLabel}`;
}

export default function Promotions({ promotions }: PromotionsProps) {
  // Sin promociones vigentes no se muestra el apartado.
  if (promotions.length === 0) return null;

  return (
    <section id="promociones" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <span className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-accent-strong">
            Ofertas vigentes
          </span>
          <h2 className="font-serif text-4xl font-medium text-foreground md:text-5xl">
            Promociones
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion, index) => (
            <Reveal key={promotion.id} delay={index * 0.1}>
              <article className="flex h-full flex-col justify-between gap-6 border border-border bg-card p-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-5xl font-medium text-foreground">
                    -{promotion.percentage}%
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent-strong">
                    Descuento
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground">
                    {promotion.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {scopeLabel(promotion)}
                  </p>
                </div>

                <p className="border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Válido hasta el {dateFormatter.format(new Date(promotion.endsAt))}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
