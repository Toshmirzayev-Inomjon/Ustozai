// Ro'yxatdan o'tish — umumiy backend (sayt + mobil ilova).
import {
  loadUsers,
  saveUsers,
  norm,
  hashPassword,
  makeSalt,
  makeToken,
  publicUser,
  type Role,
  type StoredUser,
} from "@/lib/userStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const role: Role = b.role === "parent" ? "parent" : "student";
  const username = String(b.username || "").trim();
  const password = String(b.password || "");

  if (username.length < 3) return Response.json({ ok: false, error: "Username kamida 3 ta belgi." }, { status: 400 });
  if (password.length < 4) return Response.json({ ok: false, error: "Parol kamida 4 ta belgi." }, { status: 400 });

  const str = (k: string) => String(b[k] || "").trim();
  if (!str("ism") || !str("familiya")) return Response.json({ ok: false, error: "Ism va familiyani kiriting." }, { status: 400 });
  if (!str("tel")) return Response.json({ ok: false, error: "Telefon raqamni kiriting." }, { status: 400 });

  const users = loadUsers();
  if (users.some((u) => norm(u.username) === norm(username))) {
    return Response.json({ ok: false, error: "Bu username band." }, { status: 409 });
  }

  const salt = makeSalt();
  const token = makeToken();
  const today = new Date().toISOString().slice(0, 10);

  const newUser: StoredUser = {
    role,
    username,
    salt,
    passHash: hashPassword(password, salt),
    token,
    ism: str("ism"),
    familiya: str("familiya"),
    tel: str("tel"),
    email: str("email"),
    yosh: str("yosh") || undefined,
    viloyat: str("viloyat") || undefined,
    manzil: str("manzil") || undefined,
    lat: typeof b.lat === "number" ? (b.lat as number) : null,
    lng: typeof b.lng === "number" ? (b.lng as number) : null,
    kasb: str("kasb") || undefined,
    subjects: Array.isArray(b.subjects) ? (b.subjects as string[]).map(String).slice(0, 8) : [],
    childUsername: str("childUsername") || undefined,
    premium: false,
    createdAt: new Date().toISOString(),
    streak: 1,
    lastActiveDay: today,
    totalAnswered: 0,
    totalCorrect: 0,
    subjectStats: {},
  };

  users.push(newUser);
  try {
    saveUsers(users);
  } catch {
    return Response.json({ ok: false, error: "Saqlashda xatolik (server)." }, { status: 500 });
  }

  return Response.json({ ok: true, user: publicUser(newUser), token });
}
