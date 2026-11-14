import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Registra visitas e cliques da landing page /grupovip.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const event = body?.event;
    const sid = typeof body?.sid === "string" ? body.sid.slice(0, 64) : "";
    const page = ["grupovip", "grupovip2"].includes(body?.page) ? body.page : "grupovip";
    const source = typeof body?.source === "string" ? body.source.slice(0, 40) : null;

    if ((event !== "visit" && event !== "click") || !sid) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("grupovip_events")
      .insert({
        event,
        page,
        session_id: sid,
        source,
        user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      });

    if (error) {
      console.error("grupovip track error", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("grupovip track error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
