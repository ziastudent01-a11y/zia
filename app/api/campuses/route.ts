import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Infer type to avoid "no exported member" build error
type Campus = NonNullable<Awaited<ReturnType<typeof prisma.campus.findFirst>>>;

export async function POST(req: Request) {
  const body = await req.json();

  const { code, name, city, latitude, longitude } = body;

  if (!code || !name || !city || latitude == null || longitude == null) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const campus = await prisma.campus.upsert({
    where: { code },
    update: {
      name,
      city,
      latitude,
      longitude,
    },
    create: {
      code,
      name,
      city,
      latitude,
      longitude,
    },
  });

  return NextResponse.json(campus);
}

export async function GET() {
  const campuses = await prisma.campus.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  // Aggregate Application Status
  const appStatusStats = await prisma.student.groupBy({
    by: ["campusId", "applicationStatus"],
    _count: {
      _all: true,
    },
  });

  // Aggregate Course Status
  const courseStatusStats = await prisma.student.groupBy({
    by: ["campusId", "courseStatus"],
    _count: {
      _all: true,
    },
  });

  // Merge stats into campuses
  const result = campuses.map((campus: Campus) => {
    const campusAppStats = appStatusStats.filter((s: any) => s.campusId === campus.id);
    const campusCourseStats = courseStatusStats.filter((s: any) => s.campusId === campus.id);

    // Calculate generic total
    const totalStudents = campusAppStats.reduce((acc: number, curr: any) => acc + curr._count._all, 0);

    // Helper to get count by specific status
    const getCount = (status: string, source: typeof campusAppStats) =>
      source.find((s: any) => s.applicationStatus === status)?._count._all || 0;

    // Helper for course status
    const getCourseCount = (status: string, source: typeof campusCourseStats) =>
      source.find((s: any) => s.courseStatus === status)?._count._all || 0;

    return {
      ...campus,
      stats: {
        total: totalStudents,
        fileComplete: getCount("FILE_COMPLETE", campusAppStats),
        fileSubmitted: getCount("FILE_SUBMITTED", campusAppStats),
        returned: getCount("RETURNED", campusAppStats),
        fileIncomplete: getCount("FILE_INCOMPLETE", campusAppStats),
        notFiled: getCount("NOT_FILED", campusAppStats),
        active: getCourseCount("ENROLLED", campusCourseStats),
        completed: getCourseCount("COMPLETED", campusCourseStats),
        dropped: getCourseCount("DROPPED", campusCourseStats),
      },
    };
  });

  return NextResponse.json(result);
}
