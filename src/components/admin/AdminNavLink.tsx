"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex h-[34px] items-center rounded-md px-3 font-heading text-[13px] font-semibold tracking-[0.08em] uppercase no-underline transition-colors ${
        active ? "bg-accent text-surface" : "text-muted hover:text-fg"
      }`}
    >
      {label}
    </Link>
  );
}
