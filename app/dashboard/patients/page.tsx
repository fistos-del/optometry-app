"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Patient {
  id: string;
  fileNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  medicalAid: string | null;
  records: any[];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetch("/api/patients")
      .then((r) => r.json())
      .then((data) => setPatients(data.patients || []));
  }, []);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.fileNumber.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Patients</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
            {patients.length} total records
          </p>
        </div>
        <button className="btn" onClick={() => setShowNewForm(true)}>
          + New Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, file number, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
        style={{ marginBottom: 24, maxWidth: 500 }}
      />

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>File #</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Name</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Phone</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Medical Aid</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Exams</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No patients found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--primary)" }}>{p.fileNumber}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text)" }}>{p.firstName} {p.lastName}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{p.phone}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{p.medicalAid || "—"}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text)" }}>{p.records.length}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Link href={`/dashboard/patients/${p.id}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showNewForm && (
        <NewPatientModal onClose={() => setShowNewForm(false)} onCreated={() => {
          setShowNewForm(false);
          fetch("/api/patients").then((r) => r.json()).then((data) => setPatients(data.patients || []));
        }} />
      )}
    </div>
  );
}

function NewPatientModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", dateOfBirth: "", medicalAid: "",
    hasDiabetes: false, hasHypertension: false, eyeInjuries: "", eyeSurgeries: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create patient");
      onCreated();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ background: "var(--surface)", borderRadius: 16, padding: 32, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>New Patient Record</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>First Name *</label><input className="input" required value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Last Name *</label><input className="input" required value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Phone *</label><input className="input" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Date of Birth *</label><input type="date" className="input" required value={form.dateOfBirth} onChange={(e) => setForm({...form, dateOfBirth: e.target.value})} /></div>
          </div>

          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Medical Aid</label><input className="input" value={form.medicalAid} onChange={(e) => setForm({...form, medicalAid: e.target.value})} placeholder="e.g., Discovery, GEMS, Cash" /></div>

          <div style={{ display: "flex", gap: 20, padding: "10px 0" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.hasDiabetes} onChange={(e) => setForm({...form, hasDiabetes: e.target.checked})} /> Diabetes
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.hasHypertension} onChange={(e) => setForm({...form, hasHypertension: e.target.checked})} /> Hypertension
            </label>
          </div>

          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Eye Injuries (optional)</label><textarea className="input" rows={2} value={form.eyeInjuries} onChange={(e) => setForm({...form, eyeInjuries: e.target.value})} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Eye Surgeries (optional)</label><textarea className="input" rows={2} value={form.eyeSurgeries} onChange={(e) => setForm({...form, eyeSurgeries: e.target.value})} /></div>

          {error && <div style={{ color: "var(--danger)", fontSize: 13 }}>{error}</div>}

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: 12, background: "#F3F4F6", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn" style={{ flex: 2, padding: 12 }}>
              {submitting ? "Saving..." : "Create Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
