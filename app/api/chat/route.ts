// AI ustoz chat — Groq proksi. Kalit serverda qoladi.
import { groqComplete } from "@/lib/groq";
import {
  buildSystemPrompt,
  needsUzbekRewrite,
  normalizeUzbekTerms,
  UZBEK_REWRITE_PROMPT,
  type ChatMessage,
  type TutorContext,
} from "@/lib/tutor";

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[]; ctx?: TutorContext };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  const messages = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .slice(-20)
    .map((m) => ({ role: m.role, content: normalizeUzbekTerms(String(m.content || "")).slice(0, 4000) }));

  const system = buildSystemPrompt(body.ctx || {});
  let result = await groqComplete([{ role: "system", content: system }, ...messages], {
    temperature: 0.45,
    maxTokens: 400,
  });

  if (result.ok && needsUzbekRewrite(result.content)) {
    const rewrite = await groqComplete(
      [
        { role: "system", content: UZBEK_REWRITE_PROMPT },
        { role: "user", content: result.content },
      ],
      { temperature: 0.2, maxTokens: 400 },
    );
    if (rewrite.ok) result = rewrite;
  }

  if (result.ok) {
    result = { ok: true, content: normalizeUzbekTerms(result.content) };
  }

  return Response.json(result, { status: result.ok ? 200 : 502 });
}
