"use client";

import { useEffect, useState } from "react";
import { getApiKey } from "./lib/api-key";
import Link from "next/link";

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [meData, setMeData] = useState<any>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  const fetchData = async () => {
    // Check if API key exists (client-side only)
    setHasApiKey(getApiKey() !== null);

    const apiKey = getApiKey();
    const headers: Record<string, string> = {};

    // Add Authorization header if API key exists
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Fetch health check
    try {
      const res = await fetch("/api/core-health", {
        cache: "no-store",
        headers,
      });
      const data = await res.json();
      setHealth(data);
    } catch (e: any) {
      setHealth({ ok: false, error: e?.message ?? "fetch failed" });
    }

    // Fetch /me endpoint
    try {
      const res = await fetch("/api/me", {
        cache: "no-store",
        headers,
      });
      const data = await res.json();
      setMeData({ ...data, httpStatus: res.status });
    } catch (e: any) {
      setMeData({ ok: false, error: e?.message ?? "fetch failed" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Determine auth status
  const authStatus =
    hasApiKey === false || hasApiKey === null
      ? "NO_AUTH"
      : health?.auth_ok === true
      ? "OK"
      : health?.auth_ok === false
      ? "FAIL"
      : null;

  return (
    <main style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>ForgeFlow Studio</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/projects"
            style={{
              padding: "8px 16px",
              fontSize: 14,
              color: "#0070f3",
              textDecoration: "none",
              border: "1px solid #0070f3",
              borderRadius: 4,
            }}
          >
            Projects
          </Link>
          <Link
            href="/settings"
            style={{
              padding: "8px 16px",
              fontSize: 14,
              color: "#0070f3",
              textDecoration: "none",
              border: "1px solid #0070f3",
              borderRadius: 4,
            }}
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Auth Status Indicator */}
      <div
        style={{
          padding: 12,
          marginBottom: 24,
          borderRadius: 4,
          backgroundColor:
            authStatus === "OK"
              ? "#e6ffed"
              : authStatus === "FAIL"
              ? "#ffe6e6"
              : "#f0f0f0",
          border:
            authStatus === "OK"
              ? "1px solid #0a0"
              : authStatus === "FAIL"
              ? "1px solid #a00"
              : "1px solid #ccc",
        }}
      >
        <strong>Auth Status: </strong>
        {authStatus === "OK" && (
          <span style={{ color: "#0a0" }}>✓ Auth OK</span>
        )}
        {authStatus === "FAIL" && (
          <span style={{ color: "#a00" }}>✗ Auth FAIL</span>
        )}
        {authStatus === "NO_AUTH" && (
          <span style={{ color: "#666" }}>
            No API key configured.{" "}
            <a href="/settings" style={{ color: "#0070f3" }}>
              Configure in Settings →
            </a>
          </span>
        )}
        {authStatus === null && (
          <span style={{ color: "#666" }}>Checking...</span>
        )}
      </div>

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

      <div style={{ marginTop: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>User Info (via /api/me):</h2>
          <button
            onClick={fetchData}
            style={{
              padding: "6px 12px",
              fontSize: 12,
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>

        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: 16,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          {meData === null
            ? "Loading..."
            : JSON.stringify(meData, null, 2)}
        </pre>

        {meData && (
          <p style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
            {meData.httpStatus === 401 ? (
              <>
                <strong>Status 401:</strong> Key yokken veya geçersiz key ile{" "}
                <code>/me</code> çağrısı 401 gösteriyor. ✓
              </>
            ) : meData.ok && meData.data ? (
              <>
                <strong>Status {meData.httpStatus}:</strong> Key varken user
                bilgisi dönüyor. ✓
              </>
            ) : (
              <>
                <strong>Status {meData.httpStatus}:</strong> {meData.error || "Unknown error"}
              </>
            )}
          </p>
        )}
      </div>
    </main>
  );
}
