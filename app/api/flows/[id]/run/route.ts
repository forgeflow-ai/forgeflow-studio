import { NextRequest, NextResponse } from "next/server";
import { proxyToCore } from "../../../../lib/core-api-proxy";

/**
 * POST /api/flows/[id]/run - Run a flow
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => ({}));
  const result = await proxyToCore(request, `/flows/${params.id}/run`, {
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

