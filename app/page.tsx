"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/core-health", { cache: "no-store" });
        const data = await res.json();
        setHealth(data);
      } catch (e: any) {
        setHealth({ ok: false, error: e?.message ?? "fetch failed" });
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>ForgeFlow Studio</h1>

      <p>Core health check (via /api/core-health):</p>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 8,
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(health, null, 2)}
      </pre>

      <p>
        Burada <code>ok: true</code> ve <code>data.db_ok: true</code>{" "}
        görüyorsan Studio → Core bağlantısı tamam.
      </p>
    </main>
  );
}
