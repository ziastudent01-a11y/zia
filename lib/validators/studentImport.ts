import { z } from "zod";

export const StudentImportSchema = z.object({
  file_number: z.string().min(1),
  national_id: z.string().min(1),
  campus_code: z.string().min(1),
  student_uid: z.string().optional(),

  program_name: z.string().min(1),
  current_semester: z.coerce.number().min(1).max(4),
  academic_status: z.enum(["ENROLLED", "PASSED", "FAILED", "DROPPED_OUT"]),
  dropout_reason: z.string().optional(),

  guardian_type: z.enum(["SELF", "PARENT", "GUARDIAN"]),
  guardian_name: z.string().optional(),
  guardian_cnic: z.string().optional(),

  social_security: z.string().optional(),
  factory_name: z.string().optional(),
  designation: z.string().optional(),

  funding_status: z.enum(["NOT_FILED", "FILED", "APPROVED", "REJECTED"]),
  documents_status: z.enum(["COMPLETE", "IN_PROGRESS", "INCOMPLETE"]),
});