import Link from "next/link";
import StarLogo from "@/components/StarLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-12 text-center">
        <div className="flex items-center gap-2.5">
          <StarLogo size={30} />
          <span className="font-head text-lg font-bold">Ustoz AI</span>
        </div>
        <p className="text-sm text-muted">Har bir o‘quvchiga — o‘z ustozi</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-muted">
          <Link href="#imkoniyatlar" className="hover:text-cobalt">Imkoniyatlar</Link>
          <Link href="/kirish" className="hover:text-cobalt">Kirish</Link>
          <Link href="/royxat" className="hover:text-cobalt">Ro‘yxatdan o‘tish</Link>
          <Link href="#yuklab-olish" className="hover:text-cobalt">APK</Link>
        </div>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Ustoz AI · 1–11 sinf va DTM</p>
      </div>
    </footer>
  );
}
