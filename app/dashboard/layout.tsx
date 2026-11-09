import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <aside
        style={{
          width: 240,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "var(--primary)",
            marginBottom: 40,
          }}
        >
          👁️ OptoCare
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link
            href="/dashboard"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text)",
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/patients"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            Patients
          </Link>
          <Link
            href="/dashboard/jobs"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            Dispensary (Jobs)
          </Link>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
            {user.name}
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
          >
            {user.role}
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "40px" }}>{children}</main>
    </div>
  );
}
