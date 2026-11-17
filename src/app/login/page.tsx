import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ROLE_HOME } from "@/features/auth/config";
import { LoginForm } from "@/features/auth/components/login-form";
import { getCurrentUser } from "@/server/auth/dal";

export const metadata: Metadata = { title: { absolute: "Log in" } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect(ROLE_HOME[user.role]);

  const { expired } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <LoginForm sessionExpired={expired === "1"} />
    </main>
  );
}
