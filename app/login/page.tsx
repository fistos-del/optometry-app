"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 40, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👁️</div>
          <h1 style={{ fontSize: 24, color: "var(--text)" }}>Optometry Portal</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="name@practice.com" required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
          </div>
          {error && <div style={{ padding: 10, background: "#FEE2E2", color: "#EF4444", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{error}</div>}
          <button type="submit" disabled={submitting} className="btn" style={{ marginTop: 8, padding: 12 }}>
            {submitting ? "Signing in..." : "Sign In →"}
          </button>
        </form>
        <div style={{ marginTop: 24, fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
          <strong>Optometrist:</strong> aunt@optometry.com / optometry2026<br/>
          <strong>Receptionist:</strong> reception@optometry.com / reception2026
        </div>
      </div>
    </div>
  );
}
