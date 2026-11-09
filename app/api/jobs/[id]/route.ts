import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { status, balanceDue } = body;

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        status: status || undefined,
        balanceDue: balanceDue !== undefined ? parseFloat(balanceDue) : undefined,
        labSentDate: status === "AT_LAB" ? new Date() : undefined,
        labReturnDate: status === "READY" || status === "COLLECTED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
