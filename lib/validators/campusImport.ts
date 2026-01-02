import { z } from "zod";

export const CampusImportSchema = z.object({
  campus_code: z.string().min(1),
  campus_name: z.string().min(1),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export type CampusImportRow = z.infer<typeof CampusImportSchema>;
