import Link from "next/link";
import { X } from "lucide-react";

import { SubmitButton, SuccessBanner } from "./AdminFeedback";

const actionClass =
  "inline-flex items-center justify-center bg-[#4b4bff] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6565ff]";

export function PageHeader({
  title,
  count,
  actionHref,
  actionPlacement = "end",
}: {
  title: string;
  count?: string;
  actionHref?: string;
  actionPlacement?: "end" | "inline" | "tableEnd";
}) {
  const action = actionHref ? (
    <Link href={actionHref} className={actionClass}>
      + Crear nueva entrada
    </Link>
  ) : null;
  const inlineMeta = count || (actionPlacement !== "end" && action);

  return (
    <>
      <div
        className={`mb-10 flex flex-col gap-6 ${
          actionPlacement === "end" ? "justify-between md:flex-row md:items-start" : ""
        }`}
      >
        <div>
          <Link href="/admin" className="mb-4 inline-block text-sm text-[#7b7bff]">
            ← Volver
          </Link>
          <h1 className="text-4xl font-bold">{title}</h1>
          {inlineMeta ? (
            <div
              className={`mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center ${
                actionPlacement === "tableEnd" ? "sm:justify-between" : ""
              }`}
            >
              {count ? <p className="text-lg text-[#b9b9d4]">{count}</p> : null}
              {actionPlacement !== "end" ? action : null}
            </div>
          ) : null}
        </div>
        {actionPlacement === "end" ? action : null}
      </div>
      <SuccessBanner />
    </>
  );
}

export function AdminModal({
  title,
  closeHref,
  children,
  maxWidth = "max-w-3xl",
}: {
  title: string;
  closeHref: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={`max-h-[90vh] w-full overflow-y-auto border border-[#373753] bg-[#191927] shadow-2xl ${maxWidth}`}
      >
        <div className="flex items-center justify-between border-b border-[#373753] px-5 py-4">
          <h2 id="admin-modal-title" className="text-xl font-bold">
            {title}
          </h2>
          <Link
            href={closeHref}
            className="border border-[#555574] p-2 text-[#d8d8ef] hover:border-[#7777ff]"
            aria-label="Cerrar"
          >
            <X size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="p-5">{children}</div>
      </section>
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

export const selectClass =
  "border border-[#555574] bg-[#222234] px-4 py-3 text-base font-normal text-white outline-none [color-scheme:dark] focus:border-[#7777ff] [&>option]:bg-[#222234] [&>option]:text-white";

export const textareaClass = `${inputClass} min-h-32 resize-y`;

export function StatusSelect({ defaultValue = "published" }: { defaultValue?: string }) {
  return (
    <select name="status" defaultValue={defaultValue} className={selectClass}>
      <option value="draft">Borrador</option>
      <option value="published">Publicado</option>
    </select>
  );
}

export function SaveBar() {
  return (
    <aside className="border border-[#373753] bg-[#222234] p-5">
      <p className="mb-4 text-xs font-bold uppercase text-[#aaaacd]">Entrada</p>
      <SubmitButton className="mb-3 w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold">
        Publicar
      </SubmitButton>
      <SubmitButton
        className="w-full border border-[#555574] px-5 py-3 text-sm font-bold !text-[#bfc0ff] hover:border-[#7777ff] hover:!bg-transparent hover:!text-white"
      >
        Guardar
      </SubmitButton>
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
