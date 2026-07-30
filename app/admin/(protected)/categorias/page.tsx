import { Field, inputClass, PageHeader, Panel, StatusBadge, StatusSelect } from "@/components/admin/AdminUi";
import { createClient } from "@/lib/supabase/server";

import { saveCategory } from "../actions";

type PageProps = {
  searchParams?: Promise<{ edit?: string; new?: string }>;
};

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });
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
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(categories ?? []).map((category) => (
                <tr key={category.id} className="border-b border-[#33334f] last:border-0">
                  <td className="px-4 py-4 text-[#b9b9d4]">{category.id}</td>
                  <td className="px-4 py-4">{category.name}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{category.slug}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{category.display_order}</td>
                  <td className="px-4 py-4"><StatusBadge status={category.status} /></td>
                  <td className="px-4 py-4 text-right">
                    <a href={`/admin/categorias?edit=${category.id}`} className="text-[#7777ff]">
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
              <button className="bg-[#4b4bff] px-5 py-3 text-sm font-bold">Guardar</button>
            </form>
          </Panel>
        )}
      </div>
    </>
  );
}
