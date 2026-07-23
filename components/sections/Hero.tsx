import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="flex flex-col gap-4 rounded-3xl border border-border p-8 pt-24 sm:p-10 sm:pt-24"
    >
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Inicio</p>
      <div className="flex gap-3">
        <Button type="button">Boton Primario</Button>
        <Button type="button" variant="secondary">
          Boton Secundario
        </Button>
      </div>

    </section>
  );
}
