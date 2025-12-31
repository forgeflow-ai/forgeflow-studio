"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiKey } from "../../lib/api-key";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Flow {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = getApiKey();
      const headers: Record<string, string> = {};

      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const [projectRes, flowsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`, {
          cache: "no-store",
          headers,
        }),
        fetch(`/api/projects/${projectId}/flows`, {
          cache: "no-store",
          headers,
        }),
      ]);

      const projectData = await projectRes.json();
      const flowsData = await flowsRes.json();

      if (projectData.ok && projectData.data) {
        setProject(projectData.data);
      } else {
        setError(projectData.error || "Failed to fetch project");
      }

      if (flowsData.ok && flowsData.data) {
        const flowsList = Array.isArray(flowsData.data)
          ? flowsData.data
          : flowsData.data.items || [];
        setFlows(flowsList);
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleRunFlow = async (flowId: string) => {
    try {
      const apiKey = getApiKey();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch(`/api/flows/${flowId}/run`, {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.ok && data.data) {
        // Show success message or redirect to run detail
        alert(`Flow started! Status: ${data.data.status || "queued"}`);
        // Refresh flows to show updated status
        fetchProject();
      } else {
        alert(`Failed to run flow: ${data.error || data.data?.detail || "Unknown error"}`);
      }
    } catch (e: any) {
      alert(`Failed to run flow: ${e?.message}`);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Loading project...</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main style={{ padding: 24 }}>
        <div
          style={{
            padding: 12,
            backgroundColor: "#ffe6e6",
            border: "1px solid #a00",
            borderRadius: 4,
            color: "#a00",
          }}
        >
          Error: {error || "Project not found"}
        </div>
        <Link
          href="/projects"
          style={{
            display: "inline-block",
            marginTop: 16,
            color: "#0070f3",
            textDecoration: "none",
          }}
        >
          ← Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 32,
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px 0" }}>{project.name}</h1>
          {project.description && (
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
              {project.description}
            </p>
          )}
        </div>
        <Link
          href={`/projects/${projectId}/flows/new`}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          + Create Flow
        </Link>
      </div>

      <div>
        <h2 style={{ marginBottom: 16 }}>Flows</h2>

        {flows.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
              No flows yet
            </p>
            <Link
              href={`/projects/${projectId}/flows/new`}
              style={{
                padding: "10px 20px",
                fontSize: 14,
                backgroundColor: "#0070f3",
                color: "white",
                textDecoration: "none",
                borderRadius: 4,
                display: "inline-block",
              }}
            >
              Create your first flow
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {flows.map((flow) => (
              <div
                key={flow.id}
                style={{
                  padding: 20,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  backgroundColor: "white",
                }}
              >
                <h3 style={{ margin: "0 0 8px 0", color: "#0070f3" }}>
                  {flow.name}
                </h3>
                {flow.description && (
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      color: "#666",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {flow.description}
                  </p>
                )}
                {flow.status && (
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: 12,
                      color: "#999",
                    }}
                  >
                    Status: {flow.status}
                  </p>
                )}
                <button
                  onClick={() => handleRunFlow(flow.id)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 14,
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  ▶ Run
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

