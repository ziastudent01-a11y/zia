import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const campus = await prisma.campus.findUnique({
    where: { id: params.id },
  });

  if (!campus) {
    return NextResponse.json({ error: "Campus not found" }, { status: 404 });
  }

  return NextResponse.json(campus);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const campus = await prisma.campus.update({
      where: { id: params.id },
      data: json,
    });
    return NextResponse.json(campus);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating campus" },
      { status: 500 }
    );
  }
}
