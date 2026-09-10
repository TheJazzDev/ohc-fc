import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { LogoMark } from "@/components/layout/LogoMark";
import { AdminNavLink } from "@/components/admin/AdminNavLink";

// Every screen under here is authenticated, per-user, always-fresh admin
// data — never statically prerender it (also sidesteps the database not
// being reachable during the build step, e.g. when DATABASE_URL is a
// Vercel "Sensitive" env var withheld from builds).
export const dynamic = "force-dynamic";

const NAV_ITEMS = [
  { href: "/admin/players", label: "Players" },
  { href: "/admin/fixtures", label: "Fixtures" },
  { href: "/admin/trainings", label: "Trainings" },
  { href: "/admin/admins", label: "Admins" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="flex h-14 items-center justify-between gap-6 border-b border-fg/10 bg-surface px-4 sm:px-10">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-heading text-sm font-bold tracking-wide uppercase">OHC FC · Admin</span>
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="cursor-pointer font-heading text-xs font-medium tracking-[0.1em] text-muted uppercase hover:text-fg"
          >
            Sign out
          </button>
        </form>
      </header>
      <nav className="flex items-center gap-1 overflow-x-auto border-b border-fg/10 bg-surface px-4 py-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-none rounded-md px-3 py-1.5 font-heading text-xs font-semibold tracking-[0.08em] text-muted uppercase no-underline hover:text-fg"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <main>{children}</main>
    </div>
  );
}
