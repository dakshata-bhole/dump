import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "20",
  description: "Private Access",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
