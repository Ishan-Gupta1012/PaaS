import type { Metadata } from "next";
import BackBar from "@/components/BackBar";

export const metadata: Metadata = {
  title: "Developer Pro — Template Preview | PortfolioOS",
  description: "Preview the Developer Pro portfolio template. Dark mode, IDE layout, teal accents — built for software engineers.",
};

export default function TemplateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090B" }}>
      {/* Back-to-marketplace bar sits above the template navbar */}
      <BackBar templateName="Developer Pro" />
      {/* Push the template content down below the 44px back bar */}
      <div style={{ paddingTop: "44px" }}>
        {children}
      </div>
    </div>
  );
}