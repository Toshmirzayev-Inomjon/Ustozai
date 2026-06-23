// Profil/progress yangilash — token bilan himoyalangan.
import { loadUsers, saveUsers, findByToken, publicUser, type StoredUser } from "@/lib/userStore";

export const dynamic = "force-dynamic";

// Faqat shu maydonlarni yangilashga ruxsat (rol, username, parol o'zgarmaydi).
const ALLOWED: (keyof StoredUser)[] = [
  "ism", "familiya", "tel", "email", "yosh", "viloyat", "manzil", "lat", "lng",
  "kasb", "subjects", "premium", "streak", "lastActiveDay", "totalAnswered",
  "totalCorrect", "subjectStats", "childUsername",
];

export async function POST(request: Request) {
  let b: { username?: string; token?: string; patch?: Record<string, unknown> };
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const users = loadUsers();
  const found = findByToken(users, String(b.username || ""), String(b.token || ""));
  if (!found) return Response.json({ ok: false, error: "Sessiya yaroqsiz." }, { status: 401 });

  const patch = b.patch || {};
  const idx = users.findIndex((u) => u.username === found.username);
  const next = { ...found } as StoredUser;
  for (const key of ALLOWED) {
    if (key in patch) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (next as any)[key] = (patch as any)[key];
    }
  }
  users[idx] = next;
  try {
    saveUsers(users);
  } catch {
    return Response.json({ ok: false, error: "Saqlashda xatolik." }, { status: 500 });
  }

  return Response.json({ ok: true, user: publicUser(next) });
}
