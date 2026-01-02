import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const campusIds = searchParams.getAll("campusId");
  const academicStatus = searchParams.get("academicStatus");
  const fundingStatus = searchParams.get("fundingStatus");
  const programName = searchParams.get("programName");

  const whereClause: any = {
    // isActive: true, // Not needed or maps to courseStatus
    ...(campusIds.length && { campusId: { in: campusIds } }),
    ...(academicStatus && { courseStatus: academicStatus }), // Mapping to courseStatus
    ...(fundingStatus && { applicationStatus: fundingStatus }), // Mapping to applicationStatus
    ...(programName && { programName }),
  };

  const students = await prisma.student.findMany({
    where: whereClause,
    select: {
      id: true,
      fileNumber: true,
      programName: true,
      courseStatus: true,      // Was academicStatus
      applicationStatus: true, // Was fundingStatus
      // documentsStatus: true, // Removed as no direct mapping exists
      campusId: true,
    },
    take: 1000, // safe cap for charts
  });

  return NextResponse.json({
    count: students.length,
    students,
  });
}
