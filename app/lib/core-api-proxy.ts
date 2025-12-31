import { NextRequest } from "next/server";

/**
 * Generic proxy function for Core API endpoints
 */
export async function proxyToCore(
  request: NextRequest,
  path: string,
  options: {
    method?: string;
    body?: any;
  } = {}
) {
  const base = process.env.CORE_API_BASE || process.env.NEXT_PUBLIC_API_BASE;

  if (!base) {
    return {
      error: "Core API base URL not configured",
      status: 500,
    };
  }

  const authHeader = request.headers.get("authorization");
  const method = options.method || request.method;
  const coreUrl = `${base.replace(/\/$/, "")}${path}`;
  const timeoutMs = 10000; // 10 second timeout

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const fetchOptions: RequestInit = {
      method,
      cache: "no-store",
      signal: controller.signal,
      headers,
    };

    // Handle body - options.body takes priority, otherwise try to read from request
    if (options.body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = JSON.stringify(options.body);
    } else if (method === "POST" || method === "PUT" || method === "PATCH") {
      // Try to clone request to read body (if not already consumed)
      try {
        const clonedRequest = request.clone();
        const body = await clonedRequest.json().catch(() => null);
        if (body && Object.keys(body).length > 0) {
          fetchOptions.body = JSON.stringify(body);
        }
      } catch {
        // Body already consumed or not available, skip
      }
    }

    const res = await fetch(coreUrl, fetchOptions);
    clearTimeout(timeoutId);

    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    return {
      data,
      status: res.status,
      ok: res.ok,
    };
  } catch (e: any) {
    if (e.name === "AbortError") {
      return {
        error: `Request timed out after ${timeoutMs}ms`,
        status: 504,
      };
    }

    return {
      error: e?.message ?? "Failed to connect to Core service",
      status: 502,
    };
  }
}

