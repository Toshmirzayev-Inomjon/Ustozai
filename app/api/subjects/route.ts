// Ro'yxatda yo'q kasb uchun AI fanlar ro'yxatini generatsiya qiladi.
import { groqComplete, parseJsonLoose } from "@/lib/groq";
import { normalizeUzbekTerms } from "@/lib/tutor";

export async function POST(request: Request) {
  let body: { kasb?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const kasb = String(body.kasb || "").trim().slice(0, 80);
  if (!kasb) return Response.json({ ok: false, error: "Kasb kiritilmagan." }, { status: 400 });

  const prompt =
    `"${kasb}" kasbi uchun eng muhim 4 ta o'quv fanini ayt. ` +
    `Faqat JSON qaytar: {"subjects":["..","..","..",".."]}. ` +
    `Fan nomlari ravon o'zbek lotinida bo'lsin, kirill yoki ruscha/inglizcha aralashma yozma. ` +
    `"Dasturlash" fanini shunday yoz, "dashtrlash" yoki "dastrlash" yozma.`;

  const result = await groqComplete(
    [
      {
        role: "system",
        content:
          "Sen faqat JSON qaytaradigan yordamchisan. Barcha matnlar ravon o'zbek lotinida bo'lsin; kirill va ruscha/inglizcha aralashma yo'q.",
      },
      { role: "user", content: prompt },
    ],
    { temperature: 0.4, maxTokens: 200 },
  );
  if (!result.ok) return Response.json(result, { status: 502 });

  const parsed = parseJsonLoose(result.content) as { subjects?: unknown[] } | null;
  const subjects =
    parsed && Array.isArray(parsed.subjects)
      ? parsed.subjects.map((s) => normalizeUzbekTerms(String(s)).slice(0, 60)).filter(Boolean).slice(0, 6)
      : null;
  if (!subjects || !subjects.length)
    return Response.json({ ok: false, error: "Fanlarni aniqlab bo‘lmadi." }, { status: 502 });
  return Response.json({ ok: true, subjects });
}
