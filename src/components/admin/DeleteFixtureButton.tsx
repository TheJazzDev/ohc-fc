"use client";

import { useTransition } from "react";
import { deleteFixture } from "@/actions/fixtures";

export function DeleteFixtureButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this fixture? This also removes its saved lineup.")) {
          startTransition(() => {
            deleteFixture(id);
          });
        }
      }}
      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete fixture"}
    </button>
  );
}
