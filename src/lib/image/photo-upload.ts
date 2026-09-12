// Player photos are rendered in a card a few hundred pixels wide, so a raw
// phone photo (routinely 5-12 MB) is orders of magnitude bigger than anything
// the site shows. Re-encoding in the browser before upload keeps uploads fast
// on mobile data and stops file size being a failure mode at all.

export const MAX_PHOTO_EDGE = 1600;
const WEBP_QUALITY = 0.85;

/** Thrown when the browser can't decode the picked file — HEIC, mainly. */
export class UnreadableImageError extends Error {
  constructor(readonly fileType: string) {
    super(`Cannot decode image of type "${fileType}"`);
    this.name = "UnreadableImageError";
  }
}

/** Dimensions scaled to fit inside `maxEdge`, keeping the aspect ratio. */
export function fitWithin(width: number, height: number, maxEdge: number) {
  const longest = Math.max(width, height);
  if (longest <= maxEdge) return { width, height };
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * A unique name for each upload. Vercel Blob overwrites on a repeated
 * pathname, so reusing the picked filename would let one player's photo
 * replace another's the moment two people both upload "IMG_1234.jpg".
 */
export function photoFileName() {
  return `players/${crypto.randomUUID()}.webp`;
}

/** Decodes, downscales and re-encodes a picked file ready for upload. */
export async function preparePhoto(file: File, maxEdge = MAX_PHOTO_EDGE): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new UnreadableImageError(file.type || file.name);
  }

  const { width, height } = fitWithin(bitmap.width, bitmap.height, maxEdge);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new UnreadableImageError(file.type);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
  if (!blob) throw new UnreadableImageError(file.type);

  return new File([blob], photoFileName(), { type: "image/webp" });
}

/** Turns a thrown upload failure into something the admin can act on. */
export function photoUploadMessage(cause: unknown): string {
  if (cause instanceof UnreadableImageError) {
    // HEIC is the common case and has a specific remedy; anything else that
    // won't decode is more likely a damaged or mislabelled file.
    return /heic|heif/i.test(cause.fileType)
      ? "iPhone HEIC photos can't be read in this browser — convert it to JPEG or PNG first."
      : "That file couldn't be read as an image. Try a different JPEG, PNG or WebP.";
  }
  if (cause instanceof Error && cause.message) {
    return `Photo upload failed: ${cause.message}`;
  }
  return "Photo upload failed. Try again.";
}
