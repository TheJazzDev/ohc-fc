"use client";

import { useActionState } from "react";

const INPUT_CLASS =
  "rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base";

export function AdminUserForm({
  action,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
}) {
  const [error, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        Name
        <input name="name" required className={INPUT_CLASS} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Email
        <input name="email" type="email" required className={INPUT_CLASS} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Password <span className="text-xs text-muted">(at least 8 characters)</span>
        <input name="password" type="password" minLength={8} required className={INPUT_CLASS} />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 cursor-pointer rounded-md bg-accent px-4 py-2.5 font-heading text-sm font-bold tracking-wide text-surface uppercase disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      >
        {pending ? "Saving..." : "Add admin"}
      </button>
    </form>
  );
}
