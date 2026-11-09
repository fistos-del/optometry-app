import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const patientCount = await prisma.patient.count();
  const recordsCount = await prisma.eyeRecord.count();

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
        Welcome, {user?.name}
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 40 }}>
        Here is the practice overview.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Patients</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)", marginTop: 8 }}>{patientCount}</div>
        </div>
        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Eye Exams</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginTop: 8 }}>{recordsCount}</div>
        </div>
        <div style={{ background: "var(--surface)", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Role</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginTop: 12 }}>{user?.role}</div>
        </div>
      </div>
    </div>
  );
}
