import { z } from "zod";

export const uploadSchema = z.object({
  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.size > 0, {
      message: "File is empty",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),

  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(150, { message: "Title is too long" }),
});

export type UploadFormData = z.infer<typeof uploadSchema>;
