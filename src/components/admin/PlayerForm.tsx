"use client";

import { useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";

type PlayerFormValues = {
  id?: string;
  name?: string;
  number?: number;
  position?: string;
  status?: string;
  bio?: string | null;
  photoUrl?: string | null;
};

export function PlayerForm({
  action,
  initialValues,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  initialValues?: PlayerFormValues;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const [photoUrl, setPhotoUrl] = useState(initialValues?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/player-photo-upload",
      });
      setPhotoUrl(blob.url);
    } catch {
      setUploadError("Photo upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="photoUrl" value={photoUrl} />

      <label className="flex flex-col gap-1.5 text-sm">
        Name
        <input
          name="name"
          defaultValue={initialValues?.name}
          required
          className="rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Squad number
        <input
          name="number"
          type="number"
          min={1}
          defaultValue={initialValues?.number}
          required
          className="rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Position
        <select
          name="position"
          defaultValue={initialValues?.position ?? "GK"}
          className="rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base"
        >
          <option value="GK">Goalkeeper</option>
          <option value="CB">Center Back</option>
          <option value="FB">Full Back</option>
          <option value="DM">Defensive Midfielder</option>
          <option value="CM">Central Midfielder</option>
          <option value="AM">Attacking Midfielder</option>
          <option value="W">Winger</option>
          <option value="ST">Striker</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Status
        <select
          name="status"
          defaultValue={initialValues?.status ?? "FIRST_TEAM"}
          className="rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base"
        >
          <option value="FIRST_TEAM">First team</option>
          <option value="RESERVE">Reserve</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Bio
        <textarea
          name="bio"
          defaultValue={initialValues?.bio ?? ""}
          rows={3}
          className="rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Photo
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="text-sm" />
        {uploading && <span className="text-xs text-muted">Uploading...</span>}
        {uploadError && <span className="text-xs text-red-400">{uploadError}</span>}
        {photoUrl && !uploading && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="Player photo preview" className="mt-2 h-20 w-20 rounded-full object-cover" />
        )}
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending || uploading}
        className="mt-1 cursor-pointer rounded-md bg-accent px-4 py-2.5 font-heading text-sm font-bold tracking-wide text-surface uppercase disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      >
        {pending ? "Saving..." : "Save player"}
      </button>
    </form>
  );
}
