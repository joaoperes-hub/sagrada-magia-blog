import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Blog Sagrada Magia",
  description: "Conteúdo exclusivo sobre espiritualidade, meditação, cristais, tarô e bem-estar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiko:wght@400;600;700&family=Niramit:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HKM67P1ZLM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HKM67P1ZLM');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-sagrada-cream font-niramit antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
