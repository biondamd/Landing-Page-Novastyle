"use client";

import {
  BadgePercent,
  BookOpenText,
  Folder,
  Home,
  Image as ImageIcon,
  Layers,
  LogOut,
  Menu,
  Package,
  PanelTop,
  Tag,
  Text,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      { href: "/admin/nuestra-historia", label: "Nuestra historia", icon: BookOpenText },
      { href: "/admin/pie-de-pagina", label: "Pie de página", icon: Layers },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-[#33334f] px-6">
        <span className="text-xl font-bold">Novastyle</span>
      </div>
      <nav className="px-5 py-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="mb-3 px-2 text-xs font-bold uppercase text-[#aaaacd]">
              {group.title}
            </p>
            <ul className="flex flex-col gap-1">
              {group.links.map(({ href, label, icon: Icon }) => {
                const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-[#151522] hover:text-[#7575ff] ${active ? "bg-[#151522] text-[#8585ff]" : "text-white"
                        }`}
                    >
                      <Icon size={17} aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                );
              })}
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
    </>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#33334f] bg-[#202033] px-5 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">Novastyle</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-[#444463] p-2 text-[#d8d8ef] transition-colors hover:border-[#7575ff] hover:text-white"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="admin-mobile-sidebar"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#33334f] bg-[#202033] lg:block">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/60"
            aria-label="Cerrar menú"
          />
          <aside
            id="admin-mobile-sidebar"
            className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] border-r border-[#33334f] bg-[#202033] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 border border-[#444463] p-2 text-[#d8d8ef] transition-colors hover:border-[#7575ff] hover:text-white"
              aria-label="Cerrar menú"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
