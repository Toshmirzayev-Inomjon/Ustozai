// Ustoz AI — AI tutor mantig'i. System prompt va kayfiyat aniqlash pure funksiyalar
// (server route ham, client ham ishlatadi). API chaqiruvlari /api/* route handlerlarga ketadi.
import { buildUzbekLexiconInstruction, normalizeUzbekTerms } from "./uzbekLexicon";

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };
export type Mood = "neutral" | "happy" | "frustrated" | "rude";

export type TutorContext = {
  ism?: string;
  kasb?: string;
  subject?: string;
  mood?: Mood;
};

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const RUDE_WORDS = ["jala", "ahmoq", "tentak", "jinni", "eshak", "suka", "idiot", "stupid", "blya", "mraz"];
const FRUSTRATED_WORDS = [
  "tushunmadim", "tushunmayapman", "qiyin", "charchadim", "bo‘ldi", "boldi",
  "zerikdim", "yomon", "bilmayman", "uddalay olmayman",
];
const HAPPY_WORDS = ["zo‘r", "zor", "rahmat", "raxmat", "yashang", "tushundim", "topdim", "ajoyib", "super"];

export function detectMood(text: string): Mood {
  const t = ` ${text.toLowerCase()} `;
  if (RUDE_WORDS.some((w) => t.includes(w))) return "rude";
  if (FRUSTRATED_WORDS.some((w) => t.includes(w))) return "frustrated";
  if (HAPPY_WORDS.some((w) => t.includes(w))) return "happy";
  return "neutral";
}

const UZBEK_STYLE_GUIDE =
  "TIL QOIDASI: faqat ravon o'zbek tilida, lotin yozuvida javob ber. " +
  "Kirill yozma, ruscha yoki inglizcha aralashtirma. " +
  "Agar o'quvchi boshqa tilda yozsa ham o'zbek lotinda javob ber va suhbatni o'zbekchada davom ettir. " +
  "Matematik atamalarni o'zbekcha ishlat: tenglama, ifoda, kasr, foiz, yechim, natija, sabab. " +
  "Texnologiya atamalarini to'g'ri yoz: 'dasturlash' deb yoz, hech qachon 'dashtrlash', 'dastrlash' yoki 'dastirlash' dema. " +
  "'programming' o'rniga 'dasturlash', 'developer' o'rniga 'dasturchi', 'code' o'rniga 'kod', 'coding' o'rniga 'kod yozish' de. " +
  "Gaplaring tabiiy, qisqa, og'zaki va samimiy bo'lsin; tarjimadek qotib qolgan iboralarni ishlatma. " +
  "Hech qachon 'siz', 'Siz', 'sizga', 'sizni', 'sizning' demagin; doim 'sen', 'senga', 'seni' de.";

const BASE_PROMPT =
  "Sen — Ustoz AI, o'quvchining shaxsiy ustozi va eng yaqin do'stisan. " +
  UZBEK_STYLE_GUIDE + " " +
  "Javobni to'g'ridan-to'g'ri berma — savol bilan yo'naltir, o'zi topsin (Sokratik usul). " +
  "Maqta, dalda ber, o'rni bilan yengil hazil qil ('Barakalla!', 'Sen uddalaysan!'). " +
  "O'quvchining kayfiyati va munosabatiga qarab ohangingni o'zgartir, xarakterini o'rgan. " +
  "Javoblaring qisqa: 2-4 jumla, oxirida bitta yo'naltiruvchi savol.";

export const UZBEK_REWRITE_PROMPT =
  "Sen Ustoz AI matn muharririsan. Berilgan matnni ma'nosini o'zgartirmasdan grammatik to'g'ri, ravon o'zbek lotiniga qayta yoz. " +
  "Kirill, ruscha, inglizcha aralashma, 'siz' shakli bo'lmasin. " +
  "Matn o'quvchiga qarata yozilsin: 'sen', 'senga', '-san', '-sang' shakllarini ishlat; 'men', '-man', '-sam', '-im' shakllarini o'quvchi haqida ishlatma. " +
  "Atamalarni to'g'ri yoz: 'dasturlash' so'zini buzma; 'dashtrlash', 'dastrlash', 'dastirlash' bo'lsa 'dasturlash'ga tuzat. " +
  "G'alati iboralarni tabiiy qil: masalan 'qadam ko'rasan' kabi iboralarni ishlatma. " +
  "Doim 'sen' uslubida, tabiiy, qisqa va samimiy yoz. Faqat tuzatilgan matnni qaytar.";

