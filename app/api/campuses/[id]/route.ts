import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campus = await prisma.campus.findUnique({
    where: { id },
  });

  if (!campus) {
    return NextResponse.json({ error: "Campus not found" }, { status: 404 });
  }

  return NextResponse.json(campus);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();

    // Whitelist allowed fields to prevent "Unknown argument" errors
    const { name, code, city, latitude, longitude, address, isActive } = json;

    const campus = await prisma.campus.update({
      where: { id },
      data: {
        name,
        code,
        city,
        latitude: parseFloat(String(latitude)),
        longitude: parseFloat(String(longitude)),
        address,
        isActive
      },
    });
    return NextResponse.json(campus);
  } catch (error) {
    console.error("Error updating campus:", error);
    return NextResponse.json(
      { error: "Error updating campus" },
      { status: 500 }
    );
  }
}
