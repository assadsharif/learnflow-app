"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import CodeEditor from "@/components/CodeEditor";
import AuthGuard from "@/components/AuthGuard";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "editor" | "exercises">("chat");
  const { data: session } = useSession();
  const sessionId = session?.user?.id || `session-${Date.now()}`;

  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userName={session?.user?.name} />
        <main className="flex-1 flex">
          {activeTab === "chat" && <ChatPanel sessionId={sessionId} />}
          {activeTab === "editor" && <CodeEditor sessionId={sessionId} />}
          {activeTab === "exercises" && (
            <div className="flex-1 flex items-center justify-center text-surface-lighter">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Exercises</h2>
                <p className="text-gray-400">Ask the AI for a Python exercise to get started!</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
