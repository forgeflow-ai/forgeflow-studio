"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiKey } from "../../../../lib/api-key";
import Link from "next/link";

export default function NewFlowPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

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

      const res = await fetch(`/api/projects/${projectId}/flows`, {
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
        router.push(`/projects/${projectId}`);
      } else {
        setError(data.error || data.data?.detail || "Failed to create flow");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to create flow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Link
          href={`/projects/${projectId}`}
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to Project
        </Link>
      </div>

      <h1>Create New Flow</h1>

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
            Flow Name <span style={{ color: "#a00" }}>*</span>
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
            placeholder="Enter flow name"
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
            placeholder="Enter flow description (optional)"
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
            {error}
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
            {loading ? "Creating..." : "Create Flow"}
          </button>
          <Link
            href={`/projects/${projectId}`}
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

