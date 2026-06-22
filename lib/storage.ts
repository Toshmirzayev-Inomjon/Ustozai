// Ustoz AI web — localStorage saqlash qatlami (faqat brauzerda).
// TODO(backend): FastAPI + DB bilan almashtirish.
import type { User } from "./types";

const ACCOUNTS_KEY = "ustoz:accounts";
const SESSION_KEY = "ustoz:session";

const hasWindow = () => typeof window !== "undefined";

export function loadAccounts(): User[] {
  if (!hasWindow()) return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: User[]): void {
  if (!hasWindow()) return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function loadSession(): string | null {
  if (!hasWindow()) return null;
  return localStorage.getItem(SESSION_KEY);
}

export function saveSession(username: string): void {
  if (!hasWindow()) return;
  localStorage.setItem(SESSION_KEY, username);
}

export function clearSession(): void {
  if (!hasWindow()) return;
  localStorage.removeItem(SESSION_KEY);
}
