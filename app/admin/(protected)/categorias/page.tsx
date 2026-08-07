import { Field, inputClass, PageHeader, Panel, StatusBadge, StatusSelect } from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { createClient } from "@/lib/supabase/server";
import { Pencil } from "lucide-react";

import { deleteCategory, saveCategory } from "../actions";

type PageProps = {
  searchParams?: Promise<{ edit?: string; new?: string }>;
};

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: categories }, { data: publishedProducts }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("products")
      .select("category_id")
      .eq("status", "published"),
  ]);
  const productCountByCategory = new Map<number, number>();
  for (const product of publishedProducts ?? []) {
    productCountByCategory.set(
      product.category_id,
      (productCountByCategory.get(product.category_id) ?? 0) + 1,
    );
  }
  const selected = params?.edit
    ? categories?.find((category) => String(category.id) === params.edit)
    : undefined;
  const editing = selected ?? null;

  return (
    <>
      <PageHeader
        title="Categorías"
        count={`${categories?.length ?? 0} entradas encontradas`}
        actionHref="/admin/categorias?new=1"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <Panel>
          <table className="w-full min-w-[720px] text-left">
            <thead className="text-xs uppercase text-[#aaaacd]">
              <tr className="border-b border-[#33334f]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(categories ?? []).map((category) => (
                <tr key={category.id} className="border-b border-[#33334f] last:border-0">
                  <td className="px-4 py-4 text-[#b9b9d4]">{category.id}</td>
                  <td className="px-4 py-4">{category.name}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{category.slug}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{category.display_order}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{productCountByCategory.get(category.id) ?? 0}</td>
                  <td className="px-4 py-4"><StatusBadge status={category.status} /></td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <a href={`/admin/categorias?edit=${category.id}`} className="inline-flex items-center gap-1 text-[#7777ff]">
                        <Pencil size={14} aria-hidden="true" />
                        Editar
                      </a>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={category.id} />
                        <DeleteButton
                          confirmMessage={`¿Eliminar la categoría "${category.name}"? No debe tener productos asociados.`}
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        {(params?.new || editing) && (
          <Panel>
            <h2 className="mb-6 text-2xl font-bold">
              {editing ? "Editar categoría" : "Crear categoría"}
            </h2>
            <form action={saveCategory} className="flex flex-col gap-5">
              <input type="hidden" name="id" value={editing?.id ?? ""} />
              <Field label="Nombre">
                <input name="name" defaultValue={editing?.name ?? ""} required className={inputClass} />
              </Field>
              <Field label="Orden">
                <input
                  name="display_order"
                  type="number"
                  defaultValue={editing?.display_order ?? (categories?.length ?? 0) + 1}
                  className={inputClass}
                />
              </Field>
              <Field label="Estado">
                <StatusSelect defaultValue={editing?.status ?? "published"} />
              </Field>
              <SubmitButton className="bg-[#4b4bff] px-5 py-3 text-sm font-bold" />
            </form>
          </Panel>
        )}
      </div>
    </>
  );
}
