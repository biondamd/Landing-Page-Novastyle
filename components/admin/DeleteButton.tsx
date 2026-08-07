"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type DeleteButtonProps = {
  /** Texto de la confirmación antes de enviar. */
  confirmMessage: string;
  label?: string;
};

/**
 * Botón de eliminar para usar dentro de un <form action={deleteX}>. Pide
 * confirmación antes de enviar y muestra estado de carga.
 */
export function DeleteButton({ confirmMessage, label = "Eliminar" }: DeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className="inline-flex items-center gap-1 text-[#e08a8a] transition-colors hover:text-[#ff9d9d] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 size={14} aria-hidden="true" />
      )}
      {label}
    </button>
  );
}
