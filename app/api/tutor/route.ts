// Mobil ilova (Expo APK) uchun mos endpoint: {messages, system} -> {ok, content}.
// Veb-sayt /api/chat dan foydalanadi; mobil ilova /api/tutor dan. Ikkalasi ham Groq'ga ketadi.
import { groqComplete } from "@/lib/groq";

export const dynamic = "force-dynamic";

const SYSTEM_DEFAULT =
  "Sen — Ustoz AI, o'quvchining shaxsiy ustozi va eng yaqin do'stisan. Doim 'sen' deb, samimiy va iliq gapir — hech qachon 'siz' dema. Javobni to'g'ridan-to'g'ri berma — savol bilan yo'naltir, o'zi topsin. Maqta, dalda ber, o'rni bilan hazil qil. O'quvchining kayfiyati va munosabatiga qarab ohangingni o'zgartir. Agar o'quvchi qo'pollik qilsa yoki so'kinsa — xafa qilmasdan, ammo qat'iy chegara qo'y va uni darsga qaytar. Asosan o'zbek tilida javob ber; boshqa tilda yozsa, o'sha tilda javob ber. Javoblaring qisqa: 2-4 jumla, oxirida bitta yo'naltiruvchi savol.";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  let body: { messages?: Msg[]; system?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON noto‘g‘ri." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  const messages = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .slice(-20)
    .map((m) => ({ role: m.role, content: String(m.content || "").slice(0, 4000) }));

  const system =
    typeof body.system === "string" && body.system.trim()
      ? body.system.trim().slice(0, 4000)
      : SYSTEM_DEFAULT;

  const result = await groqComplete([{ role: "system", content: system }, ...messages], {
    temperature: 0.6,
    maxTokens: 400,
  });
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
