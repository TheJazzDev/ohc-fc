import Link from "next/link";
import { logoutAction } from "@/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="flex h-14 items-center justify-between gap-4 border-b border-fg/10 bg-surface px-4 sm:px-8">
        <div className="flex items-center gap-5">
          <Link href="/admin/players" className="font-heading text-sm font-bold tracking-wide uppercase no-underline">
            OHC FC · Admin
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin/players" className="font-heading text-xs font-medium tracking-[0.1em] text-muted uppercase no-underline hover:text-accent">
              Players
            </Link>
            <Link href="/admin/fixtures" className="font-heading text-xs font-medium tracking-[0.1em] text-muted uppercase no-underline hover:text-accent">
              Fixtures
            </Link>
            <Link href="/admin/admins" className="font-heading text-xs font-medium tracking-[0.1em] text-muted uppercase no-underline hover:text-accent">
              Admins
            </Link>
          </nav>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="cursor-pointer font-heading text-xs font-medium tracking-[0.1em] text-muted uppercase hover:text-accent"
          >
            Sign out
          </button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  );
}
