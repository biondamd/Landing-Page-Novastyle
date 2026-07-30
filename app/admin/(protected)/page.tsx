import { Edit3, FileCheck2, Folder, Package, Tag } from "lucide-react";
import Link from "next/link";

import { Panel, StatusBadge } from "@/components/admin/AdminUi";
import { createClient } from "@/lib/supabase/server";

const CARDS = [
  { table: "products", label: "Productos", href: "/admin/productos", icon: Package },
  { table: "collections", label: "Colecciones", href: "/admin/colecciones", icon: Folder },
  { table: "categories", label: "Categorías", href: "/admin/categorias", icon: Tag },
  { table: "promotions", label: "Promociones", href: "/admin/promociones", icon: FileCheck2 },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const counts = await Promise.all(
    CARDS.map((card) =>
      supabase.from(card.table).select("id", { count: "exact", head: true }),
    ),
  );

  const { data: products } = await supabase
    .from("products")
    .select("id,name,status,updated_at")
    .order("updated_at", { ascending: false })
    .limit(5);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Hola</h1>
        <p className="mt-4 text-lg text-[#b9b9d4]">Bienvenido a tu panel de administración</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">
        {CARDS.map(({ label, href, icon: Icon }, index) => (
          <Link key={label} href={href}>
            <Panel className="transition-colors hover:border-[#7777ff]">
              <Icon size={20} className="mb-6 text-[#7777ff]" aria-hidden="true" />
              <p className="text-3xl font-bold">{counts[index].count ?? 0}</p>
              <p className="mt-2 text-sm text-[#b9b9d4]">{label}</p>
            </Panel>
          </Link>
        ))}
      </div>

      <Panel>
        <div className="mb-6 flex items-center gap-3">
          <Edit3 size={17} className="text-[#b9b9d4]" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase text-[#b9b9d4]">
            Últimos productos editados
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="text-xs uppercase text-[#aaaacd]">
              <tr className="border-b border-[#33334f]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((product) => (
                <tr key={product.id} className="border-b border-[#33334f] last:border-0">
                  <td className="px-4 py-4 text-[#b9b9d4]">{product.id}</td>
                  <td className="px-4 py-4">{product.name}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-4 text-[#b9b9d4]">
                    {new Date(product.updated_at).toLocaleString("es-PE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
