// Ustoz AI — umumiy foydalanuvchi ombori (sayt + mobil ilova uchun bitta backend).
// JSON faylda saqlanadi. Railway'da doimiy bo'lishi uchun /data volume ulang
// (mount path: /data). Volume bo'lmasa ham ishlaydi, lekin deploy'da tozalanadi.
// TODO(db): jiddiy yuklamada PostgreSQL/Redis ga ko'chirish.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type Role = "student" | "parent";
export type SubjectStat = { answered: number; correct: number };

// Saqlanadigan to'liq yozuv (parol hash bilan).
export type StoredUser = {
  role: Role;
  username: string;
  salt: string;
  passHash: string;
  token: string;
  ism: string;
  familiya: string;
  tel: string;
  email: string;
  yosh?: string;
  viloyat?: string;
  manzil?: string;
  lat?: number | null;
  lng?: number | null;
  kasb?: string;
  subjects?: string[];
  childUsername?: string;
  premium: boolean;
  createdAt: string;
  streak: number;
  lastActiveDay: string;
  totalAnswered: number;
  totalCorrect: number;
  subjectStats: Record<string, SubjectStat>;
};

// Mijozga qaytariladigan (maxfiy maydonlarsiz).
export type PublicUser = Omit<StoredUser, "salt" | "passHash" | "token">;

function pickDataDir(): string {
  const candidates = [process.env.DATA_DIR, "/data", path.join(process.cwd(), ".data")].filter(
    Boolean,
  ) as string[];
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      return dir;
    } catch {
      /* keyingisini sinaymiz */
    }
  }
  return "/tmp";
}

const DATA_DIR = pickDataDir();
const FILE = path.join(DATA_DIR, "users.json");

export function loadUsers(): StoredUser[] {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: StoredUser[]): void {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

export const norm = (s: string) => s.trim().toLowerCase();

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 32).toString("hex");
}

export function makeSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function makeToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function publicUser(u: StoredUser): PublicUser {
  const { salt: _s, passHash: _p, token: _t, ...pub } = u;
  void _s;
  void _p;
  void _t;
  return pub;
}

// Kunlik streakni yangilaydi (login/me'da chaqiriladi).
export function bumpStreak(u: StoredUser): StoredUser {
  const today = new Date().toISOString().slice(0, 10);
  if (u.lastActiveDay === today) return u;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = u.lastActiveDay === yesterday ? u.streak + 1 : 1;
  return { ...u, streak: Math.max(1, streak), lastActiveDay: today };
}

export function findByToken(users: StoredUser[], username: string, token: string): StoredUser | null {
  const u = users.find((x) => norm(x.username) === norm(username));
  return u && u.token === token ? u : null;
}
