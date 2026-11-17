"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { LOGIN_PATH } from "@/features/auth/config";
import { cn } from "@/lib/utils";

export function LogoutButton({ labelClassName, onClick, ...props }: React.ComponentProps<"button"> & { labelClassName?: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function logout(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace(LOGIN_PATH);
      router.refresh();
    }
  }

  const Icon = pending ? Loader2 : LogOut;

  return (
    <button type="button" {...props} onClick={logout} disabled={pending}>
      <Icon className={cn("size-[18px] shrink-0", pending && "animate-spin")} aria-hidden />
      <span className={labelClassName}>Log out</span>
    </button>
  );
}
