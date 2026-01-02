import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readExcel } from "@/lib/excel/readExcel";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Campus Excel file required" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rows = readExcel<any>(buffer);

  let created = 0;
  let updated = 0;
  const errors: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (
      !row["Campus Code"] ||
      !row["Campus Name"] ||
      !row["City"] ||
      !row["Latitude"] ||
      !row["Longitude"]
    ) {
      errors.push({
        row: i + 2,
        error: "Missing required campus fields",
      });
      continue;
    }

    const payload = {
      code: String(row["Campus Code"]).trim(),
      name: String(row["Campus Name"]).trim(),
      city: String(row["City"]).trim(),
      latitude: Number(row["Latitude"]),
      longitude: Number(row["Longitude"]),
      address: row["Address"] || null,
      isActive:
        row["Is Active"] === undefined ? true : Boolean(row["Is Active"]),
    };

    const existing = await prisma.campus.findUnique({
      where: { code: payload.code },
    });

    if (existing) {
      await prisma.campus.update({
        where: { id: existing.id },
        data: payload,
      });
      updated++;
    } else {
      await prisma.campus.create({ data: payload });
      created++;
    }
  }

  return NextResponse.json({
    success: true,
    created,
    updated,
    errors,
  });
}
