"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children?: React.ReactNode;
  pendingText?: string;
  className?: string;
};

export function SubmitButton({
  children = "Guardar",
  pendingText = "Guardando...",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} inline-flex items-center justify-center gap-2 text-white transition-colors hover:bg-[#6565ff] disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {pending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
      <span>{pending ? pendingText : children}</span>
    </button>
  );
}

export function SuccessBanner({ message = "Cambios guardados correctamente" }: { message?: string }) {
  const searchParams = useSearchParams();

  if (searchParams.get("saved") !== "1") return null;

  return (
    <div className="mb-6 flex items-start gap-3 border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-200">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
