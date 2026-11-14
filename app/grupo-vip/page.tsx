import type { Metadata } from "next";
import Script from "next/script";
import JoinButton from "./JoinButton";

const PIXEL_ID = "274714594082035";

export const metadata: Metadata = {
  title: "Grupo VIP Sagrada Magia no WhatsApp",
  description:
    "Entre no grupo VIP da Sagrada Magia: ofertas antes de todo mundo, cupons exclusivos e aviso das lives e lançamentos.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Grupo VIP Sagrada Magia",
    description: "Ofertas antes de todo mundo, cupons exclusivos e aviso das lives. É grátis.",
  },
};

const benefits = [
  {
    icon: "✦",
    title: "Ofertas antes de todo mundo",
    text: "Promoções e reposições chegam primeiro no grupo, antes do site e do Instagram.",
  },
  {
    icon: "☾",
    title: "Cupons exclusivos",
    text: "Descontos que só quem está no grupo recebe.",
  },
  {
    icon: "◈",
    title: "Lives e lançamentos",
    text: "Aviso na hora das lives, das peças novas e dos cristais raros que esgotam rápido.",
  },
];

export default function GrupoVipPage() {
  return (
    <main className="min-h-screen bg-sagrada-cream">
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
          fbq('track', 'ViewContent', {content_name: 'Grupo VIP WhatsApp'});
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>

      <section className="mx-auto flex max-w-xl flex-col items-center px-4 pb-10 pt-12 text-center sm:pt-16">
        <a
          href="https://sagradamagia.com"
          className="font-amiko text-sm font-semibold uppercase tracking-[0.25em] text-sagrada-magenta-dark"
        >
          Sagrada Magia
        </a>

        <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-sagrada-mint px-4 py-1.5 text-sm font-semibold text-sagrada-black">
          <span className="h-2 w-2 rounded-full bg-[#25D366]" aria-hidden />
          Grupo gratuito no WhatsApp
        </span>

        <h1 className="mt-5 font-amiko text-4xl font-bold leading-tight text-sagrada-black sm:text-5xl">
          Entre no <span className="text-sagrada-magenta-dark">Grupo VIP</span> da Sagrada Magia
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-sagrada-gray-dark">
          Ofertas antes de todo mundo, cupons que só o grupo recebe e o aviso das lives e dos
          cristais que esgotam rápido.
        </p>

        <div className="mt-8 w-full">
          <JoinButton position="topo" />
          <p className="mt-3 text-sm text-sagrada-gray-medium">
            Só a gente posta. Sem spam, e você sai quando quiser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 pb-10">
        <ul className="grid gap-3">
          {benefits.map((b) => (
            <li
              key={b.title}
              className="flex items-start gap-4 rounded-2xl border border-sagrada-gray-light bg-white/60 p-5 text-left"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sagrada-pink-light text-lg text-sagrada-pink-dark"
                aria-hidden
              >
                {b.icon}
              </span>
              <div>
                <h2 className="font-amiko text-base font-semibold text-sagrada-black">{b.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-sagrada-gray-dark">{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-xl px-4 pb-16 text-center">
        <div className="rounded-3xl bg-sagrada-black px-6 py-10 text-sagrada-cream">
          <p className="font-amiko text-2xl font-bold">Leva 5 segundos.</p>
          <p className="mt-2 text-sagrada-gray-light">
            Clique, o WhatsApp abre e é só tocar em &ldquo;Entrar no grupo&rdquo;.
          </p>
          <div className="mt-6">
            <JoinButton position="rodape" />
          </div>
        </div>
        <p className="mt-8 text-xs text-sagrada-gray-medium">
          © Sagrada Magia ·{" "}
          <a href="https://sagradamagia.com" className="underline">
            sagradamagia.com
          </a>
        </p>
      </section>
    </main>
  );
}
