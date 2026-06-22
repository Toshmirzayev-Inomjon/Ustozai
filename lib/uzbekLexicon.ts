// Ustoz AI — Uzbek atama normalizeri.
// 80k lug'atni prompt ichiga tiqish javobni sekinlashtiradi va barqaror qilmaydi.
// TODO(backend): katta lug'atni FastAPI/DB yoki data/uzbek-dictionary.txt orqali serverda tekshirish.

const EXACT_FIXES: Array<[RegExp, string]> = [
  [/\bdashtrla(sh|shni|shga|shdan|shda|shning)?\b/gi, "dasturla$1"],
  [/\bdashtrlash\b/gi, "dasturlash"],
  [/\bdastrlash\b/gi, "dasturlash"],
  [/\bdastirlash\b/gi, "dasturlash"],
  [/\bdasturilash\b/gi, "dasturlash"],
  [/\bdasturllash\b/gi, "dasturlash"],
  [/\bdasturchilik\b/gi, "dasturlash"],
  [/\bprogramming\b/gi, "dasturlash"],
  [/\bdeveloper\b/gi, "dasturchi"],
  [/\bcoding\b/gi, "kod yozish"],
  [/\bcode\b/gi, "kod"],
  [/\bbilasang\b/gi, "bilsang"],
  [/\bbilsam\b/gi, "bilsang"],
  [/\bbuyurasam\b/gi, "buyursang"],
  [/\bbilasiz\b/gi, "bilasan"],
  [/\btushunasiz\b/gi, "tushunasan"],
  [/\bqilasiz\b/gi, "qilasan"],
  [/\bolasiz\b/gi, "olasan"],
  [/\byozasiz\b/gi, "yozasan"],
  [/\bishlatasiz\b/gi, "ishlatasan"],
  [/\bqilasang\b/gi, "qilsang"],
  [/\bqilasing\b/gi, "qilsang"],
  [/\bishlashingim\b/gi, "ishlashing"],
  [/\bkompyuterga nima qilishni bilsa\b/gi, "kompyuterga nima qilish kerakligini aytsang"],
  [/\bqaysi sohani amal ko'raman\b/gi, "qaysi sohani tanlaysan"],
  [/\bqaysi biri amal ko'rasan\b/gi, "qaysi birini tanlaysan"],
  [/\balgoritm va funksiya qadam ishlatiladi\b/gi, "algoritm va funksiya ishlatiladi"],
  [/\bfunksiya qadam ishlatiladi\b/gi, "funksiya ishlatiladi"],
  [/\btushunchalar qadam ishlatilishini\b/gi, "tushunchalar ishlatilishini"],
  [/\bqadam algoritmni\b/gi, "algoritmni"],
  [/\bqadam algoritm\b/gi, "algoritm"],
  [/\bqadam funksiya\b/gi, "funksiya"],
  [/\bqadam ko'rasan\b/gi, "qanday ko'rasan"],
  [/\btushuncha qilasang\b/gi, "tushuncha olasan"],
  [/\bbug\b/gi, "xato"],
  [/\bdebug\b/gi, "xatoni topish"],
  [/\bdebugging\b/gi, "xatoni topish"],
  [/\bfrontend\b/gi, "front-end"],
  [/\bbackend\b/gi, "back-end"],
];

const PROTECTED_TERMS = [
  "abituriyent",
  "adaptiv",
  "adabiyot",
  "algoritm",
  "algebra",
  "amal",
  "analiz",
  "anatomiya",
  "argument",
  "arifmetika",
  "array",
  "asos",
  "atom",
  "ayirma",
  "back-end",
  "biologiya",
  "birlik",
  "blok",
  "boolean",
  "brauzer",
  "bug",
  "butun son",
  "burchak",
  "chiziq",
  "css",
  "daraja",
  "dars",
  "dastur",
  "dasturlash",
  "dasturchi",
  "diagramma",
  "dinamika",
  "domen",
  "ekran",
  "elektr",
  "element",
  "email",
  "energiya",
  "eslint",
  "expo",
  "fan",
  "farmakologiya",
  "fayl",
  "fizika",
  "foiz",
  "formula",
  "front-end",
  "funksiya",
  "gap",
  "geografiya",
  "geometriya",
  "grafik",
  "had",
  "html",
  "ifoda",
  "informatika",
  "integral",
  "iqtisod",
  "javascript",
  "json",
  "kasb",
  "kasr",
  "kimyo",
  "kod",
  "komponent",
  "kompyuter",
  "koordinata",
  "kuch",
  "limit",
  "mantiq",
  "matematika",
  "matn",
  "metod",
  "modul",
  "molekula",
  "natija",
  "next.js",
  "node.js",
  "ona tili",
  "operator",
  "parol",
  "portfolio",
  "proportsiya",
  "psixologiya",
  "python",
  "qadam",
  "qator",
  "qiymat",
  "quiz",
  "react",
  "react native",
  "router",
  "savol",
  "satr",
  "server",
  "sinus",
  "statistika",
  "string",
  "tarix",
  "tarmoq",
  "tenglama",
  "test",
  "trigonometriya",
  "typescript",
  "ustoz",
  "variant",
  "vektor",
  "xato",
  "yechim",
  "yig'indi",
  "o'zgaruvchi",
  "o'qituvchi",
  "o'quvchi",
];

const SUBJECT_TERMS: Record<string, string[]> = {
  informatika: [
    "algoritm",
    "dasturlash",
    "dasturchi",
    "kod",
    "funksiya",
    "o'zgaruvchi",
    "array",
    "string",
    "boolean",
    "komponent",
    "server",
    "front-end",
    "back-end",
  ],
  matematika: [
    "tenglama",
    "ifoda",
    "kasr",
    "foiz",
    "funksiya",
    "daraja",
    "ildiz",
    "yechim",
    "natija",
    "trigonometriya",
    "geometriya",
  ],
  fizika: ["kuch", "energiya", "tezlik", "massa", "elektr", "atom", "dinamika", "vektor"],
  kimyo: ["atom", "molekula", "element", "reaksiya", "formula", "modda", "eritma"],
  biologiya: ["hujayra", "organizm", "anatomiya", "gen", "to'qima", "ekologiya"],
};

const PROFESSION_TERMS: Record<string, string[]> = {
  dasturchi: SUBJECT_TERMS.informatika,
  "it muhandisi": SUBJECT_TERMS.informatika,
  shifokor: ["biologiya", "kimyo", "anatomiya", "hujayra", "organizm", "tashxis"],
  hamshira: ["biologiya", "kimyo", "anatomiya", "parvarish", "tibbiyot"],
  iqtisodchi: ["matematika", "statistika", "foiz", "daromad", "xarajat", "bozor"],
};

function distance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array<number>(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function preserveCase(original: string, corrected: string): string {
  if (original.toUpperCase() === original) return corrected.toUpperCase();
  if (original[0]?.toUpperCase() === original[0]) return corrected[0].toUpperCase() + corrected.slice(1);
  return corrected;
}

function fuzzyFixProtectedTerms(text: string): string {
  return text.replace(/[A-Za-zO'ʻ‘’`-]{5,}/g, (word) => {
    const normalized = word.toLowerCase().replace(/[ʻ‘’`]/g, "'");
    if (PROTECTED_TERMS.some((term) => normalized === term || normalized.startsWith(term))) return word;
    let best = "";
    let bestDistance = 3;

    for (const term of PROTECTED_TERMS) {
      if (Math.abs(term.length - normalized.length) > 2) continue;
      const d = distance(normalized, term);
      if (d < bestDistance) {
        best = term;
        bestDistance = d;
      }
    }

    return best && bestDistance <= 2 ? preserveCase(word, best) : word;
  });
}

export function normalizeUzbekTerms(text: string): string {
  const fixed = EXACT_FIXES.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);
  return fuzzyFixProtectedTerms(fixed);
}

export function buildUzbekLexiconInstruction(ctx: { kasb?: string; subject?: string }): string {
  const subjectKey = ctx.subject?.trim().toLowerCase() ?? "";
  const professionKey = ctx.kasb?.trim().toLowerCase() ?? "";
  const terms = [
    ...(SUBJECT_TERMS[subjectKey] ?? []),
    ...(PROFESSION_TERMS[professionKey] ?? []),
    "dasturlash",
    "dasturchi",
    "kod",
    "algoritm",
    "tenglama",
    "yechim",
  ];
  const unique = Array.from(new Set(terms)).slice(0, 18);
  return ` Muhim lug'at: ${unique.join(", ")}. Shu atamalarni aynan shunday yoz, buzib yozma.`;
}
