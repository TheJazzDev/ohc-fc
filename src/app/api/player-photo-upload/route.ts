import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Why a token request failed, in terms the admin UI can explain.
 *
 * The blob client throws away the status and body of a failed token request
 * ("Failed to retrieve the client token" and nothing else), so the form asks
 * this route directly over GET once an upload fails.
 */
export type UploadReadiness = { ok: true } | { ok: false; reason: "signed-out" | "blob-not-configured"; detail?: string };

export async function GET(): Promise<NextResponse<UploadReadiness>> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ ok: false, reason: "signed-out" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { ok: false, reason: "blob-not-configured", detail: "BLOB_READ_WRITE_TOKEN is not set in this environment" },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      // The browser downscales to WebP before uploading, so this is only a
      // backstop for anything that reaches the route un-resized.
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
        maximumSizeInBytes: 10 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (cause) {
    // Without this the failure is an unhandled 500 and the admin is told only
    // that a token could not be retrieved — true, but useless.
    const message = cause instanceof Error ? cause.message : "Could not authorise the upload";
    console.error("[player-photo-upload] token request failed:", cause);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
