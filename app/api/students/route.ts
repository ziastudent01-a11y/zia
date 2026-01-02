import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const skip = (page - 1) * limit;

  // Filters
  const campusId = searchParams.get("campusId");
  const programName = searchParams.get("programName");
  const applicationStatus = searchParams.get("applicationStatus");
  const search = searchParams.get("search");

  const where: Prisma.StudentWhereInput = {};

  if (campusId) where.campusId = campusId;
  if (programName) where.programName = { contains: programName, mode: "insensitive" };
  if (applicationStatus) where.applicationStatus = applicationStatus as any;

  if (search) {
    where.OR = [
      { studentName: { contains: search, mode: "insensitive" } },
      { fileNumber: { contains: search, mode: "insensitive" } },
      { nationalId: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          campus: {
            select: { name: true },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({ students, total });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation (can use Zod here too, but frontend usually handles it)
    if (!body.fileNumber || !body.campusId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        fileNumber: body.fileNumber,
        nationalId: body.nationalId,
        studentName: body.studentName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        campusId: body.campusId,
        programName: body.programName,
        session: body.session,
        lastDegree: body.lastDegree,
        guardianType: body.guardianType,
        guardianName: body.guardianName,
        guardianCNIC: body.guardianCNIC,
        fatherName: body.fatherName,
        factoryName: body.factoryName,
        factoryLocation: body.factoryLocation,
        factoryDepartment: body.factoryDepartment,
        factoryCardNo: body.factoryCardNo,
        dateOfJoining: body.dateOfJoining ? new Date(body.dateOfJoining) : null,
        serviceDuration: body.serviceDuration,
        designation: body.designation,
        phonePrimary: body.phonePrimary,
        phoneSecondary: body.phoneSecondary,
        bankAccount: body.bankAccount,
        applicationStatus: body.applicationStatus,
        courseStatus: body.courseStatus,
        isEligible: body.isEligible,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "P2002") {
      return NextResponse.json({ error: "Duplicate file number" }, { status: 409 });
    }
    console.error("Create student error:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
