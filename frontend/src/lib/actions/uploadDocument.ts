"use server";

import type { UploadActionState } from "@src/components/documents/types";
import { uploadSchema } from "../schema/document.schema";

export async function uploadDocumentAction(
  prevState: UploadActionState,
  formData: FormData
): Promise<UploadActionState> {
  const rawTitle = formData.get("title");
  const rawFile = formData.get("file");

  const title = typeof rawTitle === "string" ? rawTitle : "";

  const file = rawFile instanceof File ? rawFile : null;

  const parsed = uploadSchema.safeParse({ title, file });

  if (!parsed.success) {
    return {
      success: false,
      data: {
        title: title,
        fileName: file?.name,
      },
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // upload logic here...

  return {
    success: true,
    data: {
      title: parsed.data.title,
      fileName: parsed.data.file.name,
    },
    errors: {},
  };
}
