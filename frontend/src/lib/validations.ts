import { z } from "zod";

export const diagnoseFormSchema = z.object({
  truck_id: z.string().min(1, "Please select a vehicle"),
  symptom_text: z
    .string()
    .min(10, "Describe the symptom in at least 10 characters")
    .max(2000),
  dtc_codes: z
    .string()
    .min(1, "Enter at least one DTC code")
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
});

export type DiagnoseFormValues = z.infer<typeof diagnoseFormSchema>;

export const testResultSchema = z.object({
  result: z.string().min(1, "Enter the test result"),
  notes: z.string().optional().default(""),
});

export type TestResultValues = z.infer<typeof testResultSchema>;
