// Admin kirishi — backend (env) ga qarshi tekshiriladi. Frontendda parol HARDCODE QILINMAYDI.
// TODO(backend): haqiqiy FastAPI auth + sessiya/JWT bilan almashtirish.
// Hozircha env orqali: ADMIN_USER, ADMIN_PASSWORD (Railway/Vercel'da sozlanadi).

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return Response.json(
      { ok: false, error: "Admin kirishi uchun server env sozlanmagan." },
      { status: 503 },
    );
  }

  if (String(body.username || "") === adminUser && String(body.password || "") === adminPass) {
    // TODO(backend): xavfsiz sessiya cookie / JWT qaytarish.
    return Response.json({ ok: true, token: "admin-stub-token" });
  }
  return Response.json({ ok: false, error: "Foydalanuvchi nomi yoki parol noto‘g‘ri." }, { status: 401 });
}
