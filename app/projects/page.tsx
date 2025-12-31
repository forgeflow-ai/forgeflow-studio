"use client";

import { useEffect, useState } from "react";
import { getApiKey } from "../lib/api-key";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = getApiKey();
      const headers: Record<string, string> = {};

      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch("/api/projects", {
        cache: "no-store",
        headers,
      });

      const data = await res.json();

      if (data.ok && data.data) {
        // Handle both array and object with items property
        const projectsList = Array.isArray(data.data) ? data.data : data.data.items || [];
        setProjects(projectsList);
      } else {
        setError(data.error || "Failed to fetch projects");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Link
            href="/"
            style={{
              color: "#0070f3",
              textDecoration: "none",
              fontSize: 14,
              marginRight: 16,
            }}
          >
            ← Home
          </Link>
          <h1 style={{ margin: "8px 0", display: "inline" }}>Projects</h1>
        </div>
        <Link
          href="/projects/new"
          style={{
            padding: "10px 20px",
            fontSize: 14,
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          + Create Project
        </Link>
      </div>

      {loading && <p>Loading projects...</p>}

      {error && (
        <div
          style={{
            padding: 12,
            backgroundColor: "#ffe6e6",
            border: "1px solid #a00",
            borderRadius: 4,
            color: "#a00",
            marginBottom: 24,
          }}
        >
          Error: {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div
          style={{
            padding: 48,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            marginTop: 24,
          }}
        >
          <p style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
            No projects yet
          </p>
          <Link
            href="/projects/new"
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
            Create your first project
          </Link>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              style={{
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
                display: "block",
                transition: "all 0.2s",
                backgroundColor: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0070f3";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,112,243,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", color: "#0070f3" }}>
                {project.name}
              </h3>
              {project.description && (
                <p
                  style={{
                    margin: "0 0 12px 0",
                    color: "#666",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {project.description}
                </p>
              )}
              {project.created_at && (
                <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

