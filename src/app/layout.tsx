import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finova",
  description: "Mobile-first personal finance and budgeting app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
