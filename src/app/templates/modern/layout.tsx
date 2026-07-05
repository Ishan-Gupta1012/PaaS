import type { Metadata } from "next";
import BackBar from "@/components/BackBar";

export const metadata: Metadata = {
  title: "Modern Clean — Template Preview | PortfolioOS",
  description:
    "Preview the Modern Clean portfolio template. Light mode, minimalist layout, clean typography — built for full-stack developers.",
};

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Back-to-marketplace bar sits above the template content */}
      <BackBar templateName="Modern Clean" />
      {/* Push template content below the 44px back bar */}
      <div style={{ paddingTop: "44px" }}>{children}</div>
    </div>
  );
}
