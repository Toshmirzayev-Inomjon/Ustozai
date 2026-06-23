"use client";

// Ustoz AI web — autentifikatsiya (umumiy online backend: /api/auth/*).
// Sayt va mobil ilova bitta akkauntdan foydalanadi. Sessiya localStorage'da (username+token).
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { todayKey, type ParentDraft, type StudentDraft, type User } from "./types";

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthValue = {
  user: User | null;
  loading: boolean;
  registerStudent: (d: StudentDraft, username: string, password: string) => Promise<AuthResult>;
  registerParent: (d: ParentDraft, username: string, password: string) => Promise<AuthResult>;
  login: (username: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => Promise<void>;
  changeProfession: (kasb: string, subjects: string[]) => Promise<void>;
  recordAnswer: (subject: string, correct: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);
const SESSION_KEY = "ustoz:session";

type Session = { username: string; token: string };

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function api<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: "Server javob bermadi." })) as Promise<T>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mount'da sessiyani tiklaymiz.
  useEffect(() => {
    const s = readSession();
    if (!s) {
      setLoading(false);
      return;
    }
    (async () => {
      const data = await api<{ ok: boolean; user?: User }>("/api/auth/me", s);
      if (data.ok && data.user) {
        setUser(data.user);
        setToken(s.token);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
      setLoading(false);
    })();
  }, []);

  const persistSession = useCallback((username: string, tok: string, u: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username, token: tok }));
    setToken(tok);
    setUser(u);
  }, []);

  const register = useCallback(
    async (role: "student" | "parent", draft: object, username: string, password: string): Promise<AuthResult> => {
      const data = await api<{ ok: boolean; error?: string; user?: User; token?: string }>(
        "/api/auth/register",
        { role, username, password, ...draft },
      );
      if (!data.ok || !data.user || !data.token) return { ok: false, error: data.error || "Xatolik." };
      persistSession(username, data.token, data.user);
      return { ok: true };
    },
    [persistSession],
  );

  const registerStudent = useCallback<AuthValue["registerStudent"]>(
    (d, u, p) => register("student", d, u, p),
    [register],
  );
  const registerParent = useCallback<AuthValue["registerParent"]>(
    (d, u, p) => register("parent", d, u, p),
    [register],
  );

  const login = useCallback<AuthValue["login"]>(async (username, password) => {
    const data = await api<{ ok: boolean; error?: string; user?: User; token?: string }>(
      "/api/auth/login",
      { username, password },
    );
    if (!data.ok || !data.user || !data.token) return { ok: false, error: data.error || "Xatolik." };
    persistSession(username, data.token, data.user);
    return { ok: true };
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback<AuthValue["updateUser"]>(
    async (patch) => {
      if (!user || !token) return;
      setUser({ ...user, ...patch }); // optimistik
      const data = await api<{ ok: boolean; user?: User }>("/api/auth/update", {
        username: user.username,
        token,
        patch,
      });
      if (data.ok && data.user) setUser(data.user);
    },
    [user, token],
  );

  const changeProfession = useCallback<AuthValue["changeProfession"]>(
    (kasb, subjects) => updateUser({ kasb, subjects }),
    [updateUser],
  );

  const recordAnswer = useCallback<AuthValue["recordAnswer"]>(
    async (subject, correct) => {
      if (!user) return;
      const stat = user.subjectStats[subject] ?? { answered: 0, correct: 0 };
      await updateUser({
        lastActiveDay: todayKey(),
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
