import type { Metadata, Viewport } from "next";
import Landing from "./Landing";

export const metadata: Metadata = {
  title: "Black Week Sagrada Magia: Grupo VIP",
  description: "A senha da Black Week está no grupo VIP da Sagrada Magia no WhatsApp.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#140a24",
};

export default function Page() {
  return <Landing pagina="grupovip" />;
}
