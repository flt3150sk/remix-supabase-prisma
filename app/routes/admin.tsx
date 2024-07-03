import { Outlet, redirect } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
import { AdminHeader } from "~/components/admin/Header";
import { AdminSidebar } from "~/components/admin/Sidebar";
import { destroySession, getSession } from "~/lib/session.server";
import { createSupabaseServerClient } from "~/supabase/createSupabaseServerClient";
import { db } from "~/lib/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    throw redirect("/signin");
  }

  const supabase = createSupabaseServerClient(request);
  const userResponse = await supabase.auth.getUser(session.get("access_token"));

  if (!userResponse?.data?.user) {
    return redirect("/signin");
  }

  const user = await db.profile.findUnique({
    where: { id: userResponse.data.user.id },
  });

  if (user?.role !== "admin") {
    return redirect("/signin");
  }

  return { user: userResponse?.data?.user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const supabase = createSupabaseServerClient(request);

  const { error } = await supabase.auth.signOut();

  if (error) {
    return;
  }

  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/signin", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

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
