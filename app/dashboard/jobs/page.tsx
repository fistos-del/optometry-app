"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Job {
  id: string;
  status: string;
  frameName: string;
  lensType: string;
  orderDate: string;
  balanceDue: number;
  patient: { firstName: string; lastName: string; fileNumber: string };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const loadJobs = () => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => setJobs(data.jobs || []));
  };

  useEffect(() => { loadJobs(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadJobs();
  };

  const statusColors: Record<string, string> = {
    ORDERED: "#F59E0B",
    AT_LAB: "#3B82F6",
    READY: "#10B981",
    COLLECTED: "#6B7280",
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Dispensary Jobs</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
          Track frames sent to the lab and co-payments.
        </p>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Patient</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Frame & Lens</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Balance Due</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No jobs in progress.</td></tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{job.patient.firstName} {job.patient.lastName}</div>
                    <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>{job.patient.fileNumber}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>
                    <div style={{ fontWeight: 600, color: "var(--text)" }}>{job.frameName}</div>
                    <div style={{ fontSize: 12 }}>{job.lensType}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, color: "#FFF", background: statusColors[job.status] || "#666" }}>
                      {job.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: job.balanceDue > 0 ? "var(--danger)" : "var(--success)" }}>
                    R {job.balanceDue.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                    {job.status === "ORDERED" && (
                      <button onClick={() => updateStatus(job.id, "AT_LAB")} style={{ padding: "4px 10px", fontSize: 11, background: "#DBEAFE", color: "#2563EB", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Send to Lab</button>
                    )}
                    {job.status === "AT_LAB" && (
                      <button onClick={() => updateStatus(job.id, "READY")} style={{ padding: "4px 10px", fontSize: 11, background: "#D1FAE5", color: "#059669", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Mark Ready</button>
                    )}
                    {job.status === "READY" && (
                      <button onClick={() => updateStatus(job.id, "COLLECTED")} style={{ padding: "4px 10px", fontSize: 11, background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Mark Collected</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
