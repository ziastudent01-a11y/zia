import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const campuses = await prisma.campus.findMany({
    where: { isActive: true },
    include: {
      students: {
        where: { isActive: true },
        select: {
          academicStatus: true,
          fundingStatus: true,
          documentsStatus: true,
        },
      },
    },
  });

  const data = campuses.map((campus) => {
    const students = campus.students;

    return {
      campusId: campus.id,
      code: campus.code,
      name: campus.name,
      latitude: campus.latitude,
      longitude: campus.longitude,

      totalStudents: students.length,

      approvedFilings: students.filter(
        (s) => s.fundingStatus === "APPROVED"
      ).length,

      pendingFilings: students.filter(
        (s) => s.fundingStatus === "FILED"
      ).length,

      rejectedFilings: students.filter(
        (s) => s.fundingStatus === "REJECTED"
      ).length,

      documentsMissing: students.filter(
        (s) =>
          s.documentsStatus === "INCOMPLETE" ||
          s.documentsStatus === "IN_PROGRESS"
      ).length,

      dropouts: students.filter(
        (s) => s.academicStatus === "DROPPED_OUT"
      ).length,
    };
  });

  return NextResponse.json(data);
}
