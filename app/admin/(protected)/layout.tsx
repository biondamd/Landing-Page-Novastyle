import {
  BadgePercent,
  BookOpenText,
  Folder,
  Home,
  Image as ImageIcon,
  Layers,
  LogOut,
  Mail,
  Package,
  PanelTop,
  Tag,
  Text,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const NAV_GROUPS = [
  {
    title: "Contenido",
    links: [
      { href: "/admin", label: "Dashboard", icon: Home },
      { href: "/admin/categorias", label: "Categorías", icon: Tag },
      { href: "/admin/colecciones", label: "Colecciones", icon: Folder },
      { href: "/admin/productos", label: "Productos", icon: Package },
      { href: "/admin/promociones", label: "Promociones", icon: BadgePercent },
    ],
  },
  {
    title: "Secciones",
    links: [
      { href: "/admin/cabecera", label: "Cabecera", icon: PanelTop },
      { href: "/admin/portada", label: "Portada", icon: ImageIcon },
      { href: "/admin/comunidad", label: "Comunidad", icon: Mail },
      { href: "/admin/nuestra-historia", label: "Nuestra historia", icon: BookOpenText },
      { href: "/admin/pie-de-pagina", label: "Pie de página", icon: Layers },
    ],
  },
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#151522] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#33334f] bg-[#202033] lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-[#33334f] px-6">
          <Text size={22} aria-hidden="true" />
          <span className="text-xl font-bold">Contenido</span>
        </div>
        <nav className="px-5 py-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-8">
              <p className="mb-3 px-2 text-xs font-bold uppercase text-[#aaaacd]">
                {group.title}
              </p>
              <ul className="flex flex-col gap-1">
                {group.links.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-white transition-colors hover:bg-[#151522] hover:text-[#7575ff]"
                    >
                      <Icon size={17} aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <form action="/auth/signout" method="post" className="absolute inset-x-5 bottom-5">
          <button
            type="submit"
            className="flex w-full items-center gap-3 border border-[#444463] px-3 py-2 text-sm text-[#d8d8ef] transition-colors hover:border-[#7575ff] hover:text-white"
          >
            <LogOut size={16} aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="min-h-screen px-5 py-8 lg:ml-72 lg:px-12">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
