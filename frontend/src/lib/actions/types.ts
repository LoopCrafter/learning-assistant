export type LoginState = {
  success: boolean;
  error: {
    email?: string;
    password?: string;
  };
  data: null | {
    email?: FormDataEntryValue | null;
    password?: FormDataEntryValue | null;
  };
};
