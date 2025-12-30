import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function withTimeout(ms: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { controller, clear: () => clearTimeout(id) };
}

export async function GET() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.CORE_API_BASE;

  if (!base) {
    return NextResponse.json(
      { ok: false, error: "Missing env: NEXT_PUBLIC_API_BASE (or CORE_API_BASE)" },
      { status: 500 }
    );
  }

  const url = `${base.replace(/\/$/, "")}/health`;

  const t = withTimeout(8000);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: t.controller.signal,
      headers: { Accept: "application/json" },
    });

    const text = await res.text();
    let data: any = text;
    try {
      data = JSON.parse(text);
    } catch {}

    return NextResponse.json(
      { ok: res.ok, status: res.status, url, data },
      { status: res.ok ? 200 : 502 }
    );
  } catch (e: any) {
    // fetch failed gibi saçma mesajları kırıp içini gösteriyoruz
    return NextResponse.json(
      {
        ok: false,
        url,
        error: String(e?.message || e),
        name: e?.name,
        cause: e?.cause ? String(e.cause) : null,
      },
      { status: 502 }
    );
  } finally {
    t.clear();
  }
}
