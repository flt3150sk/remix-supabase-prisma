import { Outlet } from "@remix-run/react";
import { AdminHeader } from "~/components/admin/Header";
import { AdminSidebar } from "~/components/admin/Sidebar";

export default function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="py-2 px-4 min-h-[calc(100vh_-_48px)] flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
