import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readExcel } from "@/lib/excel/readExcel";
import { StudentImportSchema } from "@/lib/validators/studentImport";

/* ================================
   Normalization Helpers
================================ */

function normalizeGuardian(value?: string) {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes("self")) return "SELF";
  if (v.includes("parent")) return "PARENT";
  if (v.includes("husband")) return "HUSBAND";
  return null;
}

function normalizeAppStatus(value?: string) {
  if (!value) return "PENDING";
  const v = value.toLowerCase();
  if (v.includes("complete")) return "COMPLETE";
  if (v.includes("returned")) return "RETURNED";
  if (v.includes("missing")) return "MISSING_DOCS";
  return "PENDING";
}

function normalizeCourseStatus(value?: string) {
  if (!value) return "ACTIVE";
  const v = value.toLowerCase();
  if (v.includes("pass")) return "PASSED";
  if (v.includes("fail")) return "FAILED";
  if (v.includes("drop")) return "DROPPED";
  return "ACTIVE";
}

/* ================================
   Eligibility (LOCKED LOGIC)
================================ */

function computeEligibility(row: any) {
  return (
    Boolean(row["FACTORY"]) &&
    Boolean(row["Worker CNIC"]) &&
    row["Status (Deficieny) [(file status to govt)]"] !== "Returned"
  );
}

/* ================================
   API Handler
================================ */

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Excel file is required" },
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

    /* ---------- Validation ---------- */
    const parsed = StudentImportSchema.safeParse(row);
    if (!parsed.success) {
      errors.push({
        row: i + 2,
        issues: parsed.error.flatten().fieldErrors,
      });
      continue;
    }

    const data = parsed.data;

    /* ---------- Campus Resolution ---------- */
    const campus = await prisma.campus.findUnique({
      where: { code: data.campus_code },
    });

    if (!campus) {
      errors.push({ row: i + 2, error: "Invalid campus code" });
      continue;
    }

    /* ---------- Existing Student ---------- */
    const existing = await prisma.student.findFirst({
      where: {
        OR: [
          { fileNumber: data.file_number },
          { nationalId: data.national_id },
        ],
      },
    });

    /* ---------- Payload Mapping ---------- */
    const payload = {
      campusId: campus.id,

      studentName: row["Student Name"],
      nationalId: row["Student CNIC"],
      dateOfBirth: row["Student DOB"]
        ? new Date(row["Student DOB"])
        : null,
      gender: row["Gander"]?.toUpperCase(),

      programName: row["Program"],
      session: row["SESSION"],
      lastDegree: row["LAST .D (degree)"],

      guardianType: normalizeGuardian(row["Self / Parent / Husband"]),
      guardianName: row["Worker Name"],
      guardianCNIC: row["Worker CNIC"],
      fatherName: row["Father Name"],

      designation: row["Designation"],
      factoryName: row["FACTORY"],
      factoryLocation: row["Factory Location"],
      factoryDepartment: row["Department (factory department)"],
      factoryCardNo: row["Factory Card No"],
      dateOfJoining: row["Date Of Joining"]
        ? new Date(row["Date Of Joining"])
        : null,
      serviceDuration: row["Service Duration"],

      phonePrimary: row["Phone 1"],
      phoneSecondary: row["Phone 2"],
      bankAccount: row["IBM (bank account)"],

      applicationStatus: normalizeAppStatus(
        row["Status (Deficieny) [(file status to govt)]"]
      ),
      fileStatusOnline: row["File Status Online"],
      pwwbUploadStatus: row["Status (PWWB Uploading)"],
      registrationStatus:
        row["Status (FBISE/ Superior Reg/other afflition reg number)"],
      courseStatus: normalizeCourseStatus(row["Status (Course)"]),

      isEligible: computeEligibility(row),
    };

    /* ---------- Remove empty fields ---------- */
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([, value]) => value !== null && value !== ""
      )
    );

    /* ---------- UPSERT ---------- */
    if (existing) {
      await prisma.student.update({
        where: { id: existing.id },
        data: cleanPayload,
      });
      updated++;
    } else {
      await prisma.student.create({
        data: {
          fileNumber: data.file_number,
          nationalId: data.national_id,
          studentUid: data.student_uid,
          ...cleanPayload,
        },
      });
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
