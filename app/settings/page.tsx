"use client";

import { useState, useEffect } from "react";
import { getApiKey, setApiKey, removeApiKey } from "../lib/api-key";

export default function SettingsPage() {
  const [apiKey, setApiKeyValue] = useState<string>("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing API key from localStorage
    const existing = getApiKey();
    if (existing) {
      setApiKeyValue(existing);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim() === "") {
      removeApiKey();
    } else {
      setApiKey(apiKey.trim());
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main style={{ padding: 24, maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <a
          href="/"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to Home
        </a>
      </div>

      <h1>Settings</h1>

      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="api-key"
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Core API Key
        </label>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKeyValue(e.target.value)}
          placeholder="Enter your Core API key"
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 14,
            border: "1px solid #ccc",
            borderRadius: 4,
            fontFamily: "monospace",
          }}
        />
        <p style={{ fontSize: 12, color: "#666", marginTop: 8, margin: 0 }}>
          This key will be used to authenticate requests to Core API. Stored
          locally in your browser.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        {saved && (
          <span style={{ color: "#0a0", fontSize: 14 }}>✓ Saved!</span>
        )}
      </div>
    </main>
  );
}

