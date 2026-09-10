import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Fetches the session — don't statically prerender at build time (the
// database isn't reachable from the build step on Vercel).
export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const session = await auth();
  redirect(session ? "/admin/players" : "/admin/login");
}
