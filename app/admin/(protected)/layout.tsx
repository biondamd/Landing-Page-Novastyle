import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#151522] text-white">
      <AdminSidebar />

      <main className="min-h-screen px-5 py-8 lg:ml-72 lg:px-12">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
