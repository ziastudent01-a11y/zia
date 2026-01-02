import { z } from "zod";

export const studentSchema = z.object({
    // Identity
    fileNumber: z.string().min(1, "File number is required"),
    nationalId: z.string().min(1, "National ID is required"),
    studentName: z.string().min(1, "Student name is required"),
    dateOfBirth: z.string().nullable().optional(), // Receive as string, convert to Date
    gender: z.enum(["MALE", "FEMALE"]),

    // Campus
    campusId: z.string().min(1, "Campus is required"),
    programName: z.string().min(1, "Program is required"),
    session: z.string().optional(),
    lastDegree: z.string().optional(),

    // Guardian / Employment
    guardianType: z.enum(["SELF", "PARENT", "GUARDIAN"]),
    guardianName: z.string().optional(),
    guardianCNIC: z.string().optional(),
    fatherName: z.string().optional(),

    // Factory
    factoryName: z.string().optional(),
    factoryLocation: z.string().optional(),
    factoryDepartment: z.string().optional(),
    factoryCardNo: z.string().optional(),
    dateOfJoining: z.string().optional(),
    serviceDuration: z.string().optional(),
    designation: z.string().optional(),

    // Contact
    phonePrimary: z.string().optional(),
    phoneSecondary: z.string().optional(),
    bankAccount: z.string().optional(),

    // Status
    applicationStatus: z.enum([
        "NOT_FILED",
        "FILE_COMPLETE",
        "FILE_INCOMPLETE",
        "FILE_SUBMITTED",
        "RETURNED",
    ]),
    courseStatus: z.enum(["ENROLLED", "COMPLETED", "DROPPED"]),
    isEligible: z.boolean().default(true),
});

export type StudentFormData = z.infer<typeof studentSchema>;
