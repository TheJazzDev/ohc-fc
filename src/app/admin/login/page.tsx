"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <span className="mb-1.5 font-heading text-xs font-medium tracking-[0.14em] text-muted uppercase">OHC FC</span>
      <h1 className="mb-8 font-heading text-3xl font-bold uppercase sm:text-4xl">Admin login</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          autoFocus
          className="h-14 rounded-md border border-fg/20 bg-surface-2 px-4 text-base text-fg outline-none focus:border-accent sm:text-lg"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="h-14 rounded-md border border-fg/20 bg-surface-2 px-4 text-base text-fg outline-none focus:border-accent sm:text-lg"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-14 cursor-pointer rounded-md bg-accent px-4 font-heading text-base font-bold tracking-wide text-surface uppercase disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
