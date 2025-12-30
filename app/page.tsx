async function fetchHealth() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) return { error: "NEXT_PUBLIC_API_BASE missing" };

  try {
    const res = await fetch(`${base}/health`, { cache: "no-store" });
    const data = await res.json();
    return data;
  } catch (e: any) {
    return { error: e?.message ?? "fetch failed" };
  }
}

export default async function Home() {
  const health = await fetchHealth();

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
