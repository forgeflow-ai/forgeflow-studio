"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiKey } from "../../lib/api-key";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiKey = getApiKey();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.ok && data.data) {
        // Redirect to project detail page
        router.push(`/projects/${data.data.id || data.data.id}`);
      } else {
        // Check if it's an auth error
        const errorMsg = data.error || data.data?.detail || "Failed to create project";
        if (errorMsg.toLowerCase().includes("authorization") || res.status === 401 || res.status === 403) {
          setError("Authentication required. Please configure your API key in Settings.");
        } else {
          setError(errorMsg);
        }
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/projects"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to Projects
        </Link>
      </div>

      <h1>Create New Project</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Project Name <span style={{ color: "#a00" }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 14,
              border: "1px solid #ccc",
              borderRadius: 4,
              boxSizing: "border-box",
            }}
            placeholder="Enter project name"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="description"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 14,
              border: "1px solid #ccc",
              borderRadius: 4,
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            placeholder="Enter project description (optional)"
          />
        </div>

        {error && (
          <div
            style={{
              padding: 12,
              backgroundColor: "#ffe6e6",
              border: "1px solid #a00",
              borderRadius: 4,
              color: "#a00",
              marginBottom: 20,
            }}
          >
            <div style={{ marginBottom: error.includes("Authentication") ? 8 : 0 }}>
              {error}
            </div>
            {error.includes("Authentication") && (
              <Link
                href="/settings"
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  padding: "6px 12px",
                  fontSize: 12,
                  backgroundColor: "#0070f3",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 4,
                }}
              >
                Go to Settings →
              </Link>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              backgroundColor: loading || !name.trim() ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading || !name.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
          <Link
            href="/projects"
            style={{
              padding: "10px 20px",
              fontSize: 14,
              backgroundColor: "transparent",
              color: "#666",
              textDecoration: "none",
              border: "1px solid #ccc",
              borderRadius: 4,
              display: "inline-block",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

