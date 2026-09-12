import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

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
}
