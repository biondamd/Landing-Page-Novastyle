import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  StatusSelect,
  textareaClass,
} from "@/components/admin/AdminUi";
import { createClient } from "@/lib/supabase/server";

import { saveNewsletter } from "../actions";

export default async function NewsletterAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("newsletter_section").select("*").eq("id", true).single();

  return (
    <>
      <PageHeader title="Comunidad" />
      <form action={saveNewsletter} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Etiqueta superior">
            <input name="badge_text" defaultValue={data?.badge_text ?? ""} required className={inputClass} />
          </Field>
          <Field label="Título">
            <input name="title" defaultValue={data?.title ?? ""} required className={inputClass} />
          </Field>
          <Field label="Descripción">
            <textarea name="description" defaultValue={data?.description ?? ""} required className={textareaClass} />
          </Field>
          <Field label="Texto del botón">
            <input name="button_text" defaultValue={data?.button_text ?? ""} required className={inputClass} />
          </Field>
          <Field label="Nota de privacidad">
            <input name="privacy_note" defaultValue={data?.privacy_note ?? ""} required className={inputClass} />
          </Field>
        </Panel>
        <Panel>
          <p className="mb-4 text-xs font-bold uppercase text-[#aaaacd]">Entrada</p>
          <Field label="Estado">
            <StatusSelect defaultValue={data?.status ?? "published"} />
          </Field>
          <button className="mt-5 w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold">Guardar</button>
        </Panel>
      </form>
    </>
  );
}
