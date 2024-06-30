import { Outlet } from "@remix-run/react";

export default function IndexRoute() {
  return (
    <>
      <header className="bg-orange-600 py-2">
        <div className="container mx-auto">
          <h1 className="text-white text-2xl">BEVERAGE</h1>
        </div>
      </header>
      <main className="py-2">
        <Outlet />
      </main>
    </>
  );
}
