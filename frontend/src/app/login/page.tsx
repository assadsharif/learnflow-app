"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { BookOpen, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn.email({ email, password });
        if (error) {
          setError(error.message || "Invalid credentials");
          return;
        }
      } else {
        const { error } = await signUp.email({ email, password, name });
        if (error) {
          setError(error.message || "Sign up failed");
          return;
        }
      }
      router.push("/");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">LearnFlow</h1>
          <p className="text-gray-400 mt-1">AI-powered Python tutor</p>
        </div>

        <div className="bg-surface-light rounded-2xl p-6 border border-surface-lighter">
          <div className="flex mb-6 bg-surface rounded-xl p-1">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLogin ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isLogin ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required={!isLogin}
                  className="w-full bg-surface border border-surface-lighter rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-surface border border-surface-lighter rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={8}
                className="w-full bg-surface border border-surface-lighter rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
