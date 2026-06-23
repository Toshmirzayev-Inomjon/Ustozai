// Kirish — umumiy backend.
import { loadUsers, saveUsers, norm, hashPassword, publicUser, bumpStreak } from "@/lib/userStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let b: { username?: string; password?: string };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const username = String(b.username || "").trim();
  const password = String(b.password || "");

  const users = loadUsers();
  const idx = users.findIndex((u) => norm(u.username) === norm(username));
  if (idx === -1) return Response.json({ ok: false, error: "Bunday foydalanuvchi topilmadi." }, { status: 404 });

  const u = users[idx];
  if (u.passHash !== hashPassword(password, u.salt)) {
    return Response.json({ ok: false, error: "Parol noto‘g‘ri." }, { status: 401 });
  }

  const bumped = bumpStreak(u);
  users[idx] = bumped;
  try {
    saveUsers(users);
  } catch {
    /* streak saqlanmasa ham kirishga ruxsat */
  }

  return Response.json({ ok: true, user: publicUser(bumped), token: bumped.token });
}
