import { Field, inputClass, PageHeader, Panel, StatusSelect } from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { createClient } from "@/lib/supabase/server";

import { saveHeader } from "../actions";

export default async function HeaderAdminPage() {
  const supabase = await createClient();
  const [{ data: header }, { data: links }] = await Promise.all([
    supabase.from("site_header").select("*").eq("id", true).single(),
    supabase.from("header_links").select("*").order("display_order", { ascending: true }),
  ]);

  return (
    <>
      <PageHeader title="Cabecera" />
      <form action={saveHeader} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Texto del logo">
              <input name="logo_text" defaultValue={header?.logo_text ?? "Novastyle"} required className={inputClass} />
            </Field>
            <Field label="Estado">
              <StatusSelect defaultValue={header?.status ?? "published"} />
            </Field>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Navegación</p>
            <div className="flex flex-col border border-[#373753]">
              {(links ?? []).map((link) => (
                <div key={link.href} className="grid grid-cols-1 gap-4 border-b border-[#373753] p-4 last:border-0 md:grid-cols-[1fr_120px_90px]">
                  <input name={`label:${link.href}`} defaultValue={link.label} className={inputClass} />
                  <input name={`order:${link.href}`} type="number" defaultValue={link.display_order} className={inputClass} />
                  <label className="flex items-center gap-2 text-sm">
                    <input name={`active:${link.href}`} type="checkbox" defaultChecked={link.active} />
                    Activo
                  </label>
                  <p className="text-xs text-[#aaaacd] md:col-span-3">Ancla fija: {link.href}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <p className="mb-4 text-xs font-bold uppercase text-[#aaaacd]">Entrada</p>
          <SubmitButton className="w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold" />
        </Panel>
      </form>
    </>
  );
}
