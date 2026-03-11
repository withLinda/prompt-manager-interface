// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Prompt Manager",
  description: "A refined local-first workspace for writing, sorting, and reusing AI prompts.",
  keywords: "prompt manager, AI prompts, local prompt library, prompt organization",
  authors: [{ name: "Prompt Manager" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E2326",
};

const themeInitScript = `
  (() => {
    const root = document.documentElement;
    let theme = "dark";

    try {
      const storedTheme = window.localStorage.getItem("prompt-theme");

      if (storedTheme === "\\"light\\"" || storedTheme === "light") {
        theme = "light";
      }

      if (storedTheme === "\\"dark\\"" || storedTheme === "dark") {
        theme = "dark";
      }
    } catch (error) {
      console.error("Failed to restore prompt theme:", error);
    }

    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "light" ? "#f5efe7" : "#1E2326");
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${manrope.variable} ${cormorant.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
