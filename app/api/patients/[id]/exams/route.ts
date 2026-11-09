import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const toNum = (v: any) => (v === "" || v === undefined || v === null ? null : parseFloat(v));
    const toInt = (v: any) => (v === "" || v === undefined || v === null ? null : Math.round(parseFloat(v)));

    const record = await prisma.eyeRecord.create({
      data: {
        patientId: params.id,
        odSphere: toNum(body.odSphere),
        odCylinder: toNum(body.odCylinder),
        odAxis: toInt(body.odAxis),
        odAdd: toNum(body.odAdd),
        osSphere: toNum(body.osSphere),
        osCylinder: toNum(body.osCylinder),
        osAxis: toInt(body.osAxis),
        osAdd: toNum(body.osAdd),
        vaDistance: body.vaDistance || null,
        vaNear: body.vaNear || null,
        iopRight: toNum(body.iopRight),
        iopLeft: toNum(body.iopLeft),
        colourVision: body.colourVision || null,
        fundusNotes: body.fundusNotes || null,
        pd: toNum(body.pd),
        segHeight: toNum(body.segHeight),
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save exam" }, { status: 500 });
  }
}
