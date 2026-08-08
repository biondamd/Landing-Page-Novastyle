import { redirect } from "next/navigation";

import { PageHeader, Panel, StatusBadge } from "@/components/admin/AdminUi";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams?: Promise<{ edit?: string; new?: string }>;
};

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  price: number;
  status: string;
  categories?: { name: string } | { name: string }[] | null;
};

function categoryName(category: ProductRow["categories"]) {
  if (Array.isArray(category)) return category[0]?.name;
  return category?.name;
}

export default async function ProductsAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;

  if (params?.new) redirect("/admin/productos/nuevo");
  if (params?.edit) redirect(`/admin/productos/${params.edit}/editar`);

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id,name,slug,price,status,categories(name)")
    .order("id", { ascending: true });

  const rows = (products ?? []) as unknown as ProductRow[];

  return (
    <>
      <PageHeader
        title="Productos"
        count={`${rows.length} entradas encontradas`}
        actionHref="/admin/productos/nuevo"
        actionPlacement="tableEnd"
      />

      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead className="text-xs uppercase text-[#aaaacd]">
            <tr className="border-b border-[#33334f]">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id} className="border-b border-[#33334f] last:border-0">
                <td className="px-4 py-4 text-[#b9b9d4]">{product.id}</td>
                <td className="px-4 py-4">{product.name}</td>
                <td className="px-4 py-4 text-[#b9b9d4]">{product.slug}</td>
                <td className="px-4 py-4 text-[#b9b9d4]">{categoryName(product.categories)}</td>
                <td className="px-4 py-4">S/ {Number(product.price).toFixed(2)}</td>
                <td className="px-4 py-4"><StatusBadge status={product.status} /></td>
                <td className="px-4 py-4 text-right">
                  <a href={`/admin/productos/${product.id}/editar`} className="text-[#7777ff]">
                    Editar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
