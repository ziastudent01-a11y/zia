import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const campuses = await prisma.campus.findMany({
    where: { isActive: true },
    include: {
      students: {
        // Assuming we want all students for stats, or filter by ENROLLED if 'isActive' implies it.
        // For now, let's fetch all relevant fields to filter in memory as before
        select: {
          applicationStatus: true,
          courseStatus: true,
        },
      },
    },
  });

  const data = campuses.map((campus: any) => {
    const students = campus.students;

    return {
      campusId: campus.id,
      code: campus.code,
      name: campus.name,
      latitude: campus.latitude,
      longitude: campus.longitude,

      totalStudents: students.length,

      // Mapping 'fundingStatus' logic to 'applicationStatus'
      approvedFilings: students.filter(
        (s: any) => s.applicationStatus === "FILE_SUBMITTED"
      ).length,

      pendingFilings: students.filter(
        (s: any) => s.applicationStatus === "FILE_COMPLETE" || s.applicationStatus === "NOT_FILED"
      ).length,

      rejectedFilings: students.filter(
        (s: any) => s.applicationStatus === "RETURNED"
      ).length,

      documentsMissing: students.filter(
        (s: any) => s.applicationStatus === "FILE_INCOMPLETE"
      ).length,

      dropouts: students.filter(
        (s: any) => s.courseStatus === "DROPPED"
      ).length,
    };
  });

  return NextResponse.json(data);
}
