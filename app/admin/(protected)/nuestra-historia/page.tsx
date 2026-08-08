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
import { ImagePickerField, type AdminImage } from "@/components/admin/ImagePickerField";
import { createClient } from "@/lib/supabase/server";

import { saveAbout } from "../actions";

export default async function AboutAdminPage() {
  const supabase = await createClient();
  const [{ data: about }, { data: stats }, { data: values }, { data: collections }, { data: productImages }] = await Promise.all([
    supabase.from("about_section").select("*").eq("id", true).single(),
    supabase.from("about_stats").select("*").order("display_order", { ascending: true }),
    supabase.from("about_values").select("*").order("display_order", { ascending: true }),
    supabase.from("collections").select("name, image_url").order("display_order", { ascending: true }),
    supabase.from("product_images").select("image_url, alt").order("display_order", { ascending: true }),
  ]);
  const libraryImages: AdminImage[] = [
    ...(about?.image_url ? [{ url: about.image_url, name: "Nuestra historia" }] : []),
    ...(collections ?? []).map((collection) => ({
      url: collection.image_url,
      name: collection.name,
    })),
    ...(productImages ?? []).map((image) => ({
      url: image.image_url,
      name: image.alt ?? undefined,
    })),
  ];

  return (
    <>
      <PageHeader title="Nuestra historia" />
      <form action={saveAbout} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="flex flex-col gap-6">
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
          <ImagePickerField
            label="Imagen"
            required
            initialImages={about?.image_url ? [{ url: about.image_url, name: "Nuestra historia" }] : []}
            libraryImages={libraryImages}
          />
          <Field label="Cita flotante">
            <input name="floating_quote" defaultValue={about?.floating_quote ?? ""} required className={inputClass} />
          </Field>

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
                  <select name={`value_icon:${value.id}`} defaultValue={value.icon} className={selectClass}>
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
          <SubmitButton className="mt-5 w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold" />
        </Panel>
      </form>
    </>
  );
}
