// APK yuklab olish — statik faylga yo'naltiradi (Next public/ orqali samarali beriladi).
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return Response.redirect(new URL("/downloads/ustoz-ai.apk", request.url), 307);
}
