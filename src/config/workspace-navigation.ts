import { House } from "lucide-react";

import { NAVIGATION, type NavGroup } from "./navigation";

/**
 * Admin sections copied into the user workspace, in menu order.
 * Automation Center and System stay on the admin menu only.
 */
const COPIED_GROUP_LABELS = [
  "OVERVIEW",
  "STORE DISCOVERY",
  "BUYER INTENT DISCOVERY",
  "DATA INTELLIGENCE",
  "DATA MANAGEMENT",
] as const;

function copyAdminGroup(label: (typeof COPIED_GROUP_LABELS)[number]): NavGroup {
  const group = NAVIGATION.find((entry) => entry.label === label);
  if (!group) {
    throw new Error(`Admin navigation is missing the "${label}" group.`);
  }

  return {
    label: group.label,
    number: group.number,
    items: group.items.map((item) =>
      label === "OVERVIEW" && item.label === "Dashboard Overview" ? { ...item, href: "/workspace/overview" } : { ...item },
    ),
  };
}

/**
 * User Workspace menu.
 * Home replaces Buyer Intent Feed. Dashboard Overview, Store Discovery,
 * Buyer Intent Discovery, Data Intelligence, and Data Management match the admin menu.
 */
export const WORKSPACE_NAVIGATION: NavGroup[] = [
  {
    label: "",
    items: [{ label: "Home", icon: House, href: "/workspace/home" }],
  },
  ...COPIED_GROUP_LABELS.map(copyAdminGroup),
];
