import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { firstName, lastName, phone, dateOfBirth, medicalAid, hasDiabetes, hasHypertension, eyeInjuries, eyeSurgeries } = body;

    if (!firstName || !lastName || !phone || !dateOfBirth) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const patientCount = await prisma.patient.count();
    const fileNumber = `OP-${String(patientCount + 1).padStart(4, "0")}`;

    const patient = await prisma.patient.create({
      data: {
        fileNumber,
        firstName,
        lastName,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        medicalAid: medicalAid || null,
        hasDiabetes: hasDiabetes || false,
        hasHypertension: hasHypertension || false,
        eyeInjuries: eyeInjuries || null,
        eyeSurgeries: eyeSurgeries || null,
      },
    });

    return NextResponse.json({ patient });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: { records: true },
  });
  return NextResponse.json({ patients });
}
