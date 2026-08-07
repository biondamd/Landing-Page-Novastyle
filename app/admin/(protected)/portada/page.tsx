import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  selectClass,
  StatusSelect,
  textareaClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { createClient } from "@/lib/supabase/server";

import { saveHero } from "../actions";

export default async function HeroAdminPage() {
  const supabase = await createClient();
  const [{ data: hero }, { data: ctas }, { data: stats }, { data: products }] = await Promise.all([
    supabase.from("hero_section").select("*").eq("id", true).single(),
    supabase.from("hero_ctas").select("*").order("display_order", { ascending: true }),
    supabase.from("hero_stats").select("*").order("display_order", { ascending: true }),
    supabase.from("products").select("id,name,status").order("name", { ascending: true }),
  ]);

  return (
    <>
      <PageHeader title="Portada" />
      <form action={saveHero} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Etiqueta superior">
              <input name="badge_text" defaultValue={hero?.badge_text ?? ""} required className={inputClass} />
            </Field>
            <Field label="Producto destacado">
              <select name="featured_product_id" defaultValue={hero?.featured_product_id ?? ""} className={selectClass}>
                <option value="">Elige un producto</option>
                {(products ?? []).map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="bg-[#181826] p-5">
            <p className="mb-4 text-sm font-bold">Título</p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Texto inicial">
                <input name="title_prefix" defaultValue={hero?.title_prefix ?? ""} required className={inputClass} />
              </Field>
              <Field label="Texto destacado">
                <input name="title_emphasis" defaultValue={hero?.title_emphasis ?? ""} required className={inputClass} />
              </Field>
              <Field label="Texto final">
                <input name="title_suffix" defaultValue={hero?.title_suffix ?? ""} required className={inputClass} />
              </Field>
            </div>
          </div>

          <Field label="Descripción">
            <textarea name="description" defaultValue={hero?.description ?? ""} required className={textareaClass} />
          </Field>

          <div>
            <p className="mb-3 text-sm font-bold">Botones</p>
            <div className="flex flex-col border border-[#373753]">
              {(ctas ?? []).map((cta) => (
                <div key={cta.id} className="grid grid-cols-1 gap-4 border-b border-[#373753] p-4 last:border-0 md:grid-cols-[1fr_1fr_100px_90px]">
                  <input type="hidden" name="cta_id" value={cta.id} />
                  <input name={`cta_label:${cta.id}`} defaultValue={cta.label} className={inputClass} />
                  <input name={`cta_href:${cta.id}`} defaultValue={cta.href} className={inputClass} />
                  <input name={`cta_order:${cta.id}`} type="number" defaultValue={cta.display_order} className={inputClass} />
                  <label className="flex items-center gap-2 text-sm">
                    <input name={`cta_active:${cta.id}`} type="checkbox" defaultChecked={cta.active} />
                    Activo
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Estadísticas</p>
            <div className="flex flex-col border border-[#373753]">
              {(stats ?? []).map((stat) => (
                <div key={stat.id} className="grid grid-cols-1 gap-4 border-b border-[#373753] p-4 last:border-0 md:grid-cols-[1fr_1fr_100px_90px]">
                  <input type="hidden" name="stat_id" value={stat.id} />
                  <input name={`stat_value:${stat.id}`} defaultValue={stat.value} className={inputClass} />
                  <input name={`stat_label:${stat.id}`} defaultValue={stat.label} className={inputClass} />
                  <input name={`stat_order:${stat.id}`} type="number" defaultValue={stat.display_order} className={inputClass} />
                  <label className="flex items-center gap-2 text-sm">
                    <input name={`stat_active:${stat.id}`} type="checkbox" defaultChecked={stat.active} />
                    Activo
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <p className="mb-4 text-xs font-bold uppercase text-[#aaaacd]">Entrada</p>
          <Field label="Estado">
            <StatusSelect defaultValue={hero?.status ?? "published"} />
          </Field>
          <SubmitButton className="mt-5 w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold" />
        </Panel>
      </form>
    </>
  );
}
