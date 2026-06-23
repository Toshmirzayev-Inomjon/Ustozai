// APK yuklab olish — statik faylga yo'naltiradi (Next public/ orqali samarali beriladi).
// Nisbiy Location ishlatamiz: Railway proksisi ortida request.url ichki (localhost:8080)
// bo'lgani uchun absolute redirect noto'g'ri chiqadi. Nisbiy manzilni brauzer tashqi
// domenga nisbatan to'g'ri hal qiladi.
export const dynamic = "force-dynamic";

export function GET() {
  return new Response(null, {
    status: 307,
    headers: { Location: "/downloads/ustoz-ai.apk" },
  });
}
