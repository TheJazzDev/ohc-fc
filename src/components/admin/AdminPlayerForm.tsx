"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { isTokenRequestFailure, photoUploadMessage, preparePhoto, readinessMessage } from "@/lib/image/photo-upload";
import { PlayerFlipCard } from "@/components/squad/PlayerFlipCard";
import { initialsFromName } from "@/lib/initials";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_H1, ADMIN_INPUT, ADMIN_LABEL } from "./admin-ui";

const POSITIONS = [
  { value: "GK", label: "Goalkeeper" },
  { value: "CB", label: "Center Back" },
  { value: "FB", label: "Full Back" },
  { value: "DM", label: "Defensive Midfielder" },
  { value: "CM", label: "Central Midfielder" },
  { value: "AM", label: "Attacking Midfielder" },
  { value: "W", label: "Winger" },
  { value: "ST", label: "Striker" },
];

const BIO_MAX = 240;

type AdminPlayerFormValues = {
  id?: string;
  name?: string;
  number?: number;
  position?: string;
  status?: string;
  bio?: string | null;
  photoUrl?: string | null;
  updatedAt?: Date;
};

export function AdminPlayerForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: AdminPlayerFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [number, setNumber] = useState(initialValues?.number ?? undefined);
  const [position, setPosition] = useState(initialValues?.position ?? "ST");
  const [bio, setBio] = useState(initialValues?.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialValues?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isEdit = Boolean(initialValues?.id);
  const formId = "admin-player-form";

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Shrink before uploading: a raw phone photo is far bigger than the card
      // ever renders, and used to blow straight through the size limit.
      const photo = await preparePhoto(file);
      const blob = await upload(photo.name, photo, { access: "public", handleUploadUrl: "/api/player-photo-upload" });
      setPhotoUrl(blob.url);
    } catch (cause) {
      // The blob client reports every failed token request identically, so ask
      // the route itself what actually went wrong.
      if (isTokenRequestFailure(cause)) {
        try {
          const probe = await fetch("/api/player-photo-upload");
          const body = await probe.json().catch(() => ({}));
          setUploadError(readinessMessage(probe.status, body?.reason, body?.detail));
        } catch {
          setUploadError("Couldn't reach the server. Check your connection and try again.");
        }
      } else {
        setUploadError(photoUploadMessage(cause));
      }
    } finally {
      setUploading(false);
      event.target.value = ""; // let the same file be re-picked after a failure
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <Link href="/admin/players" className="flex items-center gap-1.5 font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase no-underline hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to players
          </Link>
          <h1 className={ADMIN_H1}>{isEdit ? `Edit player · #${initialValues?.number ?? ""} ${initialValues?.name ?? ""}` : "Add player"}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/players" className={ADMIN_BUTTON_SECONDARY}>
            Cancel
          </Link>
          <button type="submit" form={formId} disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : "Save player"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form id={formId} action={formAction} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <input type="hidden" name="photoUrl" value={photoUrl} />

        <div className={`${ADMIN_CARD} flex flex-col gap-5`}>
          <span className={ADMIN_LABEL}>Photo</span>
          <div className="flex flex-col items-center gap-4">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Player photo" className="h-[180px] w-[180px] rounded-md border border-fg/14 object-cover" />
            ) : (
              <div
                className="flex h-[180px] w-[180px] items-center justify-center rounded-md border border-fg/14 font-mono text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
                style={{ background: "repeating-linear-gradient(135deg, oklch(0.30 0.02 260) 0 6px, oklch(0.26 0.015 260) 6px 12px)" }}
              >
                no photo
              </div>
            )}
            <label className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-fg/22 p-5 text-center transition-colors hover:border-accent hover:bg-[oklch(0.24_0.015_260)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M4 16v3h16v-3" />
              </svg>
              <span className="font-heading text-xs font-semibold tracking-[0.1em] uppercase">Replace photo</span>
              <span className="text-xs leading-relaxed text-muted">
                JPG, PNG or WebP, square, at least 600×600 — large photos are resized automatically. Left blank, the
                card falls back to initials.
              </span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="hidden" />
            </label>
            {photoUrl && (
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl("");
                  setUploadError(null);
                }}
                className="font-heading text-[11px] font-semibold tracking-[0.1em] text-muted uppercase hover:text-red-400"
              >
                Remove photo
              </button>
            )}
            {uploading && <span className="text-xs text-muted">Uploading...</span>}
            {uploadError && <span className="text-xs text-red-400">{uploadError}</span>}
          </div>

          <div className="h-px bg-fg/10" />

          <div className="flex flex-col gap-2.5">
            <span className={ADMIN_LABEL}>Card preview</span>
            <div className="mx-auto w-[180px] py-2">
              <PlayerFlipCard
                name={name || "New player"}
                number={number ?? 0}
                pos={position}
                initials={initialsFromName(name || "?")}
                bio={bio}
                photoUrl={photoUrl || null}
                titleSize={16}
              />
            </div>
          </div>
        </div>

        <div className={`${ADMIN_CARD} flex flex-col gap-5`}>
          <span className={ADMIN_LABEL}>Details</span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Name</span>
              <input name="name" value={name} onChange={(e) => setName(e.target.value)} required className={ADMIN_INPUT} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Squad number</span>
              <input
                name="number"
                type="number"
                min={1}
                value={number ?? ""}
                onChange={(e) => setNumber(e.target.value ? Number(e.target.value) : undefined)}
                required
                className={`${ADMIN_INPUT} font-heading font-semibold tabular-nums`}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Position</span>
              <select name="position" value={position} onChange={(e) => setPosition(e.target.value)} className={`${ADMIN_INPUT} cursor-pointer`}>
                {POSITIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ADMIN_LABEL}>Status</span>
              <select name="status" defaultValue={initialValues?.status ?? "FIRST_TEAM"} className={`${ADMIN_INPUT} cursor-pointer`}>
                <option value="FIRST_TEAM">First team</option>
                <option value="RESERVE">Reserve</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={ADMIN_LABEL}>Bio · shown on the card back</span>
            <textarea
              name="bio"
              rows={6}
              maxLength={BIO_MAX}
              value={bio ?? ""}
              onChange={(e) => setBio(e.target.value)}
              className={`${ADMIN_INPUT} h-auto resize-y py-3 leading-relaxed`}
            />
            <span className="text-xs text-muted">
              Two or three sentences reads best. {bio?.length ?? 0} / {BIO_MAX} characters.
            </span>
          </label>

          <div className="h-px bg-fg/10" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className={ADMIN_LABEL}>Appears on</span>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex h-7 items-center rounded-md border border-fg/16 px-2.5 text-[13px] text-muted">Squad page</span>
                <span className="inline-flex h-7 items-center rounded-md border border-fg/16 px-2.5 text-[13px] text-muted">Matchday lineup</span>
              </div>
            </div>
            {isEdit && initialValues?.updatedAt && (
              <div className="flex flex-col gap-2">
                <span className={ADMIN_LABEL}>Last updated</span>
                <span className="text-sm text-fg">
                  {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(initialValues.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
