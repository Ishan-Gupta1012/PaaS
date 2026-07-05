import type { Metadata } from "next";
import BackBar from "@/components/BackBar";

export const metadata: Metadata = {
  title: "Creative Edge — Template Preview | PortfolioOS",
  description:
    "Preview the Creative Edge portfolio template. Vibrant purple-pink gradients, WebGL animations, and GSAP motion — built for creative technologists.",
};

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060814" }}>
      {/* Back-to-marketplace bar sits above the template content */}
      <BackBar templateName="Creative Edge" />
      {/* Push template content below the 44px back bar */}
      <div style={{ paddingTop: "44px" }}>{children}</div>
    </div>
  );
}
