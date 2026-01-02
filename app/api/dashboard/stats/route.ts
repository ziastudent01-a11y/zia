import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [
    totalStudents,
    studentsByCampus,
    studentsByStatus,
    studentsByProgram,
    incompleteFiles,
  ] = await Promise.all([
    // 1. Total Students
    prisma.student.count(),

    // 2. By Campus
    prisma.student.groupBy({
      by: ["campusId"],
      _count: { _all: true },
    }),

    // 3. By Application Status
    prisma.student.groupBy({
      by: ["applicationStatus"],
      _count: { _all: true },
    }),

    // 4. By Program
    prisma.student.groupBy({
      by: ["programName"],
      _count: { _all: true },
    }),

    // 5. Incomplete Files
    prisma.student.count({
      where: { applicationStatus: "FILE_INCOMPLETE" },
    }),
  ]);

  // Enrich campus data with names
  const campuses = await prisma.campus.findMany({
    where: { id: { in: studentsByCampus.map((s: any) => s.campusId) } },
    select: { id: true, name: true },
  });

  const campusStats = studentsByCampus.map((item: any) => ({
    name: campuses.find((c) => c.id === item.campusId)?.name || "Unknown",
    value: item._count._all,
  }));

  const statusStats = studentsByStatus.map((item: any) => ({
    name: item.applicationStatus.replace("_", " "),
    value: item._count._all,
  }));

  const programStats = studentsByProgram.map((item: any) => ({
    name: item.programName,
    value: item._count._all,
  }));

  return NextResponse.json({
    total: totalStudents,
    incomplete: incompleteFiles,
    byCampus: campusStats,
    byStatus: statusStats,
    byProgram: programStats,
  });
}
