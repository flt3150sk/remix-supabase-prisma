import { Link, useLocation } from "@remix-run/react";
import { path } from "~/lib/path";
import { RiUser2Fill, RiDrinksFill, RiBreadFill } from "@remixicon/react";

const sidebarItems = [
  {
    label: "Users",
    to: path.admin.userIndex,
    regex: /\/admin\/users/,
    icon: RiUser2Fill,
  },
  {
    label: "Beverages",
    to: path.admin.beverageIndex,
    regex: /\/admin\/beverages/,
    icon: RiDrinksFill,
  },
  {
    label: "Snacks",
    to: path.admin.snackIndex,
    regex: /\/admin\/snacks/,
    icon: RiBreadFill,
  },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="border-r-2">
      <nav className="h-full">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className={`px-4 py-2 min-w-48 hover:text-orange-400 transition-all flex items-center gap-2 ${
                  item.regex.test(location.pathname) ? "bg-orange-100" : ""
                }`}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
