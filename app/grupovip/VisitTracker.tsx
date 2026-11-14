"use client";

import { useEffect } from "react";
import { track } from "./track";

export default function VisitTracker({ pagina }: { pagina: string }) {
  useEffect(() => {
    track("visit", pagina);
  }, [pagina]);
  return null;
}
