import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet) as any[];

        // 1. Validate / Transform Rows
        // Assuming Excel columns: FileNumber, Name, CampusCode, ...
        const validStudents = [];
        const errors = [];

        // Get Campuses Map for validation/lookup
        const campuses = await prisma.campus.findMany();
        const campusMap = new Map(campuses.map((c: any) => [c.code, c.id]));

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const campusCode = row["Campus Code"]; // Adjust key as per Excel
            const campusId = campusMap.get(campusCode);

            if (!campusId) {
                errors.push(`Row ${i + 2}: Campus Code '${campusCode}' not found`);
                continue;
            }

            // Basic mapping
            validStudents.push({
                fileNumber: String(row["File Number"] || ""),
                nationalId: String(row["National ID"] || ""),
                studentName: String(row["Student Name"] || ""),
                gender: row["Gender"] === "FEMALE" ? "FEMALE" : "MALE",
                campusId: campusId,
                programName: String(row["Program"] || "Unknown"),
                guardianType: "SELF", // Default
                applicationStatus: "FILE_COMPLETE", // Default for bulk import?
                isEligible: true,
                // ... map other fields as needed
            });
        }

        if (errors.length > 0 && validStudents.length === 0) {
            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
        }

        // 2. Batch Insert (using transaction to be safe, or createMany)
        // prisma.student.createMany is efficient but skips hooks/relations if any.
        // Given the complexity of upserts, we might loop or use createMany.
        // Let's use createMany for speed, assuming no conflicts for now.

        // However, duplicate fileNumbers will fail everything in createMany.
        // Safer to use a transaction or "skipDuplicates" if key collision is acceptable.

        const result = await prisma.student.createMany({
            data: validStudents as any, // Cast for brevity in this snippet
            skipDuplicates: true,
        });

        return NextResponse.json({
            success: true,
            count: result.count,
            warnings: errors
        });

    } catch (error) {
        console.error("Excel import error:", error);
        return NextResponse.json({ error: "Import failed" }, { status: 500 });
    }
}
