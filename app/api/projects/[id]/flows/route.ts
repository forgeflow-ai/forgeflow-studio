import { NextRequest, NextResponse } from "next/server";
import { proxyToCore } from "../../../../lib/core-api-proxy";

/**
 * GET /api/projects/[id]/flows - List flows for a project
 * POST /api/projects/[id]/flows - Create a new flow in a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await proxyToCore(request, `/projects/${params.id}/flows`);
  
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => ({}));
  const result = await proxyToCore(request, `/projects/${params.id}/flows`, {
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

