"use client";

import { useTransition } from "react";
import { deactivatePlayer } from "@/actions/players";
import { ADMIN_ROW_ACTION_MUTED } from "./admin-ui";

export function DeactivatePlayerButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Remove ${name} from the roster? They'll disappear from the squad page and matchday lineups.`)) {
          startTransition(() => {
            deactivatePlayer(id);
          });
        }
      }}
      className={`${ADMIN_ROW_ACTION_MUTED} cursor-pointer border-0 bg-transparent disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}
