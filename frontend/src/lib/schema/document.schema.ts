import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),

  file: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Document is required",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File must be less than 10MB",
    }),
});

export type UploadInput = z.infer<typeof uploadSchema>;
