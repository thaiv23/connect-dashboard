import type { Metadata } from "next";

import { BuyerIntentsView } from "@/features/buyer-intents/components/buyer-intents-view";
import { listBuyerIntents } from "@/features/buyer-intents/api";
import { WORKSPACE_ROLES, requireRole } from "@/server/auth/dal";

export const metadata: Metadata = { title: "Buyer Intent Feed" };

export default async function BuyerIntentsPage() {
  await requireRole(WORKSPACE_ROLES);
  const initialData = await listBuyerIntents();
  return <BuyerIntentsView initialData={initialData} />;
}
