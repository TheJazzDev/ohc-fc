"use client";

import { useTransition } from "react";
import { deleteTrainingSession } from "@/actions/trainings";

export function DeleteTrainingButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this training session? This also removes its attendance record.")) {
          startTransition(() => {
            deleteTrainingSession(id);
          });
        }
      }}
      className="cursor-pointer text-sm text-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete session"}
    </button>
  );
}
