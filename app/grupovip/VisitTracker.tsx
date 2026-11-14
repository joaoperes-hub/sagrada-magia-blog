"use client";

import { useEffect } from "react";
import { track } from "./track";

export default function VisitTracker() {
  useEffect(() => {
    track("visit");
  }, []);
  return null;
}
