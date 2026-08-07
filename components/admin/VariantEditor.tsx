"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export type Variant = {
  label: string;
  available: boolean;
  swatch?: string;
};

type VariantEditorProps = {
  /** Nombre del input oculto que lee saveProduct (p. ej. "sizes" o "colors"). */
  name: string;
  legend: string;
  /** Muestra el campo de color y su vista previa. */
  withSwatch?: boolean;
  addLabel: string;
  placeholder: string;
  initial: Variant[];
};

const inputClass =
  "w-full rounded-lg border border-[#33334f] bg-[#111124] px-3 py-2 text-sm text-white outline-none focus:border-[#4b4bff]";

export default function VariantEditor({
  name,
  legend,
  withSwatch = false,
  addLabel,
  placeholder,
  initial,
}: VariantEditorProps) {
  const [rows, setRows] = useState<Variant[]>(initial);

  const update = (index: number, patch: Partial<Variant>) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows((current) => [...current, { label: "", available: true, swatch: withSwatch ? "#c8a97a" : undefined }]);
  };

  const removeRow = (index: number) => {
    setRows((current) => current.filter((_, i) => i !== index));
  };

  // Solo se envían filas con etiqueta; saveProduct ignora el resto.
  const payload = JSON.stringify(rows.filter((row) => row.label.trim().length > 0));

  return (
    <fieldset className="rounded-xl border border-[#33334f] p-4">
      <legend className="px-2 text-sm font-bold text-white">{legend}</legend>
      <input type="hidden" name={name} value={payload} readOnly />

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <p className="text-sm text-[#8a8ab0]">Sin variantes. Añade la primera.</p>
        )}

        {rows.map((row, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2">
            <input
              value={row.label}
              onChange={(event) => update(index, { label: event.target.value })}
              placeholder={placeholder}
              className={`${inputClass} min-w-32 flex-1`}
              aria-label={`${legend}: etiqueta ${index + 1}`}
            />

            {withSwatch && (
              <>
                <span
                  aria-hidden="true"
                  className="h-9 w-9 shrink-0 rounded-lg border border-[#33334f]"
                  style={{ background: row.swatch || "#111124" }}
                />
                <input
                  value={row.swatch ?? ""}
                  onChange={(event) => update(index, { swatch: event.target.value })}
                  placeholder="#c8a97a o gradiente CSS"
                  className={`${inputClass} min-w-40 flex-1`}
                  aria-label={`${legend}: color ${index + 1}`}
                />
              </>
            )}

            <label className="flex shrink-0 items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={row.available}
                onChange={(event) => update(index, { available: event.target.checked })}
                className="h-5 w-5"
              />
              Disponible
            </label>

            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={`Eliminar ${legend.toLowerCase()} ${index + 1}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#33334f] text-[#c96a6a] hover:border-[#c96a6a]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#4b4bff] px-4 py-2 text-sm font-bold text-[#9a9aff] hover:bg-[#4b4bff] hover:text-white"
        >
          <Plus size={15} aria-hidden="true" />
          {addLabel}
        </button>
      </div>
    </fieldset>
  );
}
