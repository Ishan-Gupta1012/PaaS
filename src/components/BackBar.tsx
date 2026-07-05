"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackBar({ templateName }: { templateName: string }) {
  const router = useRouter();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "rgba(9,9,11,0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(45,212,191,0.15)",
        fontFamily: "'Inter',-apple-system,sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Left — back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#A1A1AA",
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "inherit",
          padding: "4px 0",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#A1A1AA")}
        aria-label="Back to Template Marketplace"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Marketplace
      </button>

      {/* Center — breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#52525B", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        <Link href="/dashboard/templates" style={{ color: "#52525B", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#A1A1AA")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#52525B")}>
          Templates
        </Link>
        <span style={{ color: "#3F3F46" }}>/</span>
        <span style={{ color: "#A1A1AA", fontWeight: 500 }}>{templateName}</span>
      </div>

      {/* Right — use template CTA */}
      <Link
        href="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 14px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          backgroundColor: "#2DD4BF",
          color: "#09090B",
          textDecoration: "none",
          transition: "transform 0.15s, box-shadow 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(45,212,191,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Use Template
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}