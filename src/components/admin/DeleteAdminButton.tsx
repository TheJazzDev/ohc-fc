"use client";

import { useState, useTransition } from "react";
import { deleteAdmin } from "@/actions/admins";

export function DeleteAdminButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Remove this admin? They will no longer be able to sign in.")) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteAdmin(id);
            if (result) setError(result);
          });
        }}
        className="cursor-pointer text-sm text-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Removing..." : "Remove"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
