import Image from "next/image";

import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  StatusSelect,
  textareaClass,
} from "@/components/admin/AdminUi";
import { createClient } from "@/lib/supabase/server";

import { saveAbout } from "../actions";

export default async function AboutAdminPage() {
  const supabase = await createClient();
  const [{ data: about }, { data: stats }, { data: values }] = await Promise.all([
    supabase.from("about_section").select("*").eq("id", true).single(),
    supabase.from("about_stats").select("*").order("display_order", { ascending: true }),
    supabase.from("about_values").select("*").order("display_order", { ascending: true }),
  ]);

  return (
    <>
      <PageHeader title="Nuestra historia" />
      <form action={saveAbout} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="flex flex-col gap-6">
          <input type="hidden" name="image_url" value={about?.image_url ?? ""} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Etiqueta superior">
              <input name="badge_text" defaultValue={about?.badge_text ?? ""} required className={inputClass} />
            </Field>
            <Field label="Título">
              <input name="title" defaultValue={about?.title ?? ""} required className={inputClass} />
            </Field>
          </div>
          <Field label="Texto">
            <textarea name="body" defaultValue={about?.body ?? ""} required className={`${textareaClass} min-h-52`} />
          </Field>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Imagen">
              <input name="image" type="file" accept="image/*" className={inputClass} />
            </Field>
            <Field label="Cita flotante">
              <input name="floating_quote" defaultValue={about?.floating_quote ?? ""} required className={inputClass} />
            </Field>
          </div>
          {about?.image_url ? (
            <Image src={about.image_url} alt="" width={220} height={160} className="h-36 w-52 object-cover" />
          ) : null}

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

          <div>
            <p className="mb-3 text-sm font-bold">Valores</p>
            <div className="flex flex-col border border-[#373753]">
              {(values ?? []).map((value) => (
                <div key={value.id} className="grid grid-cols-1 gap-4 border-b border-[#373753] p-4 last:border-0 md:grid-cols-[150px_1fr_1fr_90px]">
                  <input type="hidden" name="value_id" value={value.id} />
                  <select name={`value_icon:${value.id}`} defaultValue={value.icon} className={inputClass}>
                    <option value="leaf">Hoja</option>
                    <option value="scissors">Tijeras</option>
                    <option value="heart">Corazón</option>
                    <option value="map-pin">Ubicación</option>
                  </select>
                  <input name={`value_title:${value.id}`} defaultValue={value.title} className={inputClass} />
                  <textarea name={`value_description:${value.id}`} defaultValue={value.description} className={textareaClass} />
                  <label className="flex items-center gap-2 text-sm">
                    <input name={`value_active:${value.id}`} type="checkbox" defaultChecked={value.active} />
                    Activo
                  </label>
                  <input name={`value_order:${value.id}`} type="number" defaultValue={value.display_order} className={inputClass} />
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel>
          <p className="mb-4 text-xs font-bold uppercase text-[#aaaacd]">Entrada</p>
          <Field label="Estado">
            <StatusSelect defaultValue={about?.status ?? "published"} />
          </Field>
          <button className="mt-5 w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold">Guardar</button>
        </Panel>
      </form>
    </>
  );
}
