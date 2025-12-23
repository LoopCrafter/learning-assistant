import { uploadSchema } from "../schema/document";

export const UploadDocumentAction = async (_: any, formData: FormData) => {
  const uploadDocData = {
    title: formData.get("title"),
    file: formData.get("file"),
  };

  const result = uploadSchema.safeParse(uploadDocData);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      error: {
        title: fieldErrors.title?.[0],
        file: fieldErrors.file?.[0],
      },
      data: {
        title: uploadDocData.title,
        file: uploadDocData.file,
      },
    };
  }
  return {
    success: true,
    error: {},
    data: {
      title: uploadDocData.title,
      file: uploadDocData.file,
    },
  };
};
