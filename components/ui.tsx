"use client";

import React from "react";
import type { HeartRating, NafsStation } from "@/types";
import { HEART_RATING_STYLES, NAFS_STATION_STYLES } from "@/lib/data";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest mb-2 font-medium" style={{ color: "var(--text-tertiary)" }}>
      {children}
    </p>
  );
}

export function AyahBox({ text }: { text: string }) {
  return (
    <div
      className="border-l-2 pl-4 py-2 mb-5 rounded-r-lg text-[13px] italic leading-relaxed"
      style={{ borderColor: "var(--accent)", background: "var(--accent-light)", color: "var(--text-secondary)" }}
    >
      {text}
    </div>
  );
}

export function HeartRatingPill({ rating }: { rating: HeartRating }) {
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${HEART_RATING_STYLES[rating]}`}>
      {rating}
    </span>
  );
}

export function NafsPill({ station }: { station: NafsStation }) {
  return (
    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${NAFS_STATION_STYLES[station]}`}>
      {station}
    </span>
  );
}

export function PrimaryButton({
  children, onClick, disabled = false, fullWidth = false, type = "button",
}: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; fullWidth?: boolean; type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed ${fullWidth ? "w-full" : ""}`}
      style={{ background: "var(--accent)", color: "var(--surface-bg)" }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 py-2.5 rounded-lg text-sm transition-opacity hover:opacity-70"
      style={{
        background: "var(--surface-card-alt)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border-mid)",
      }}
    >
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <div
      className="spinner w-7 h-7 rounded-full border-2 mx-auto"
      style={{ borderColor: "var(--border-mid)", borderTopColor: "var(--accent)" }}
    />
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-[3px] rounded-full mb-8" style={{ background: "var(--border)" }}>
      <div
        className="progress-fill h-[3px] rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: "var(--accent)" }}
      />
    </div>
  );
}
