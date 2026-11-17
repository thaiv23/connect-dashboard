import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EUROPE INTELLIGENCE", template: "%s | EUROPE INTELLIGENCE" },
  description: "Market Research & Lead Intelligence Platform. Frontend prototype with demo data.",
};

/** Shell-free: the Admin area and the User Workspace each provide their own sidebar. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
