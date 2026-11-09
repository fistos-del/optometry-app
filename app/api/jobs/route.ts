import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { patientId, frameName, lensType, balanceDue } = body;

    if (!patientId || !frameName || !lensType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        patientId,
        frameName,
        lensType,
        balanceDue: balanceDue ? parseFloat(balanceDue) : 0,
        status: "ORDERED",
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await prisma.job.findMany({
    orderBy: { orderDate: "desc" },
    include: { patient: true },
  });
  return NextResponse.json({ jobs });
}
