"use client";

import { useState } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

// Links dos grupos, separados por vírgula, na variável de ambiente da Vercel
// NEXT_PUBLIC_WHATSAPP_GROUPS. Com mais de um link, cada visitante vai para um
// deles, dividindo a entrada entre os grupos. Quando um grupo enche, é só tirar
// o link dele da lista (e colocar o do grupo novo) e fazer um novo deploy.
const GROUP_LINKS = (process.env.NEXT_PUBLIC_WHATSAPP_GROUPS ?? "")
  .split(",")
  .map((l) => l.trim())
  .filter(Boolean);

function pickGroup() {
  if (GROUP_LINKS.length === 0) return null;
  return GROUP_LINKS[Math.floor(Math.random() * GROUP_LINKS.length)];
}

export default function JoinButton({ position }: { position: string }) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    const link = pickGroup();
    if (!link) {
      console.error("NEXT_PUBLIC_WHATSAPP_GROUPS não configurado");
      return;
    }
    setLoading(true);
    window.fbq?.("track", "Lead", { content_name: "Grupo VIP WhatsApp", content_category: position });
    window.gtag?.("event", "generate_lead", { method: "whatsapp_group", position });
    // Pequena pausa para o pixel enviar o evento antes de sair da página.
    setTimeout(() => {
      window.location.href = link;
    }, 350);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 font-amiko text-lg font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#1ebe5a] active:scale-[0.98] disabled:opacity-80"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43M20.08 3.9A11.3 11.3 0 0 0 12.05.58C5.79.58.7 5.67.7 11.92c0 2 .52 3.95 1.52 5.67L.6 23.42l5.97-1.57a11.3 11.3 0 0 0 5.47 1.4h.01c6.25 0 11.35-5.09 11.35-11.34 0-3.03-1.18-5.88-3.32-8.02" />
      </svg>
      {loading ? "Abrindo o WhatsApp…" : "Entrar no grupo VIP"}
    </button>
  );
}
