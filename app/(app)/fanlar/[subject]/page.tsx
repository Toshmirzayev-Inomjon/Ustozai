"use client";

import { use } from "react";
import Link from "next/link";
import ChatPanel from "@/components/chat/ChatPanel";

export default function SubjectChatPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = use(params);
  const name = decodeURIComponent(subject);

  return (
    <div className="mx-auto flex h-[calc(100dvh-72px)] max-w-3xl flex-col p-4 md:h-dvh">
      <Link href="/fanlar" className="mb-3 text-sm font-bold text-cobalt">
        ← Fanlar
      </Link>
      <div className="flex-1">
        <ChatPanel subject={name} title={name} subtitle="dars · onlayn" />
      </div>
    </div>
  );
}
