import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { code, name, latitude, longitude } = body;

  if (!code || !name || latitude == null || longitude == null) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const campus = await prisma.campus.upsert({
    where: { code },
    update: {
      name,
      latitude,
      longitude,
    },
    create: {
      code,
      name,
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
    include: {
      _count: {
        select: { students: true }
      }
    }
  });

  return NextResponse.json(campuses);
}
