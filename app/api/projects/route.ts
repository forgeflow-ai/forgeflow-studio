import { NextRequest, NextResponse } from "next/server";
import { proxyToCore } from "../../lib/core-api-proxy";

/**
 * GET /api/projects - List all projects
 * POST /api/projects - Create a new project
 */
export async function GET(request: NextRequest) {
  const result = await proxyToCore(request, "/projects");
  
  if (result.error) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    data: result.data,
  }, { status: result.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = await proxyToCore(request, "/projects", {
    method: "POST",
    body,
  });

  if (result.error) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    data: result.data,
  }, { status: result.status });
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

