"use client";

import { WORKSPACE_NAVIGATION } from "@/config/workspace-navigation";
import { AppShell } from "./app-shell";

/** Client component because the menu holds icon components, which a server layout cannot pass as props. */
export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  return <AppShell navigation={WORKSPACE_NAVIGATION}>{children}</AppShell>;
}
