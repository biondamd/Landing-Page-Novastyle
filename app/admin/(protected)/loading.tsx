import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-[70vh] bg-[#151522] px-5 py-8 text-white lg:px-12">
      <div className="mx-auto flex max-w-7xl items-center gap-3 border border-[#373753] bg-[#222234] px-5 py-4 text-sm font-bold text-[#d8d8ef]">
        <Loader2 size={18} className="animate-spin text-[#8f8fff]" aria-hidden="true" />
        Cargando contenido...
      </div>
    </div>
  );
}
