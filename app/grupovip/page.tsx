import type { Metadata } from "next";
import Script from "next/script";
import JoinButton from "./JoinButton";

const PIXEL_ID = "274714594082035";

export const metadata: Metadata = {
  title: "Grupo VIP Sagrada Magia",
  description: "Entre no grupo VIP da Sagrada Magia no WhatsApp.",
  robots: { index: false, follow: false },
};

export default function GrupoVipPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sagrada-cream px-4">
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>

      <div className="w-full max-w-md text-center">
        <p className="font-amiko text-sm font-semibold uppercase tracking-[0.25em] text-sagrada-magenta-dark">
          Sagrada Magia
        </p>
        <h1 className="mt-4 font-amiko text-3xl font-bold leading-tight text-sagrada-black sm:text-4xl">
          Grupo VIP no WhatsApp
        </h1>
        <p className="mt-3 text-base text-sagrada-gray-dark">
          Ofertas antes de todo mundo e cupons exclusivos.
        </p>
        <div className="mt-8">
          <JoinButton />
        </div>
      </div>
    </main>
  );
}
