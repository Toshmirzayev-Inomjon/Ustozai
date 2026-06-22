// Ustoz AI web — foydalanuvchi tiplari (mahalliy MVP, localStorage).
// TODO(backend): bularni FastAPI + DB bilan almashtirish (auth, hash, ko'p qurilma).

export type Role = "student" | "parent";

export type SubjectStat = { answered: number; correct: number };

export type User = {
  role: Role;
  username: string;
  password: string; // MVP: mahalliy. Keyin backend + hash.
  ism: string;
  familiya: string;
  tel: string;
  email: string;
  premium: boolean;
  createdAt: string;

  // O'quvchi maydonlari
  yosh?: string;
  viloyat?: string;
  manzil?: string;
  lat?: number | null;
  lng?: number | null;
  kasb?: string;
  subjects?: string[];

  // Ota-ona maydoni
  childUsername?: string;

  // Progress
  streak: number;
  lastActiveDay: string;
  totalAnswered: number;
  totalCorrect: number;
  subjectStats: Record<string, SubjectStat>;
};

export type StudentDraft = {
  ism: string;
  familiya: string;
  yosh: string;
  viloyat: string;
  manzil: string;
  lat: number | null;
  lng: number | null;
  tel: string;
  email: string;
  kasb: string;
  subjects: string[];
};

export type ParentDraft = {
  ism: string;
  familiya: string;
  tel: string;
  email: string;
  childUsername: string;
};

export const todayKey = (): string => new Date().toISOString().slice(0, 10);
