import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const campusIds = searchParams.getAll("campusId");
  const academicStatus = searchParams.get("academicStatus");
  const fundingStatus = searchParams.get("fundingStatus");
  const programName = searchParams.get("programName");

  const whereClause: any = {
    isActive: true,
    ...(campusIds.length && { campusId: { in: campusIds } }),
    ...(academicStatus && { academicStatus }),
    ...(fundingStatus && { fundingStatus }),
    ...(programName && { programName }),
  };

  const students = await prisma.student.findMany({
    where: whereClause,
    select: {
      id: true,
      fileNumber: true,
      programName: true,
      academicStatus: true,
      fundingStatus: true,
      documentsStatus: true,
      campusId: true,
    },
    take: 1000, // safe cap for charts
  });

  return NextResponse.json({
    count: students.length,
    students,
  });
}
