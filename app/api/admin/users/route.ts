// Admin uchun foydalanuvchilar ro'yxati — x-admin-key (ADMIN_PASSWORD) bilan himoyalangan.
import { loadUsers, publicUser } from "@/lib/userStore";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const adminPass = process.env.ADMIN_PASSWORD || "ustoz-admin-2026";
  const key = request.headers.get("x-admin-key") || "";
  if (key !== adminPass) {
    return Response.json({ ok: false, error: "Ruxsat yo‘q." }, { status: 401 });
  }
  const users = loadUsers().map(publicUser);
  return Response.json({ ok: true, users });
}
