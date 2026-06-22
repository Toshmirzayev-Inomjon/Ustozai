"use client";

import ChatPanel from "@/components/chat/ChatPanel";
import { useAuth } from "@/lib/auth";

export default function UstozPage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto h-[calc(100dvh-72px)] max-w-3xl p-4 md:h-dvh">
      <ChatPanel
        title="Ustoz AI"
        subtitle={user?.kasb ? `${user.kasb} · doim onlayn` : "doim onlayn"}
      />
    </div>
  );
}
