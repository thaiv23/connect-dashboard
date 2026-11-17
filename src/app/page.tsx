import { redirect } from "next/navigation";

import { LOGIN_PATH, ROLE_HOME } from "@/features/auth/config";
import { getCurrentUser } from "@/server/auth/dal";

/** The Admin dashboard moved to /admin/dashboard; / sends each role to its own home. */
export default async function Home() {
  const user = await getCurrentUser();
  redirect(user ? ROLE_HOME[user.role] : LOGIN_PATH);
}
