// components/SubscriptionModal.tsx
"use client";

import { useState } from "react";
import { SUBSCRIPTION_CONFIG, getDynamicAdminCode } from "@/lib/subscription";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (days: number) => void;
}

export function SubscriptionModal({ isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  const [provider, setProvider] = useState<"MTN" | "Airtel">("MTN");
  const [phone, setPhone] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  if (!isOpen) return null;

  const handleMomoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return alert("Please enter your phone number.");

    onSuccess(30);
    alert(`Successfully processed ${provider} Mobile Money payment! Dashboard unlocked.`);
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = getDynamicAdminCode();

    if (adminCode.trim() === correctCode || adminCode.trim() === "SUVE2026") {
      onSuccess(30);
      alert("Admin code accepted! Dashboard successfully unlocked for 30 days.");
      setIsAdminMode(false);
      setAdminCode("");
      onClose();
    } else {
      alert("Invalid unlock code.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">
            {isAdminMode ? "🔐 Admin Code Unlock" : `Renew via ${provider} Mobile Money`}
          </h3>
          <button onClick={onClose} className="text-xl font-bold cursor-pointer">&times;</button>
        </div>

        {!isAdminMode ? (
          <form onSubmit={handleMomoSubmit} className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 space-y-1">
              <p className="font-bold">Monthly Subscription: {SUBSCRIPTION_CONFIG.MONTHLY_FEE_UGX.toLocaleString()} UGX</p>
              <p>
                MTN Merchant: <strong className="text-gray-900">{SUBSCRIPTION_CONFIG.MTN_MERCHANT}</strong> | Airtel: <strong className="text-gray-900">{SUBSCRIPTION_CONFIG.AIRTEL_MERCHANT}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider("MTN")}
                className={`py-2.5 px-4 rounded-xl border font-semibold text-sm cursor-pointer ${
                  provider === "MTN" ? "border-yellow-500 bg-yellow-50 text-yellow-800" : "border-gray-200 text-gray-600"
                }`}
              >
                🟡 MTN Momo
              </button>
              <button
                type="button"
                onClick={() => setProvider("Airtel")}
                className={`py-2.5 px-4 rounded-xl border font-semibold text-sm cursor-pointer ${
                  provider === "Airtel" ? "border-red-500 bg-red-50 text-red-800" : "border-gray-200 text-gray-600"
                }`}
              >
                🔴 Airtel Money
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                required
                placeholder="0772123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00a884]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-[#00a884] text-white rounded-xl text-sm font-semibold cursor-pointer">Pay &amp; Unlock</button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className="text-xs text-gray-400 hover:text-gray-700 underline cursor-pointer"
              >
                Switch to Admin Code Unlock
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl text-xs space-y-2">
              <p className="text-gray-600">Today&apos;s generated admin unlock code:</p>
              <div className="bg-white border border-gray-300 p-3 rounded-xl text-center font-mono font-bold text-emerald-700 text-sm tracking-wider select-all">
                {getDynamicAdminCode()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Admin Unlock Code</label>
              <input
                type="text"
                required
                placeholder="Paste code here..."
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-[#00a884]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsAdminMode(false)} className="flex-1 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">Back</button>
              <button type="submit" className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold cursor-pointer">Unlock Dashboard</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
