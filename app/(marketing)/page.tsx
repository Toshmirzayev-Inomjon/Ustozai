import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";
import PhonePreview from "@/components/marketing/PhonePreview";
import VoiceOrb from "@/components/chat/VoiceOrb";

const APK_URL = "/downloads/ustoz-ai.apk";

const FEATURES = [
  { icon: "🎓", title: "AI ustoz (Sokrat usuli)", text: "Javobni shunchaki bermaydi — savol bilan yo‘naltiradi, o‘zing topasan." },
  { icon: "🧭", title: "Kasbga moslashgan ta'lim", text: "Kasbingni tanla — senga mos fanlar avtomatik biriktiriladi." },
  { icon: "🎙️", title: "Ovozli suhbat", text: "Mikrofon orqali gaplash — AI ovoz bilan javob beradi." },
  { icon: "🇺🇿", title: "To‘liq o‘zbek tilida", text: "Hammasi o‘zbekcha. Boshqa tilda yozsang — o‘sha tilda javob beradi." },
  { icon: "👨‍👩‍👧", title: "Ota-ona paneli", text: "Ota-onalar farzandi natijasini kuzatadi." },
  { icon: "📚", title: "1–11 sinf + DTM", text: "Maktab dasturidan DTM tayyorgarligigacha." },
];

const STEPS = [
  { n: "1", title: "Ro‘yxatdan o‘t", text: "Ism, kasb va ma'lumotlaringni kirit." },
  { n: "2", title: "Kasbingni tanla", text: "Senga mos fanlar avtomatik ochiladi." },
  { n: "3", title: "AI ustoz bilan o‘rgan", text: "Yoz yoki gapir — birga o‘ylab, o‘rganasan." },
];

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <Reveal>
            <span className="inline-flex rounded-full bg-saffron-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-saffron">
              Kasbingga mos · AI ustoz
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-head text-5xl font-bold leading-[1.05] md:text-6xl">
              Har bir o‘quvchiga — o‘z ustozi
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Kasbingni tanla — senga mos fanlar avtomatik biriktiriladi. AI ustoz sen bilan
              o‘zbekcha, ovozli gaplashadi, dars o‘tadi va dalda beradi.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={APK_URL}>APK yuklab olish</ButtonLink>
              <ButtonLink href="/royxat" variant="secondary">
                Saytda sinab ko‘rish
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-sm text-muted">
              Android 32/64-bit · bepul · 1–11 sinf va DTM
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <PhonePreview />
        </Reveal>
      </section>

      {/* IMKONIYATLAR */}
      <section id="imkoniyatlar" className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="font-head text-4xl font-bold md:text-5xl">Imkoniyatlar</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Ustoz AI shunchaki chatbot emas — u sening shaxsiy ustozing.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cobalt-50 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QANDAY ISHLAYDI */}
      <section id="qanday" className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="text-center font-head text-4xl font-bold md:text-5xl">Qanday ishlaydi</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="rounded-[20px] border border-border bg-surface p-7 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cobalt font-head text-2xl font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OVOZLI SUHBAT */}
      <section id="ovoz" className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid items-center gap-10 rounded-[28px] bg-cobalt-deep px-6 py-14 text-white md:grid-cols-2 md:px-14">
          <div>
            <Reveal>
              <span className="inline-flex rounded-full bg-white/12 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-saffron">
                Ovozli suhbat
              </span>
              <h2 className="mt-4 font-head text-4xl font-bold md:text-5xl">
                Yozma emas — gaplash
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-white/80">
                Mikrofonni bos va ustozing bilan jonli gaplash. AI seni eshitadi, ovoz bilan
                javob beradi va xuddi haqiqiy ustozdek dars o‘tadi.
              </p>
              <ButtonLink href="/ovozli" variant="white" className="mt-7">
                Ovozli suhbatni sinab ko‘rish
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex justify-center">
            <VoiceOrb size={220} state="speaking" />
          </Reveal>
        </div>
      </section>

      {/* APK YUKLAB OLISH */}
      <section id="yuklab-olish" className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <div className="rounded-[28px] border border-border bg-surface px-6 py-14 text-center shadow-soft">
            <h2 className="font-head text-4xl font-bold md:text-5xl">Ilovani yuklab ol</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
              Android telefoning uchun universal APK. Barcha qurilmalarda ishlaydi.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={APK_URL}>APK yuklab olish</ButtonLink>
              <ButtonLink href="/royxat" variant="ghost">
                Brauzerda boshlash
              </ButtonLink>
            </div>
            <p className="mt-5 font-mono-x text-sm text-muted">
              arm64-v8a · armeabi-v7a · x86 · x86_64
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
