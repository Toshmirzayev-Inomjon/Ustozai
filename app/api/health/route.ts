// Holat tekshiruvi (mobil ilova va Railway healthcheck uchun).
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export function GET() {
  const apkFile = path.join(process.cwd(), "public", "downloads", "ustoz-ai.apk");
  return Response.json({
    ok: true,
    service: "Ustoz AI (web + backend)",
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    apkReady: fs.existsSync(apkFile),
  });
}
