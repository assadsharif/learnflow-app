"use client";

import { MessageSquare, Code2, Dumbbell, BookOpen, BarChart3 } from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: "chat" | "editor" | "exercises") => void;
}

const tabs = [
  { id: "chat" as const, icon: MessageSquare, label: "Chat" },
  { id: "editor" as const, icon: Code2, label: "Editor" },
  { id: "exercises" as const, icon: Dumbbell, label: "Exercises" },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-16 bg-surface-light border-r border-surface-lighter flex flex-col items-center py-4 gap-2">
      <div className="mb-4">
        <BookOpen className="w-8 h-8 text-primary" />
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
            activeTab === tab.id
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-gray-400 hover:bg-surface-lighter hover:text-white"
          )}
          title={tab.label}
        >
          <tab.icon className="w-5 h-5" />
        </button>
      ))}
      <div className="mt-auto">
        <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-surface-lighter hover:text-white transition-all" title="Progress">
          <BarChart3 className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
