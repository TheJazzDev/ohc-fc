"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { toLondonDateTimeLocal } from "@/lib/format-kickoff";
import { slugify } from "@/lib/slugify";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_H1, ADMIN_INPUT, ADMIN_LABEL } from "./admin-ui";

type AdminNewsFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  kind?: string;
  excerpt?: string;
  body?: string;
  byline?: string | null;
  publishedAt?: Date;
  published?: boolean;
  competition?: string | null;
  ourScore?: number | null;
  theirScore?: number | null;
  startingXi?: string | null;
  subs?: string | null;
};

export function AdminNewsForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: AdminNewsFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const isEdit = Boolean(initialValues?.id);
  const formId = "admin-news-form";

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [kind, setKind] = useState(initialValues?.kind ?? "CLUB_NEWS");
  const [published, setPublished] = useState(initialValues?.published ?? true);
  const isMatchReport = kind === "MATCH_REPORT";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <Link href="/admin/news" className="flex items-center gap-1.5 font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase no-underline hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to news
          </Link>
          <h1 className={ADMIN_H1}>{isEdit ? "Edit article" : "Add article"}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/news" className={ADMIN_BUTTON_SECONDARY}>
            Cancel
          </Link>
          <button type="submit" form={formId} disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : "Save article"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form id={formId} action={formAction} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <input type="hidden" name="published" value={published ? "on" : ""} />

        <div className={`${ADMIN_CARD} flex flex-col gap-5`}>
          <span className={ADMIN_LABEL}>Article</span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Title</span>
              <input
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                required
                className={ADMIN_INPUT}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Slug</span>
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                required
                className={`${ADMIN_INPUT} font-mono text-sm`}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={ADMIN_LABEL}>Excerpt</span>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={initialValues?.excerpt ?? ""}
              placeholder="One or two sentences shown on the card and feed."
              required
              className={`${ADMIN_INPUT} h-auto resize-y py-2.5 leading-relaxed`}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={ADMIN_LABEL}>
              Body <span className="text-muted/80 normal-case">· separate paragraphs with a blank line</span>
            </span>
            <textarea
              name="body"
              rows={12}
              defaultValue={initialValues?.body ?? ""}
              required
              className={`${ADMIN_INPUT} h-auto resize-y py-3 leading-relaxed`}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={ADMIN_LABEL}>
              Byline <span className="text-muted/80 normal-case">· optional</span>
            </span>
            <input name="byline" defaultValue={initialValues?.byline ?? ""} placeholder="By Ade Okafor, club media" className={ADMIN_INPUT} />
          </label>

          {isMatchReport && (
            <>
              <div className="h-px bg-fg/10" />
              <span className={ADMIN_LABEL}>Match report details</span>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={ADMIN_LABEL}>Competition</span>
                  <input
                    name="competition"
                    defaultValue={initialValues?.competition ?? ""}
                    placeholder="FULL TIME · LEAGUE"
                    className={ADMIN_INPUT}
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className={ADMIN_LABEL}>OHC FC</span>
                    <input name="ourScore" type="number" min={0} defaultValue={initialValues?.ourScore ?? ""} className={ADMIN_INPUT} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={ADMIN_LABEL}>Opponent</span>
                    <input name="theirScore" type="number" min={0} defaultValue={initialValues?.theirScore ?? ""} className={ADMIN_INPUT} />
                  </label>
                </div>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className={ADMIN_LABEL}>Starting XI</span>
                <input
                  name="startingXi"
                  defaultValue={initialValues?.startingXi ?? ""}
                  placeholder="Mensah; Coker, Osei, Bello, Nwosu; ..."
                  className={ADMIN_INPUT}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={ADMIN_LABEL}>
                  Subs <span className="text-muted/80 normal-case">· optional</span>
                </span>
                <input name="subs" defaultValue={initialValues?.subs ?? ""} placeholder="Subs: Farrell, Musa, ..." className={ADMIN_INPUT} />
              </label>
            </>
          )}
        </div>

        <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
          <span className={ADMIN_LABEL}>Publishing</span>
          <label className="flex flex-col gap-1.5">
            <span className={ADMIN_LABEL}>Kind</span>
            <select name="kind" value={kind} onChange={(e) => setKind(e.target.value)} className={`${ADMIN_INPUT} cursor-pointer`}>
              <option value="CLUB_NEWS">Club news</option>
              <option value="MATCH_REPORT">Match report</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ADMIN_LABEL}>Published date &amp; time</span>
            <input
              type="datetime-local"
              name="publishedAtLocal"
              defaultValue={initialValues?.publishedAt ? toLondonDateTimeLocal(initialValues.publishedAt) : toLondonDateTimeLocal(new Date())}
              required
              className={`${ADMIN_INPUT} font-heading font-medium`}
              style={{ colorScheme: "dark" }}
            />
          </label>
          <div className="flex flex-col gap-2">
            <span className={ADMIN_LABEL}>Status</span>
            <div className="grid grid-cols-2 gap-0.5 rounded-md border border-fg/12 bg-surface p-[3px]">
              {(["Draft", "Published"] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPublished(label === "Published")}
                  className={`h-9 cursor-pointer rounded-md font-heading text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                    (label === "Published") === published ? "bg-fg text-surface" : "text-muted hover:text-fg"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-xs leading-relaxed text-muted">
              {published ? "Live on the public site." : "Hidden from the public site until published."}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
