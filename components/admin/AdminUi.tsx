import Link from "next/link";

export function PageHeader({
  title,
  count,
  actionHref,
}: {
  title: string;
  count?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-start">
      <div>
        <Link href="/admin" className="mb-4 inline-block text-sm text-[#7b7bff]">
          ← Volver
        </Link>
        <h1 className="text-4xl font-bold">{title}</h1>
        {count ? <p className="mt-4 text-lg text-[#b9b9d4]">{count}</p> : null}
      </div>
      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center bg-[#4b4bff] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6565ff]"
        >
          + Crear nueva entrada
        </Link>
      ) : null}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`border border-[#373753] bg-[#222234] p-6 ${className}`}>
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-bold text-white">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "border border-[#555574] bg-transparent px-4 py-3 text-base font-normal text-white outline-none placeholder:text-[#aaaacd] focus:border-[#7777ff]";

export const textareaClass = `${inputClass} min-h-32 resize-y`;

export function StatusSelect({ defaultValue = "published" }: { defaultValue?: string }) {
  return (
    <select name="status" defaultValue={defaultValue} className={inputClass}>
      <option value="draft">Borrador</option>
      <option value="published">Publicado</option>
    </select>
  );
}

export function SaveBar() {
  return (
    <aside className="border border-[#373753] bg-[#222234] p-5">
      <p className="mb-4 text-xs font-bold uppercase text-[#aaaacd]">Entrada</p>
      <button
        type="submit"
        className="mb-3 w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6565ff]"
      >
        Publicar
      </button>
      <button
        type="submit"
        className="w-full border border-[#555574] px-5 py-3 text-sm font-bold text-[#bfc0ff] transition-colors hover:border-[#7777ff] hover:text-white"
      >
        Guardar
      </button>
    </aside>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex border px-3 py-1 text-sm font-bold ${
        published
          ? "border-green-400/40 text-green-400"
          : "border-sky-400/40 text-sky-300"
      }`}
    >
      {published ? "Publicado" : "Borrador"}
    </span>
  );
}
