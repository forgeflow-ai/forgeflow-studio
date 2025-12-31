import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy endpoint for Core health check
 * /api/core-health → Core /health
 */
export async function GET(request: NextRequest) {
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

  // Extract Authorization header from request
  const authHeader = request.headers.get("authorization");
  
  const coreUrl = `${base.replace(/\/$/, "")}/health`;
  const timeoutMs = 5000; // 5 second timeout

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Prepare headers for Core API request
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Forward Authorization header if present
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(coreUrl, {
      cache: "no-store",
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    // Check if auth was successful based on response status
    // 401/403 typically means auth failed
    const authOk = res.status !== 401 && res.status !== 403;
    const authProvided = authHeader !== null;

    // Try to parse JSON response (even if status is not ok, we still want to parse it)
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
          auth_ok: authProvided ? authOk : null,
        },
        { status: 502 }
      );
    }

    // If request failed but not due to auth, return error
    if (!res.ok && res.status !== 401 && res.status !== 403) {
      return NextResponse.json(
        {
          ok: false,
          error: `Core health check failed with status ${res.status}`,
          status: res.status,
          auth_ok: authProvided ? authOk : null,
          data,
        },
        { status: 502 }
      );
    }

    // Return normalized response
    // If auth failed (401/403), still return data but with auth_ok: false
    // If Core returns { ok: true, db_ok: true }, it will be in data
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      auth_ok: authProvided ? authOk : null, // null if no auth header provided
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
