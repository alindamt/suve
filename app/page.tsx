"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Save username locally for the dashboard header, then route to /dashboard
    localStorage.setItem("suve_user", username.trim() || "obaa");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      {/* App Logo Badge */}
      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg shadow-purple-200/70 flex items-center justify-center mb-6">
        <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
          <path d="M24 6L40 15V33L24 42L8 33V15L24 6Z" fill="#0F172A" />
          <path d="M24 6L40 15L24 24L8 15L24 6Z" fill="#6D28D9" />
          <path
            d="M24 14L31 27H26V36H22V27H17L24 14Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Brand Title */}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
        Suve
      </h1>
      <p className="text-sm text-slate-500 mb-8">Sign in to continue</p>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-[#6D28D9] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#6D28D9] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold py-3.5 rounded-xl shadow-md shadow-purple-200 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Footer Links */}
      <p className="mt-7 text-sm text-slate-500">
        New to Suve?{" "}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[#6D28D9] font-semibold hover:underline cursor-pointer"
        >
          Start a free trial
        </button>
      </p>
      <p className="mt-4 text-xs text-slate-400">Version 1.0.0</p>
    </div>
  );
}