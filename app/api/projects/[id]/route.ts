import { NextRequest, NextResponse } from "next/server";
import { proxyToCore } from "../../../lib/core-api-proxy";

/**
 * GET /api/projects/[id] - Get project details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await proxyToCore(request, `/projects/${params.id}`);
  
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

