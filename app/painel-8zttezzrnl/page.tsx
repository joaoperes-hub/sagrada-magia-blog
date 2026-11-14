import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import AutoRefresh from "./AutoRefresh";

export const metadata: Metadata = {
  title: "Painel Grupo VIP",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#120822" };

type Linha = { visitas: number; sessoes: number; cliques: number; sessoes_clique: number };
type Dia = Linha & { dia: string };
type Origem = { origem: string; sessoes: number; sessoes_clique: number };
type Stats = {
  resumo: Record<"hoje" | "7d" | "total", Linha>;
  diario: Dia[];
  origem: Origem[];
  atualizado: string;
};

const vazio: Linha = { visitas: 0, sessoes: 0, cliques: 0, sessoes_clique: 0 };

function taxa(l: { sessoes: number; sessoes_clique: number }) {
  return l.sessoes ? (l.sessoes_clique / l.sessoes) * 100 : 0;
}
const pct = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
const num = (n: number) => n.toLocaleString("pt-BR");

function dataCurta(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return dt.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "UTC" });
}

async function getStats(): Promise<Stats | null> {
  const { data, error } = await getSupabaseAdmin().rpc("grupovip_stats", { dias: 14 });
  if (error) {
    console.error("painel grupovip", error);
    return null;
  }
  return data as Stats;
}

export default async function PainelGrupoVip() {
  await connection();
  const stats = await getStats();

  if (!stats) {
    return (
      <main className="min-h-screen bg-[#120822] p-6 text-white">
        <p>Não consegui carregar os dados agora. Atualize a página em instantes.</p>
      </main>
    );
  }

  const r = {
    hoje: stats.resumo?.hoje ?? vazio,
    "7d": stats.resumo?.["7d"] ?? vazio,
    total: stats.resumo?.total ?? vazio,
  };
  const maxDia = Math.max(1, ...stats.diario.map((d) => d.sessoes));
  const atualizado = new Date(stats.atualizado).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bahia",
  });

  const periodos: { chave: keyof typeof r; nome: string }[] = [
    { chave: "hoje", nome: "Hoje" },
    { chave: "7d", nome: "7 dias" },
    { chave: "total", nome: "Total" },
  ];

  return (
    <main className="min-h-screen bg-[#120822] text-white">
      <AutoRefresh seconds={60} />
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <header className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f3c45a]">Sagrada Magia</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Painel do Grupo VIP</h1>
            <a
              href="/grupovip"
              target="_blank"
              className="mt-1 inline-block text-sm text-white/50 underline-offset-2 hover:underline"
            >
              blog.sagradamagia.com/grupovip
            </a>
          </div>
          <p className="text-xs text-white/50">Atualizado às {atualizado} · atualiza sozinho a cada minuto</p>
        </header>

        {/* Destaques do total */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card titulo="Sessões" valor={num(r.total.sessoes)} sub="pessoas que abriram a página" />
          <Card titulo="Visitas" valor={num(r.total.visitas)} sub="carregamentos da página" />
          <Card titulo="Cliques no link" valor={num(r.total.cliques)} sub={`${num(r.total.sessoes_clique)} sessões clicaram`} />
          <Card
            titulo="Conversão"
            valor={pct(taxa(r.total))}
            sub="sessões que clicaram"
            destaque
          />
        </section>

        {/* Por período */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Por período</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <table className="w-full text-sm">
              <thead className="text-left text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Período</th>
                  <th className="px-2 py-3 text-right font-medium">Sessões</th>
                  <th className="px-2 py-3 text-right font-medium">Cliques</th>
                  <th className="px-4 py-3 text-right font-medium">Conversão</th>
                </tr>
              </thead>
              <tbody>
                {periodos.map(({ chave, nome }) => (
                  <tr key={chave} className="border-t border-white/10">
                    <td className="px-4 py-3 font-medium">{nome}</td>
                    <td className="px-2 py-3 text-right tabular-nums">{num(r[chave].sessoes)}</td>
                    <td className="px-2 py-3 text-right tabular-nums">{num(r[chave].cliques)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#f3c45a]">
                      {pct(taxa(r[chave]))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dia a dia */}
        <section className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Últimos 14 dias</h2>
            <div className="flex gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#8b3fd1]" /> Sessões
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#f3c45a]" /> Clicaram
              </span>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {stats.diario.map((d) => (
              <li key={d.dia} className="grid grid-cols-[5.5rem_1fr_4.5rem] items-center gap-3 text-sm">
                <span className="capitalize text-white/60">{dataCurta(d.dia)}</span>
                <div className="relative h-6 overflow-hidden rounded-md bg-white/[0.05]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-md bg-[#8b3fd1]"
                    style={{ width: `${(d.sessoes / maxDia) * 100}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-md bg-[#f3c45a]"
                    style={{ width: `${(d.sessoes_clique / maxDia) * 100}%` }}
                  />
                  <span className="absolute inset-y-0 left-2 flex items-center text-xs font-medium text-white drop-shadow">
                    {d.sessoes > 0 ? `${num(d.sessoes)} · ${num(d.sessoes_clique)}` : ""}
                  </span>
                </div>
                <span className="text-right tabular-nums text-white/80">
                  {d.sessoes > 0 ? pct(taxa(d)) : "–"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Origem */}
        <section className="mt-8 pb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">De onde vieram</h2>
          {stats.origem.length === 0 ? (
            <p className="mt-3 text-sm text-white/50">Ainda sem visitas registradas.</p>
          ) : (
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <table className="w-full text-sm">
                <thead className="text-left text-white/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Origem</th>
                    <th className="px-2 py-3 text-right font-medium">Sessões</th>
                    <th className="px-2 py-3 text-right font-medium">Clicaram</th>
                    <th className="px-4 py-3 text-right font-medium">Conversão</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.origem.map((o) => (
                    <tr key={o.origem} className="border-t border-white/10">
                      <td className="px-4 py-3 font-medium capitalize">{o.origem}</td>
                      <td className="px-2 py-3 text-right tabular-nums">{num(o.sessoes)}</td>
                      <td className="px-2 py-3 text-right tabular-nums">{num(o.sessoes_clique)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#f3c45a]">{pct(taxa(o))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            Sessão = uma pessoa com a página aberta (recarregar conta como nova visita, não nova sessão).
            Conversão = sessões que clicaram no botão ÷ sessões. Contagem começou em 14/11/2026.
          </p>
        </section>
      </div>
    </main>
  );
}

function Card({ titulo, valor, sub, destaque }: { titulo: string; valor: string; sub: string; destaque?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        destaque ? "border-[#f3c45a]/60 bg-[#f3c45a]/10" : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-white/60">{titulo}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${destaque ? "text-[#f3c45a]" : ""}`}>{valor}</p>
      <p className="mt-1 text-xs text-white/50">{sub}</p>
    </div>
  );
}
