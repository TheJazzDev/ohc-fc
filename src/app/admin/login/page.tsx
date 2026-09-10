"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { LogoMark } from "@/components/layout/LogoMark";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[radial-gradient(130%_110%_at_50%_0%,oklch(0.235_0.02_260)_0%,oklch(0.16_0.01_260)_55%,oklch(0.13_0.01_260)_100%)] px-4 py-16">
      <LightBeams />
      <Grain opacity={0.45} />

      <div className="animate-reveal-up relative flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 text-fg no-underline">
          <LogoMark />
          <span className="font-heading text-lg font-bold tracking-wide uppercase">OHC FC</span>
        </Link>

        <div className="w-full rounded-md border border-fg/10 bg-surface-2/80 p-6 shadow-raised backdrop-blur-sm sm:p-8">
          <span className="mb-1.5 block font-heading text-xs font-medium tracking-[0.14em] text-muted uppercase">Admin</span>
          <h1 className="mb-6 font-heading text-2xl font-bold uppercase sm:text-3xl">Sign in</h1>
          <form action={formAction} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              autoFocus
              className="h-12 rounded-md border border-fg/20 bg-surface px-4 text-base text-fg outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 sm:h-14 sm:text-lg"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="h-12 rounded-md border border-fg/20 bg-surface px-4 text-base text-fg outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 sm:h-14 sm:text-lg"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="mt-2 h-12 cursor-pointer rounded-md bg-accent px-4 font-heading text-base font-bold tracking-wide text-surface uppercase transition hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:text-lg"
            >
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <Link href="/" className="font-heading text-xs font-medium tracking-[0.1em] text-muted uppercase no-underline hover:text-fg">
          &larr; Back to the site
        </Link>
      </div>
    </div>
  );
}
