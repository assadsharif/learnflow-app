"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Play, Send, RotateCcw } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const DEFAULT_CODE = `# Write your Python code here
def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}! Welcome to LearnFlow."

# Test your function
print(greet("Student"))
`;

export default function CodeEditor({ sessionId }: { sessionId: string }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState("");

  const handleRun = () => {
    setOutput("# Code execution is available when connected to the backend.\n# Use the 'Submit for Review' button to get AI feedback on your code.");
  };

  const handleReview = async () => {
    setReviewing(true);
    setReview("");
    try {
      const res = await fetch("/api/v1/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, session_id: sessionId, language: "python" }),
      });
      const data = await res.json();
      setReview(data.feedback);
    } catch {
      setReview("Failed to get review. Please try again.");
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-surface-lighter flex items-center justify-between px-6">
        <h1 className="font-semibold">Code Editor</h1>
        <div className="flex gap-2">
          <button onClick={() => setCode(DEFAULT_CODE)} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-surface-lighter hover:bg-surface-light transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleRun} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-accent-green/20 text-accent-green hover:bg-accent-green/30 transition-colors">
            <Play className="w-4 h-4" /> Run
          </button>
          <button onClick={handleReview} disabled={reviewing} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors">
            <Send className="w-4 h-4" /> {reviewing ? "Reviewing..." : "Submit for Review"}
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 border-r border-surface-lighter">
          <MonacoEditor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              roundedSelection: true,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="w-[400px] flex flex-col">
          {output && (
            <div className="border-b border-surface-lighter p-4">
              <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase">Output</h3>
              <pre className="text-sm text-accent-green font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          )}
          {review && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase">AI Review</h3>
              <div className="text-sm whitespace-pre-wrap">{review}</div>
            </div>
          )}
          {!output && !review && (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
              Run your code or submit it for AI review to see results here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
