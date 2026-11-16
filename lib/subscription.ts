// lib/subscription.ts
"use client";

export const SUBSCRIPTION_CONFIG = {
  MONTHLY_FEE_UGX: 5000,
  MTN_MERCHANT: "67117277",
  AIRTEL_MERCHANT: "654237",
};

// Generate dynamic admin unlock code based on today's date
export function getDynamicAdminCode(): string {
  const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `SUVE-${todayStr}-UGX`;
}
