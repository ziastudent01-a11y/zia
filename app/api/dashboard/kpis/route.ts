import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campusId = searchParams.get("campusId");

  const whereClause: any = {
    // Only filter by campus if provided
    ...(campusId && { campusId }),
  };

  const [
    totalStudents,
    fileComplete,
    fileIncomplete,
    fileSubmitted,
    returned,
    activeCampuses,
  ] = await Promise.all([
    // 1. Total Students
    prisma.student.count({ where: whereClause }),

    // 2. File Complete
    prisma.student.count({
      where: { ...whereClause, applicationStatus: "FILE_COMPLETE" },
    }),

    // 3. File Incomplete
    prisma.student.count({
      where: { ...whereClause, applicationStatus: "FILE_INCOMPLETE" },
    }),

    // 4. File Submitted
    prisma.student.count({
      where: { ...whereClause, applicationStatus: "FILE_SUBMITTED" },
    }),

    // 5. Returned
    prisma.student.count({
      where: { ...whereClause, applicationStatus: "RETURNED" },
    }),

    // 6. Active Campuses (only if no specific campus filter)
    campusId ? Promise.resolve(1) : prisma.campus.count({ where: { isActive: true } }),
  ]);

  return NextResponse.json({
    totalStudents,
    fileComplete,
    fileIncomplete,
    fileSubmitted,
    returned,
    activeCampuses,
  });
}
