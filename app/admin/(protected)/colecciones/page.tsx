import { Field, inputClass, PageHeader, Panel, StatusBadge, StatusSelect, textareaClass } from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { ImagePickerField, type AdminImage } from "@/components/admin/ImagePickerField";
import { createClient } from "@/lib/supabase/server";
import { Pencil } from "lucide-react";

import { saveCollection } from "../actions";

type PageProps = {
  searchParams?: Promise<{ edit?: string; new?: string }>;
};

export default async function CollectionsAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: collections }, { data: productImages }, { data: about }, { data: publishedProducts }] = await Promise.all([
    supabase.from("collections").select("*").order("display_order", { ascending: true }),
    supabase.from("product_images").select("image_url, alt").order("display_order", { ascending: true }),
    supabase.from("about_section").select("image_url").eq("id", true).maybeSingle(),
    supabase
      .from("products")
      .select("collection_id")
      .eq("status", "published")
      .not("collection_id", "is", null),
  ]);
  const productCountByCollection = new Map<number, number>();
  for (const product of publishedProducts ?? []) {
    if (!product.collection_id) continue;
    productCountByCollection.set(
      product.collection_id,
      (productCountByCollection.get(product.collection_id) ?? 0) + 1,
    );
  }
  const selected = params?.edit
    ? collections?.find((collection) => String(collection.id) === params.edit)
    : undefined;
  const editing = selected ?? null;
  const libraryImages: AdminImage[] = [
    ...(collections ?? []).map((collection) => ({
      url: collection.image_url,
      name: collection.name,
    })),
    ...(productImages ?? []).map((image) => ({
      url: image.image_url,
      name: image.alt ?? undefined,
    })),
    ...(about?.image_url ? [{ url: about.image_url, name: "Nuestra historia" }] : []),
  ];

  return (
    <>
      <PageHeader
        title="Colecciones"
        count={`${collections?.length ?? 0} entradas encontradas`}
        actionHref="/admin/colecciones?new=1"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_520px]">
        <Panel>
          <table className="w-full min-w-[760px] text-left">
            <thead className="text-xs uppercase text-[#aaaacd]">
              <tr className="border-b border-[#33334f]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Etiqueta</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(collections ?? []).map((collection) => (
                <tr key={collection.id} className="border-b border-[#33334f] last:border-0">
                  <td className="px-4 py-4 text-[#b9b9d4]">{collection.id}</td>
                  <td className="px-4 py-4">{collection.name}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{collection.slug}</td>
                  <td className="px-4 py-4">{collection.badge_label}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{productCountByCollection.get(collection.id) ?? 0}</td>
                  <td className="px-4 py-4"><StatusBadge status={collection.status} /></td>
                  <td className="px-4 py-4 text-right">
                    <a href={`/admin/colecciones?edit=${collection.id}`} className="inline-flex items-center gap-1 text-[#7777ff]">
                      <Pencil size={14} aria-hidden="true" />
                      Editar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        {(params?.new || editing) && (
          <Panel>
            <h2 className="mb-6 text-2xl font-bold">
              {editing ? "Editar colección" : "Crear colección"}
            </h2>
            <form action={saveCollection} className="flex flex-col gap-5">
              <input type="hidden" name="id" value={editing?.id ?? ""} />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nombre">
                  <input name="name" defaultValue={editing?.name ?? ""} required className={inputClass} />
                </Field>
                <Field label="Etiqueta">
                  <input name="badge_label" defaultValue={editing?.badge_label ?? ""} required className={inputClass} />
                </Field>
              </div>
              <Field label="Descripción">
                <textarea name="description" defaultValue={editing?.description ?? ""} required className={textareaClass} />
              </Field>
              <ImagePickerField
                label="Imagen"
                required
                initialImages={editing?.image_url ? [{ url: editing.image_url, name: editing.name }] : []}
                libraryImages={libraryImages}
              />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Orden">
                  <input name="display_order" type="number" defaultValue={editing?.display_order ?? (collections?.length ?? 0) + 1} className={inputClass} />
                </Field>
                <Field label="Estado">
                  <StatusSelect defaultValue={editing?.status ?? "published"} />
                </Field>
              </div>
              <SubmitButton className="bg-[#4b4bff] px-5 py-3 text-sm font-bold" />
            </form>
          </Panel>
        )}
      </div>
    </>
  );
}
