import {
  Field,
  inputClass,
  PageHeader,
  Panel,
  StatusBadge,
  StatusSelect,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/AdminFeedback";
import { createClient } from "@/lib/supabase/server";

import { savePromotion } from "../actions";

type PageProps = {
  searchParams?: Promise<{ edit?: string; new?: string }>;
};

type PromotionRow = {
  id: number;
  name: string;
  percentage: number;
  scope: "product" | "category" | "collection";
  starts_at: string;
  ends_at: string;
  status: string;
};

function datetimeValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 16);
}

export default async function PromotionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: promotions }, { data: products }, { data: categories }, { data: collections }] =
    await Promise.all([
      supabase.from("promotions").select("*").order("starts_at", { ascending: false }),
      supabase.from("products").select("id,name").order("name", { ascending: true }),
      supabase.from("categories").select("id,name").order("display_order", { ascending: true }),
      supabase.from("collections").select("id,name").order("display_order", { ascending: true }),
    ]);

  const rows = (promotions ?? []) as PromotionRow[];
  const selected = params?.edit
    ? rows.find((promotion) => String(promotion.id) === params.edit)
    : undefined;
  const editing = selected ?? null;

  return (
    <>
      <PageHeader
        title="Promociones"
        count={`${rows.length} entradas encontradas`}
        actionHref="/admin/promociones?new=1"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_520px]">
        <Panel>
          <table className="w-full min-w-[860px] text-left">
            <thead className="text-xs uppercase text-[#aaaacd]">
              <tr className="border-b border-[#33334f]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descuento</th>
                <th className="px-4 py-3">Alcance</th>
                <th className="px-4 py-3">Vigencia</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((promotion) => (
                <tr key={promotion.id} className="border-b border-[#33334f] last:border-0">
                  <td className="px-4 py-4 text-[#b9b9d4]">{promotion.id}</td>
                  <td className="px-4 py-4">{promotion.name}</td>
                  <td className="px-4 py-4">{promotion.percentage}%</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">{promotion.scope}</td>
                  <td className="px-4 py-4 text-[#b9b9d4]">
                    {new Date(promotion.starts_at).toLocaleDateString("es-PE")} -{" "}
                    {new Date(promotion.ends_at).toLocaleDateString("es-PE")}
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={promotion.status} /></td>
                  <td className="px-4 py-4 text-right">
                    <a href={`/admin/promociones?edit=${promotion.id}`} className="text-[#7777ff]">
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
              {editing ? "Editar promoción" : "Crear promoción"}
            </h2>
            <form action={savePromotion} className="flex flex-col gap-5">
              <input type="hidden" name="id" value={editing?.id ?? ""} />
              <Field label="Nombre">
                <input name="name" defaultValue={editing?.name ?? ""} required className={inputClass} />
              </Field>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Porcentaje">
                  <input name="percentage" type="number" min="1" max="99" defaultValue={editing?.percentage ?? 10} required className={inputClass} />
                </Field>
                <Field label="Alcance">
                  <select name="scope" defaultValue={editing?.scope ?? "product"} className={inputClass}>
                    <option value="product">Producto</option>
                    <option value="category">Categoría</option>
                    <option value="collection">Colección</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <Field label="Producto objetivo">
                  <select name="product_target_id" className={inputClass}>
                    <option value="">Selecciona si el alcance es producto</option>
                    {(products ?? []).map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Categoría objetivo">
                  <select name="category_target_id" className={inputClass}>
                    <option value="">Selecciona si el alcance es categoría</option>
                    {(categories ?? []).map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Colección objetivo">
                  <select name="collection_target_id" className={inputClass}>
                    <option value="">Selecciona si el alcance es colección</option>
                    {(collections ?? []).map((collection) => (
                      <option key={collection.id} value={collection.id}>{collection.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Inicio">
                  <input name="starts_at" type="datetime-local" defaultValue={datetimeValue(editing?.starts_at)} required className={inputClass} />
                </Field>
                <Field label="Fin">
                  <input name="ends_at" type="datetime-local" defaultValue={datetimeValue(editing?.ends_at)} required className={inputClass} />
                </Field>
              </div>
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
