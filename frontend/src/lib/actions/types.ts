export type LoginState = {
  success: boolean;
  error: {
    email?: string;
    password?: string;
  };
  data: null | {
    email: FormDataEntryValue | null;
    password?: FormDataEntryValue | null;
  };
};
export type SignupState = {
  success: boolean;
  error: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  data: null | {
    name: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    password?: FormDataEntryValue | null;
    confirmPassword?: FormDataEntryValue | null;
  };
};
