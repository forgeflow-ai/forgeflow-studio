import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE; // HF Space variable
  if (!base) {
    return NextResponse.json(
      { ok: false, error: "NEXT_PUBLIC_API_BASE missing" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/health`, {
      cache: "no-store",
    });

    const text = await res.text(); // json parse fail olursa görmek için
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json({ ok: res.ok, status: res.status, data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "proxy fetch failed" },
      { status: 500 }
    );
  }
}