const CYRILLIC_RE = /[\u0400-\u04ff]/;
const FORMAL_OR_MIXED_RE =
  /\b(siz|sizga|sizni|sizning|Siz|Sizga|Sizni|Sizning|ok|okay|please|problem|solution|answer|example|task|конечно|давай|пример|решение|ответ|задача)\b/i;
const MALFORMED_UZBEK_RE =
  /\b(dashtrlash|dastrlash|dastirlash|bilasang|bilsam|buyurasam|qilasang|qilasing|ishlashingim|qadam ko'rasan|funksiya qadam|amal ko'raman)\b/i;

export function needsUzbekRewrite(text: string): boolean {
  return CYRILLIC_RE.test(text) || FORMAL_OR_MIXED_RE.test(text) || MALFORMED_UZBEK_RE.test(text);
}

export { normalizeUzbekTerms };

const MOOD: Record<Mood, string> = {
  neutral: "",
  happy: " O'quvchi kayfiyati yaxshi — quvonchini bo'lish, yana rag'batlantir.",
  frustrated:
    " O'quvchi qiynalyapti — avval dalda ber, mavzuni kichik qadamlarga bo'lib soddaroq tushuntir, hech qachon urishma.",
  rude:
    " O'quvchi qo'pollik qildi. Xafa qilmasdan, ammo QAT'IY chegara qo'y: hurmat bilan gaplashish kerakligini ayt, keyin mehr bilan darsga qaytar. Hech qachon bolani haqorat qilma.",
};

export function buildSystemPrompt(ctx: TutorContext): string {
  let p = BASE_PROMPT;
  if (ctx.ism) p += ` O'quvchining ismi: ${ctx.ism}.`;
  if (ctx.kasb) p += ` O'quvchining kasbi: ${ctx.kasb}. Darslarni shu kasbga moslab o't, misollarni shu sohadan keltir.`;
  if (ctx.subject) p += ` Hozir ${ctx.subject} fanidan dars o'tyapsan.`;
  p += buildUzbekLexiconInstruction(ctx);
  if (ctx.mood) p += MOOD[ctx.mood];
  return p;
}

// ---- API chaqiruvlari (Next route handlerlarga) ----

export type TutorResult = { ok: true; content: string } | { ok: false; error: string };

export async function askTutor(messages: ChatMessage[], ctx: TutorContext = {}): Promise<TutorResult> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, ctx }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok || !data.content) {
      return { ok: false, error: data?.error ?? "Backend javob bermayapti. Qayta urinib ko'r." };
    }
    return { ok: true, content: String(data.content).trim() };
  } catch {
    return { ok: false, error: "Aloqa yo'q. Qayta urinib ko'r." };
  }
}

export async function generateQuiz(
  subject: string,
  kasb: string,
  count = 5,
): Promise<{ ok: true; questions: QuizQuestion[] } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, kasb, count }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok || !Array.isArray(data.questions)) {
      return { ok: false, error: data?.error ?? "Test tayyorlab bo‘lmadi." };
    }
    return { ok: true, questions: data.questions };
  } catch {
    return { ok: false, error: "Aloqa yo'q." };
  }
}

export async function generateSubjects(
  kasb: string,
): Promise<{ ok: true; subjects: string[] } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kasb }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok || !Array.isArray(data.subjects)) {
      return { ok: false, error: data?.error ?? "Fanlarni aniqlab bo‘lmadi." };
    }
    return { ok: true, subjects: data.subjects };
  } catch {
    return { ok: false, error: "Aloqa yo'q." };
  }
}
