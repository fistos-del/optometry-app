"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewExamForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    odSphere: "", odCylinder: "", odAxis: "", odAdd: "",
    osSphere: "", osCylinder: "", osAxis: "", osAdd: "",
    vaDistance: "", vaNear: "", iopRight: "", iopLeft: "",
    colourVision: "", fundusNotes: "", pd: "", segHeight: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.refresh();
      setForm({
        odSphere: "", odCylinder: "", odAxis: "", odAdd: "",
        osSphere: "", osCylinder: "", osAxis: "", osAdd: "",
        vaDistance: "", vaNear: "", iopRight: "", iopLeft: "",
        colourVision: "", fundusNotes: "", pd: "", segHeight: "",
      });
    } catch (err) {
      alert("Failed to save exam");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--surface)", padding: 32, borderRadius: 12, border: "1px solid var(--border)", marginTop: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>+ New Eye Exam</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Refraction</div>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Eye</th>
                <th style={{ padding: 8 }}>Sphere</th>
                <th style={{ padding: 8 }}>Cylinder</th>
                <th style={{ padding: 8 }}>Axis</th>
                <th style={{ padding: 8 }}>Add</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: 8, fontWeight: 700 }}>OD (Right)</td>
                <td style={{ padding: 8 }}><input className="input" value={form.odSphere} onChange={(e) => setForm({...form, odSphere: e.target.value})} /></td>
                <td style={{ padding: 8 }}><input className="input" value={form.odCylinder} onChange={(e) => setForm({...form, odCylinder: e.target.value})} /></td>
                <td style={{ padding: 8 }}><input className="input" value={form.odAxis} onChange={(e) => setForm({...form, odAxis: e.target.value})} /></td>
                <td style={{ padding: 8 }}><input className="input" value={form.odAdd} onChange={(e) => setForm({...form, odAdd: e.target.value})} /></td>
              </tr>
              <tr style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: 8, fontWeight: 700 }}>OS (Left)</td>
                <td style={{ padding: 8 }}><input className="input" value={form.osSphere} onChange={(e) => setForm({...form, osSphere: e.target.value})} /></td>
                <td style={{ padding: 8 }}><input className="input" value={form.osCylinder} onChange={(e) => setForm({...form, osCylinder: e.target.value})} /></td>
                <td style={{ padding: 8 }}><input className="input" value={form.osAxis} onChange={(e) => setForm({...form, osAxis: e.target.value})} /></td>
                <td style={{ padding: 8 }}><input className="input" value={form.osAdd} onChange={(e) => setForm({...form, osAdd: e.target.value})} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Visual Acuity (Distance)</label><input className="input" value={form.vaDistance} onChange={(e) => setForm({...form, vaDistance: e.target.value})} placeholder="e.g., 6/6" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Visual Acuity (Near)</label><input className="input" value={form.vaNear} onChange={(e) => setForm({...form, vaNear: e.target.value})} placeholder="e.g., N5" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>IOP Right</label><input className="input" value={form.iopRight} onChange={(e) => setForm({...form, iopRight: e.target.value})} placeholder="e.g., 14" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>IOP Left</label><input className="input" value={form.iopLeft} onChange={(e) => setForm({...form, iopLeft: e.target.value})} placeholder="e.g., 15" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Colour Vision (Ishihara)</label><input className="input" value={form.colourVision} onChange={(e) => setForm({...form, colourVision: e.target.value})} placeholder="e.g., Normal" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>PD / Seg Height</label><div style={{ display: "flex", gap: 8 }}><input className="input" value={form.pd} onChange={(e) => setForm({...form, pd: e.target.value})} placeholder="PD" /><input className="input" value={form.segHeight} onChange={(e) => setForm({...form, segHeight: e.target.value})} placeholder="Seg H" /></div></div>
        </div>

        <div><label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Fundus Notes</label><textarea className="input" rows={3} value={form.fundusNotes} onChange={(e) => setForm({...form, fundusNotes: e.target.value})} placeholder="Disc margins, AV ratio, CD ratio..." /></div>

        <button type="submit" disabled={submitting} className="btn" style={{ marginTop: 16, padding: "12px 24px" }}>
          {submitting ? "Saving..." : "Save Eye Exam"}
        </button>
      </form>
    </div>
  );
}
