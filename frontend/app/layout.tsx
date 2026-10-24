import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "VerifyRight AI | Institutional Verification", description: "Evidence-based institutional application review prototype" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
