import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Script from "next/script";
import JoinButton from "./JoinButton";
import VisitTracker from "./VisitTracker";

const PIXEL_ID = "274714594082035";

const cinzel = { className: "font-[Cinzel,Georgia,serif]" };

export const metadata: Metadata = {
  title: "Black Week Sagrada Magia: Grupo VIP",
  description: "A senha da Black Week está no grupo VIP da Sagrada Magia no WhatsApp.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#140a24",
};

export default function GrupoVipPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#120822] text-white">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap"
        precedence="default"
      />
      <VisitTracker />
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

      <Image
        src="/grupovip/fundo.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#120822]/30 via-transparent to-[#120822]/80" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-md flex-col items-center px-5 pb-6 pt-8 text-center">
        <p className={`${cinzel.className} text-xs font-bold tracking-[0.35em] text-[#f3c45a]`}>
          SAGRADA MAGIA
        </p>

        <Image
          src="/grupovip/black-week.webp"
          alt="Black Week"
          width={611}
          height={403}
          priority
          className="mt-4 w-60 drop-shadow-[0_0_25px_rgba(201,92,255,0.45)] sm:w-72"
        />

        <h1
          className={`${cinzel.className} mt-5 text-[1.65rem] font-black leading-tight text-[#f7cf62] drop-shadow-[0_2px_12px_rgba(247,180,60,0.45)] sm:text-3xl`}
        >
          A senha da Black está no Grupo VIP 🔒
        </h1>

        <p className="mt-3 text-base leading-snug text-white/90">
          No início da Black o site fica fechado.
          <br />
          Só quem está no grupo recebe a senha.
        </p>

        <div className="mt-7 w-full">
          <JoinButton />
          <p className="mt-3 text-sm text-white/60">Grátis · leva 5 segundos</p>
        </div>

        <Image
          src="/grupovip/bruxa.webp"
          alt=""
          width={574}
          height={689}
          className="mt-auto w-56 translate-x-10 pt-6 drop-shadow-[0_0_30px_rgba(160,70,255,0.35)] sm:w-64"
        />
      </div>
    </main>
  );
}
