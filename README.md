# Ustoz AI Web

Uzbek o‘quvchilar uchun kasbga mos AI tutor veb-ilovasi. Stack: Next.js App Router, TypeScript, Tailwind CSS v4 va Framer Motion.

## Ishga tushirish

```bash
npm run dev
```

Brauzerda ochish:

```text
http://localhost:3000
```

## Production build

```bash
npm run build
npm run start
```

## Muhit o‘zgaruvchilari

```env
GROQ_API_KEY=...
ADMIN_USER=...
ADMIN_PASSWORD=...
```

`GROQ_API_KEY` faqat Next.js route handlerlarda ishlatiladi va browserga chiqmaydi. Kelajakda `app/api/*` route handlerlar FastAPI backendga almashtiriladi.
