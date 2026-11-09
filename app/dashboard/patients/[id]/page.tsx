import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import NewExamForm from "@/components/NewExamForm";
import NewJobForm from "@/components/NewJobForm";

export const dynamic = "force-dynamic";

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: { records: { orderBy: { examDate: "desc" } } },
  });

  if (!patient) notFound();

  return (
    <div>
      <Link
        href="/dashboard/patients"
        style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}
      >
        ← Back to Patients
      </Link>

      <div
        style={{
          background: "var(--surface)",
          padding: 32,
          borderRadius: 12,
          border: "1px solid var(--border)",
          marginTop: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}
            >
              {patient.fileNumber}
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "var(--text)",
                marginTop: 4,
              }}
            >
              {patient.firstName} {patient.lastName}
            </h1>
            <div
              style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}
            >
              📞 {patient.phone} · 🎂{" "}
              {new Date(patient.dateOfBirth).toLocaleDateString()} · 🏥{" "}
              {patient.medicalAid || "Cash Patient"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {patient.hasDiabetes && (
              <span
                style={{
                  padding: "4px 10px",
                  background: "#FEE2E2",
                  color: "#DC2626",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Diabetes
              </span>
            )}
            {patient.hasHypertension && (
              <span
                style={{
                  padding: "4px 10px",
                  background: "#FEF3C7",
                  color: "#D97706",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Hypertension
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--surface)",
          padding: 32,
          borderRadius: 12,
          border: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
          Eye Examination History
        </h2>
        {patient.records.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            No exams recorded yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {patient.records.map((rec) => (
              <div
                key={rec.id}
                style={{
                  padding: 20,
                  background: "#F9FAFB",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: 12,
                  }}
                >
                  Exam Date: {new Date(rec.examDate).toLocaleDateString()}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 12,
                    fontSize: 13,
                  }}
                >
                  <div>
                    <strong>OD:</strong> {rec.odSphere ?? "—"} /{" "}
                    {rec.odCylinder ?? "—"} / {rec.odAxis ?? "—"}
                  </div>
                  <div>
                    <strong>OS:</strong> {rec.osSphere ?? "—"} /{" "}
                    {rec.osCylinder ?? "—"} / {rec.osAxis ?? "—"}
                  </div>
                  <div>
                    <strong>IOP:</strong> R {rec.iopRight ?? "—"} / L{" "}
                    {rec.iopLeft ?? "—"}
                  </div>
                  <div>
                    <strong>VA:</strong> {rec.vaDistance ?? "—"}
                  </div>
                </div>
                {rec.fundusNotes && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "var(--text-muted)",
                    }}
                  >
                    <strong>Fundus:</strong> {rec.fundusNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <NewJobForm patientId={patient.id} />
      <NewExamForm patientId={patient.id} />
    </div>
  );
}
