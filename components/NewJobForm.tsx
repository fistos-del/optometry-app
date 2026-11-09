"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [frameName, setFrameName] = useState("");
  const [lensType, setLensType] = useState("");
  const [balanceDue, setBalanceDue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, frameName, lensType, balanceDue }),
      });
      router.refresh();
      setFrameName("");
      setLensType("");
      setBalanceDue("");
    } catch (err) {
      alert("Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--surface)", padding: 32, borderRadius: 12, border: "1px solid var(--border)", marginTop: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>+ New Dispensary Job (Order Glasses)</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 14, alignItems: "end" }}>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Frame Name *</label><input className="input" required value={frameName} onChange={(e) => setFrameName(e.target.value)} placeholder="e.g., Ray-Ban RB2140" /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Lens Type *</label><input className="input" required value={lensType} onChange={(e) => setLensType(e.target.value)} placeholder="e.g., Single Vision Anti-Glare" /></div>
        <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Co-Payment (R)</label><input className="input" type="number" value={balanceDue} onChange={(e) => setBalanceDue(e.target.value)} placeholder="0.00" /></div>
        <button type="submit" disabled={submitting} className="btn" style={{ padding: "10px 24px" }}>
          {submitting ? "..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
