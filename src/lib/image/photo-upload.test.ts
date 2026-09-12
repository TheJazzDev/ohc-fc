import { test, expect } from "bun:test";
import {
  fitWithin,
  isTokenRequestFailure,
  photoFileName,
  photoUploadMessage,
  readinessMessage,
  UnreadableImageError,
} from "./photo-upload";

test("leaves an image that already fits alone", () => {
  expect(fitWithin(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  expect(fitWithin(1600, 1200, 1600)).toEqual({ width: 1600, height: 1200 });
});

test("scales a landscape photo down by its long edge", () => {
  expect(fitWithin(4032, 3024, 1600)).toEqual({ width: 1600, height: 1200 });
});

test("scales a portrait photo down by its long edge", () => {
  expect(fitWithin(3024, 4032, 1600)).toEqual({ width: 1200, height: 1600 });
});

test("keeps the aspect ratio of an extreme panorama", () => {
  const { width, height } = fitWithin(8000, 1000, 1600);
  expect(width).toBe(1600);
  expect(height).toBe(200);
});

test("never rounds a dimension away to zero", () => {
  const { width, height } = fitWithin(10000, 3, 1600);
  expect(width).toBe(1600);
  expect(height).toBeGreaterThanOrEqual(1);
});

test("gives every upload its own webp name so photos can't overwrite each other", () => {
  const a = photoFileName();
  const b = photoFileName();
  expect(a).toMatch(/^players\/[0-9a-f-]{36}\.webp$/);
  expect(a).not.toBe(b);
});

test("names HEIC as the problem, with the fix, when that is what failed", () => {
  const message = photoUploadMessage(new UnreadableImageError("image/heic"));
  expect(message).toContain("HEIC");
  expect(message).toContain("JPEG");
});

test("does not blame HEIC for a file that is simply unreadable", () => {
  const message = photoUploadMessage(new UnreadableImageError("image/png"));
  expect(message).not.toContain("HEIC");
  expect(message).toContain("couldn't be read");
});

test("passes through the underlying reason for a genuine upload failure", () => {
  expect(photoUploadMessage(new Error("Request Entity Too Large"))).toBe(
    "Photo upload failed: Request Entity Too Large",
  );
});

test("falls back to the generic message for a non-Error throw", () => {
  expect(photoUploadMessage("something odd")).toBe("Photo upload failed. Try again.");
});

test("recognises the blob client's opaque token failure", () => {
  expect(isTokenRequestFailure(new Error("Vercel Blob: Failed to retrieve the client token"))).toBe(true);
  expect(isTokenRequestFailure(new Error("Vercel Blob: Failed to  retrieve the client token"))).toBe(true);
  expect(isTokenRequestFailure(new Error("Network request failed"))).toBe(false);
});

test("tells a signed-out admin to sign in again", () => {
  expect(readinessMessage(401)).toContain("session has expired");
  expect(readinessMessage(500, "signed-out")).toContain("session has expired");
});

test("names an unconfigured blob store, with the detail", () => {
  const message = readinessMessage(500, "blob-not-configured", "BLOB_READ_WRITE_TOKEN is not set in this environment");
  expect(message).toContain("isn't configured");
  expect(message).toContain("BLOB_READ_WRITE_TOKEN");
});

test("falls back to pointing at the server logs for an unknown reason", () => {
  expect(readinessMessage(500)).toContain("server logs");
});
