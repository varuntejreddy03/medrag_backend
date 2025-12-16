import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedRAG - AI Medical Diagnosis",
  description: "AI-powered medical diagnosis system using RAG technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="http://localhost:8000" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
