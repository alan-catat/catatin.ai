// utils/flattenMenus.ts
import { sidebarMenus, NavItem } from "@/config/sidebarMenus";

export type FlatMenuItem = {
  name: string;
  path: string;
  role: "admin" | "user" | "Tutorial";
  breadcrumb: string; // contoh "Master Data → Kategori"
};

function flatten(
  items: NavItem[],
  role: "admin" | "user" | "Tutorial",
  parentName?: string
): FlatMenuItem[] {
  return items.flatMap((item) => {
    const currentBreadcrumb = parentName
      ? `${parentName} → ${item.name}`
      : item.name;

    const base = item.path
      ? [{ name: item.name, path: item.path, role, breadcrumb: currentBreadcrumb }]
      : [];

    const subs = item.subItems
      ? flatten(item.subItems, role, currentBreadcrumb)
      : [];

    return [...base, ...subs];
  });
}

// ambil menu sesuai role
export function getMenusByRole(role: "admin" | "user" | "Tutorial"): FlatMenuItem[] {
  return flatten(sidebarMenus[role], role);
}
