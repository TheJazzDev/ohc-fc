"use client";

import { useTransition } from "react";
import { deleteNewsArticle } from "@/actions/news";
import { ADMIN_ROW_ACTION_MUTED } from "./admin-ui";

export function DeleteNewsButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${title}"? This can't be undone.`)) {
          startTransition(() => {
            deleteNewsArticle(id);
          });
        }
      }}
      className={`${ADMIN_ROW_ACTION_MUTED} cursor-pointer border-0 bg-transparent disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
