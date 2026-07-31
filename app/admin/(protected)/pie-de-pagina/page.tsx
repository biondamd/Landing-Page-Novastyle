import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  StatusSelect,
  textareaClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { createClient } from "@/lib/supabase/server";

import { saveFooter } from "../actions";

export default async function FooterAdminPage() {
  const supabase = await createClient();
  const [{ data: footer }, { data: groups }, { data: links }, { data: socials }] = await Promise.all([
    supabase.from("footer_section").select("*").eq("id", true).single(),
    supabase.from("footer_link_groups").select("*").order("display_order", { ascending: true }),
    supabase.from("footer_links").select("*").order("display_order", { ascending: true }),
    supabase.from("footer_social_links").select("*"),
  ]);

  const groupLinks = links?.filter((link) => link.kind === "group") ?? [];
  const legalLinks = links?.filter((link) => link.kind === "legal") ?? [];

  return (
    <>
      <PageHeader title="Pie de página" />
      <form action={saveFooter} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Texto del logo">
              <input name="logo_text" defaultValue={footer?.logo_text ?? ""} required className={inputClass} />
            </Field>
            <Field label="Descripción">
              <textarea name="description" defaultValue={footer?.description ?? ""} required className={textareaClass} />
            </Field>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Redes sociales</p>
            <div className="flex flex-col border border-[#373753]">
              {(socials ?? []).map((social) => (
                <div key={social.id} className="grid grid-cols-1 gap-4 border-b border-[#373753] p-4 last:border-0 md:grid-cols-[150px_1fr_90px]">
                  <input type="hidden" name="social_id" value={social.id} />
                  <p className="py-3 capitalize">{social.platform}</p>
                  <input name={`social_href:${social.id}`} defaultValue={social.href ?? ""} className={inputClass} placeholder="https://" />
                  <label className="flex items-center gap-2 text-sm">
                    <input name={`social_active:${social.id}`} type="checkbox" defaultChecked={social.active} />
                    Activo
                  </label>
                </div>
              ))}
            </div>
          </div>

          {(groups ?? []).map((group) => (
            <div key={group.id}>
              <input type="hidden" name="group_id" value={group.id} />
              <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-[1fr_100px_90px]">
                <input name={`group_title:${group.id}`} defaultValue={group.title} className={inputClass} />
                <input name={`group_order:${group.id}`} type="number" defaultValue={group.display_order} className={inputClass} />
                <label className="flex items-center gap-2 text-sm">
                  <input name={`group_active:${group.id}`} type="checkbox" defaultChecked={group.active} />
                  Activo
                </label>
              </div>
              <div className="flex flex-col border border-[#373753]">
                {groupLinks.filter((link) => link.group_id === group.id).map((link) => (
                  <div key={link.id} className="grid grid-cols-1 gap-4 border-b border-[#373753] p-4 last:border-0 md:grid-cols-[1fr_1fr_90px_90px]">
                    <input type="hidden" name="link_id" value={link.id} />
                    <input name={`link_label:${link.id}`} defaultValue={link.label} className={inputClass} />
                    <input name={`link_href:${link.id}`} defaultValue={link.href ?? ""} className={inputClass} placeholder="URL o ancla" />
                    <input name={`link_order:${link.id}`} type="number" defaultValue={link.display_order} className={inputClass} />
                    <label className="flex items-center gap-2 text-sm">
                      <input name={`link_active:${link.id}`} type="checkbox" defaultChecked={link.active} />
                      Activo
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="mb-3 text-sm font-bold">Legales</p>
            <div className="flex flex-col border border-[#373753]">
              {legalLinks.map((link) => (
                <div key={link.id} className="grid grid-cols-1 gap-4 border-b border-[#373753] p-4 last:border-0 md:grid-cols-[1fr_1fr_90px_90px]">
                  <input type="hidden" name="link_id" value={link.id} />
                  <input name={`link_label:${link.id}`} defaultValue={link.label} className={inputClass} />
                  <input name={`link_href:${link.id}`} defaultValue={link.href ?? ""} className={inputClass} placeholder="URL requerida para mostrarse" />
                  <input name={`link_order:${link.id}`} type="number" defaultValue={link.display_order} className={inputClass} />
                  <label className="flex items-center gap-2 text-sm">
                    <input name={`link_active:${link.id}`} type="checkbox" defaultChecked={link.active} />
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
            <StatusSelect defaultValue={footer?.status ?? "published"} />
          </Field>
          <SubmitButton className="mt-5 w-full bg-[#4b4bff] px-5 py-3 text-sm font-bold" />
        </Panel>
      </form>
    </>
  );
}
