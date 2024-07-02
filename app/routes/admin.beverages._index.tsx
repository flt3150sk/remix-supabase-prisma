import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns/format";
import { db } from "~/lib/db.server";
import { path } from "~/lib/path";

export const loader = async () => {
  const data = {
    items: await db.beverage.findMany(),
  };

  return data;
};

export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Beverages</h2>
        <Link
          to={path.admin.beverageNew}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          New Beverage
        </Link>
      </div>
      <table className="w-full divide-y divide-gray-400">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">CreatedAt</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">
                <Link
                  to={path.admin.beverageEdit(item.id)}
                  className="text-blue-600"
                >
                  {item.name}
                </Link>
              </td>
              <td className="px-4 py-2">
                {format(new Date(item.createdAt), "yyyy年MM月dd日 HH時mm分")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
