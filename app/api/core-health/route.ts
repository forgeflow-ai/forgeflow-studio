import { NextResponse } from "next/server";

/**
 * Server-side proxy endpoint for Core health check
 * /api/core-health → Core /health
 */
export async function GET() {
  // Support both NEXT_PUBLIC_API_BASE (for compatibility) and CORE_API_BASE (server-only)
  const base = process.env.CORE_API_BASE || process.env.NEXT_PUBLIC_API_BASE;
  
  if (!base) {
    return NextResponse.json(
      { 
        ok: false, 
        error: "Core API base URL not configured. Set CORE_API_BASE or NEXT_PUBLIC_API_BASE environment variable." 
      },
      { status: 500 }
    );
  }

  const coreUrl = `${base.replace(/\/$/, "")}/health`;
  const timeoutMs = 5000; // 5 second timeout

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(coreUrl, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Core health check failed with status ${res.status}`,
          status: res.status,
        },
        { status: 502 }
      );
    }

    // Try to parse JSON response
    let data: any;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      // If JSON parse fails, return raw text
      return NextResponse.json(
        {
          ok: false,
          error: "Core returned invalid JSON response",
          raw: text,
        },
        { status: 502 }
      );
    }

    // Return normalized response
    // If Core returns { ok: true, db_ok: true }, it will be in data
    return NextResponse.json({
      ok: true,
      status: res.status,
      data,
    });
  } catch (e: any) {
    // Handle timeout and other errors
    if (e.name === "AbortError") {
      return NextResponse.json(
        {
          ok: false,
          error: `Core health check timed out after ${timeoutMs}ms`,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: e?.message ?? "Failed to connect to Core service",
        details: process.env.NODE_ENV === "development" ? String(e) : undefined,
      },
      { status: 502 }
    );
  }
}
