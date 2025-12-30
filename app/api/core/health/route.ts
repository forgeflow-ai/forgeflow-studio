import { NextResponse } from "next/server";

export async function GET() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE ||
    "";

  if (!base) {
    return NextResponse.json({ error: "API_BASE missing" }, { status: 500 });
  }

  const url = `${base.replace(/\/$/, "")}/health`;

  try {
    const r = await fetch(url, { cache: "no-store" });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { error: "core_unreachable", detail: String(e?.message || e) },
      { status: 502 }
    );
  }
}
