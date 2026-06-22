// Ustoz AI — server tomonida Groq chaqiruvi.
// FAQAT route handlerlar (app/api/*) ichida import qilinadi — GROQ_API_KEY hech qachon brauzerga chiqmaydi.
// TODO(backend): kerak bo'lsa FastAPI proksisiga ko'chirish mumkin.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export type GroqResult = { ok: true; content: string } | { ok: false; error: string };

export async function groqComplete(
  messages: Msg[],
  opts: { temperature?: number; maxTokens?: number } = {},
): Promise<GroqResult> {
  const apiKey = process.env.GROQ_API_KEY || "";
  if (!apiKey) return { ok: false, error: "Groq API kaliti serverda sozlanmagan." };

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: opts.temperature ?? 0.6,
        max_tokens: opts.maxTokens ?? 400,
      }),
    });

    if (!res.ok) {
      return {
        ok: false,
        error:
          res.status === 401
            ? "Groq API kaliti noto‘g‘ri."
            : "Hozir javob berolmayapman. Birozdan keyin urinib ko‘r.",
      };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return { ok: false, error: "Groq bo‘sh javob qaytardi." };
    return { ok: true, content: String(content).trim() };
  } catch {
    return { ok: false, error: "Groq bilan ulanib bo‘lmadi." };
  }
}

// Groq ba'zan JSON atrofida matn qo'shadi — birinchi {...} blokini ajratib olamiz.
export function parseJsonLoose(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}
