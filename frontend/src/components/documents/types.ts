export type UploadActionState = {
  success: boolean;
  data?: {
    title: string;
    fileName?: string;
  };
  errors: {
    title?: string[];
    file?: string[];
    form?: string[];
  };
};
