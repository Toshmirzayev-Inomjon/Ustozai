"use client";

// Ustoz AI web — autentifikatsiya konteksti (localStorage MVP).
// TODO(backend): FastAPI auth (JWT/cookie), parol hash, ko'p qurilma.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearSession,
  loadAccounts,
  loadSession,
  saveAccounts,
  saveSession,
} from "./storage";
import { todayKey, type ParentDraft, type StudentDraft, type User } from "./types";

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthValue = {
  user: User | null;
  loading: boolean;
  registerStudent: (d: StudentDraft, username: string, password: string) => AuthResult;
  registerParent: (d: ParentDraft, username: string, password: string) => AuthResult;
  login: (username: string, password: string) => AuthResult;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  changeProfession: (kasb: string, subjects: string[]) => void;
  recordAnswer: (subject: string, correct: boolean) => void;
};

const AuthContext = createContext<AuthValue | null>(null);
const norm = (s: string) => s.trim().toLowerCase();

function bumpStreak(u: User): User {
  const today = todayKey();
  if (u.lastActiveDay === today) return u;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = u.lastActiveDay === yesterday ? u.streak + 1 : 1;
  return { ...u, streak: Math.max(1, streak), lastActiveDay: today };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setAccounts(loadAccounts());
      setUsername(loadSession());
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((next: User[]) => {
    setAccounts(next);
    saveAccounts(next);
  }, []);

  const user = useMemo(
    () => accounts.find((a) => norm(a.username) === norm(username ?? "")) ?? null,
    [accounts, username],
  );

  // Streakni sessiya tiklanganda yangilaymiz.
  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      const bumped = bumpStreak(user);
      if (bumped !== user) persist(accounts.map((a) => (a.username === user.username ? bumped : a)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const baseNew = (username: string, password: string) => ({
    username,
    password,
    premium: false,
    createdAt: new Date().toISOString(),
    streak: 1,
    lastActiveDay: todayKey(),
    totalAnswered: 0,
    totalCorrect: 0,
    subjectStats: {},
  });

  const checkCreds = useCallback(
    (u: string, password: string): AuthResult => {
      if (u.trim().length < 3) return { ok: false, error: "Foydalanuvchi nomi kamida 3 ta belgi." };
      if (password.length < 4) return { ok: false, error: "Parol kamida 4 ta belgi." };
      if (accounts.some((a) => norm(a.username) === norm(u))) return { ok: false, error: "Bu foydalanuvchi nomi band." };
      return { ok: true };
    },
    [accounts],
  );

  const registerStudent = useCallback<AuthValue["registerStudent"]>(
    (d, uname, password) => {
      const check = checkCreds(uname, password);
      if (!check.ok) return check;
      const newUser: User = { role: "student", ...baseNew(uname.trim(), password), ...d };
      persist([...accounts, newUser]);
      saveSession(uname.trim());
      setUsername(uname.trim());
      return { ok: true };
    },
    [accounts, checkCreds, persist],
  );

  const registerParent = useCallback<AuthValue["registerParent"]>(
    (d, uname, password) => {
      const check = checkCreds(uname, password);
      if (!check.ok) return check;
      const newUser: User = { role: "parent", ...baseNew(uname.trim(), password), ...d };
      persist([...accounts, newUser]);
      saveSession(uname.trim());
      setUsername(uname.trim());
      return { ok: true };
    },
    [accounts, checkCreds, persist],
  );

  const login = useCallback<AuthValue["login"]>(
    (uname, password) => {
      const found = accounts.find((a) => norm(a.username) === norm(uname));
      if (!found) return { ok: false, error: "Bunday foydalanuvchi topilmadi." };
      if (found.password !== password) return { ok: false, error: "Parol noto‘g‘ri." };
      saveSession(found.username);
      setUsername(found.username);
      return { ok: true };
    },
    [accounts],
  );

  const logout = useCallback(() => {
    clearSession();
    setUsername(null);
  }, []);

  const updateUser = useCallback<AuthValue["updateUser"]>(
    (patch) => {
      if (!user) return;
      persist(accounts.map((a) => (a.username === user.username ? { ...a, ...patch } : a)));
    },
    [accounts, persist, user],
  );

  const changeProfession = useCallback<AuthValue["changeProfession"]>(
    (kasb, subjects) => updateUser({ kasb, subjects }),
    [updateUser],
  );

  const recordAnswer = useCallback<AuthValue["recordAnswer"]>(
    (subject, correct) => {
      if (!user) return;
      const stat = user.subjectStats[subject] ?? { answered: 0, correct: 0 };
      updateUser({
        totalAnswered: user.totalAnswered + 1,
        totalCorrect: user.totalCorrect + (correct ? 1 : 0),
        subjectStats: {
          ...user.subjectStats,
          [subject]: { answered: stat.answered + 1, correct: stat.correct + (correct ? 1 : 0) },
        },
      });
    },
    [updateUser, user],
  );

  const value = useMemo<AuthValue>(
    () => ({ user, loading, registerStudent, registerParent, login, logout, updateUser, changeProfession, recordAnswer }),
    [user, loading, registerStudent, registerParent, login, logout, updateUser, changeProfession, recordAnswer],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak.");
  return ctx;
}
