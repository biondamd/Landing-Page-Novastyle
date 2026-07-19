import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex flex-col rounded-3xl border border-border p-8 sm:p-10 gap-4"
    >
      <p className="text-xs uppercase tracking-[0.4em] text-muted">Hero</p>
      <div className="flex gap-3">
        <Button type="button">Boton Primario</Button>
        <Button type="button" variant="secondary">
          Boton Secundario
        </Button>
      </div>

    </section>
  );
}
