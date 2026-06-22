// AI test generatsiyasi (JSON).
import { groqComplete, parseJsonLoose } from "@/lib/groq";
import { normalizeUzbekTerms } from "@/lib/tutor";

export async function POST(request: Request) {
  let body: { subject?: string; kasb?: string; count?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const subject = String(body.subject || "Matematika").slice(0, 80);
  const kasb = String(body.kasb || "umumiy").slice(0, 80);
  const count = Math.max(1, Math.min(10, Number(body.count) || 5));

  const prompt =
    `Sen — Ustoz AI test tuzuvchisan. "${subject}" fanidan, "${kasb}" kasbiga mos ${count} ta ` +
    `ko'p variantli test savoli tuz. Har savolda 4 ta variant. Faqat ravon o'zbek lotinida yoz. ` +
    `Kirill, ruscha yoki inglizcha aralashma ishlatma. O'quvchiga doim "sen" deb murojaat qil. ` +
    `Texnologiya atamalarini to'g'ri yoz: "dasturlash" deb yoz, "dashtrlash" yoki "dastrlash" yozma. ` +
    `Faqat JSON qaytar: {"questions":[{"prompt":"...","options":["..","..","..",".."],"correctIndex":0,"explanation":"qisqa izoh, 'sen' deb"}]}`;

  const result = await groqComplete(
    [
      {
        role: "system",
        content:
          "Sen faqat JSON qaytaradigan yordamchisan. Barcha matnlar ravon o'zbek lotinida bo'lsin; kirill va ruscha/inglizcha aralashma yo'q.",
      },
      { role: "user", content: prompt },
    ],
    { temperature: 0.5, maxTokens: 1500 },
  );
  if (!result.ok) return Response.json(result, { status: 502 });

  const parsed = parseJsonLoose(result.content) as { questions?: unknown[] } | null;
  const raw = parsed && Array.isArray(parsed.questions) ? parsed.questions : null;
  if (!raw) return Response.json({ ok: false, error: "Test formatini o‘qib bo‘lmadi." }, { status: 502 });

  const questions = raw
    .map((q) => q as { prompt?: string; options?: unknown[]; correctIndex?: number; explanation?: string })
    .filter((q) => q && typeof q.prompt === "string" && Array.isArray(q.options) && q.options.length >= 2)
    .map((q) => ({
      prompt: normalizeUzbekTerms(String(q.prompt)).slice(0, 500),
      options: q.options!.slice(0, 4).map((o) => normalizeUzbekTerms(String(o)).slice(0, 200)),
      correctIndex: Math.max(0, Math.min((q.options!.length || 1) - 1, Number(q.correctIndex) || 0)),
      explanation: normalizeUzbekTerms(String(q.explanation || "")).slice(0, 500),
    }));

  if (!questions.length) return Response.json({ ok: false, error: "Savollar tayyorlanmadi." }, { status: 502 });
  return Response.json({ ok: true, questions });
}
