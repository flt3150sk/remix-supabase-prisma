import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/lib/db.server";

export const loader = async () => {
  const data = {
    items: await db.beverage.findMany(),
  };

  return data;
};

export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Beverages</h2>
        <Link
          to="/beverages/new"
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          New Beverage
        </Link>
      </div>
      <ul className="space-y-1">
        {data.items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/beverages/${item.id}/edit`}
              className="text-blue-600"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
