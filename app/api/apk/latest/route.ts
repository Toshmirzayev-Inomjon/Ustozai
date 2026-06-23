// Eng so'nggi APK ma'lumoti (mobil ilovaning avto-yangilanish tekshiruvi uchun).
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export function GET() {
  const file = path.join(process.cwd(), "public", "downloads", "ustoz-ai.apk");
  if (!fs.existsSync(file)) {
    return Response.json({ ok: false, error: "Hali APK yuklanmagan." }, { status: 404 });
  }
  const size = fs.statSync(file).size;
  return Response.json({
    ok: true,
    apk: {
      id: "bundled",
      version: "1.3.0",
      fileName: "ustoz-ai-1.3.0.apk",
      note: "Umumiy online akkaunt: bir marta ro'yxatdan o't, ham saytda ham ilovada kir. 32/64 bit.",
      size,
      uploadedAt: "2026-06-22T00:00:00.000Z",
      downloadUrl: "/downloads/ustoz-ai.apk",
    },
  });
}
