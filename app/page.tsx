export default async function Home() {
  let health: any;

  try {
    const res = await fetch("/api/core/health", { cache: "no-store" });
    health = await res.json();
  } catch (e: any) {
    health = { error: e?.message ?? "fetch failed" };
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>ForgeFlow Studio</h1>
      <p>Core health check:</p>
      <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8 }}>
        {JSON.stringify(health, null, 2)}
      </pre>
      <p>
        Eğer burada <code>db_ok: true</code> görüyorsan Studio → Core bağlantısı tamam.
      </p>
    </main>
  );
}
