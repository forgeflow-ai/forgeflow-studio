export const dynamic = "force-dynamic";

async function fetchHealthViaApi() {
  try {
    const res = await fetch(`/api/core-health`, { cache: "no-store" });
    return await res.json();
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export default async function Home() {
  const health = await fetchHealthViaApi();

  return (
    <main style={{ padding: 24 }}>
      <h1>ForgeFlow Studio</h1>

      <p>Core health check (via /api/core-health):</p>
      <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8 }}>
        {JSON.stringify(health, null, 2)}
      </pre>

      <p>
        Burada <code>ok: true</code> ve <code>data.db_ok: true</code> görüyorsan Studio → Core bağlantısı tamam.
      </p>
    </main>
  );
}
