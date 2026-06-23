// Sessiyani tiklash — username + token orqali foydalanuvchini qaytaradi.
import { loadUsers, saveUsers, findByToken, publicUser, bumpStreak } from "@/lib/userStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let b: { username?: string; token?: string };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const users = loadUsers();
  const found = findByToken(users, String(b.username || ""), String(b.token || ""));
  if (!found) return Response.json({ ok: false, error: "Sessiya yaroqsiz." }, { status: 401 });

  const idx = users.findIndex((u) => u.username === found.username);
  const bumped = bumpStreak(found);
  users[idx] = bumped;
  try {
    saveUsers(users);
  } catch {
    /* e'tibor bermaymiz */
  }

  return Response.json({ ok: true, user: publicUser(bumped) });
}
