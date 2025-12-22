import { useAuthStore } from "../../store/useAuthStore";
import { LoginSchema, SignupSchema } from "../schema/auth";
import type { LoginState, SignupState } from "./types";

export const loginAction = async (
  _: any,
  formData: FormData
): Promise<LoginState> => {
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = LoginSchema.safeParse(loginData);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      error: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
      data: {
        email: loginData.email,
        password: loginData.password,
      },
    };
  }

  try {
    await useAuthStore
      .getState()
      .login(loginData.email as string, loginData.password as string);
    return {
      success: true,
      error: {},
      data: {
        email: loginData.email,
        password: loginData.password,
      },
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
      error: {
        email: "",
        password: "",
      },
      data: {
        email: loginData.email,
        password: loginData.password,
      },
    };
  }
};

export const signupAction = async (
  _: any,
  formData: FormData
): Promise<SignupState> => {
  const signupData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = SignupSchema.safeParse(signupData);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      error: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      },
      data: {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      },
    };
  }
  try {
    await useAuthStore
      .getState()
      .signup(
        signupData.name as string,
        signupData.email as string,
        signupData.password as string
      );
    return {
      success: true,
      error: {},
      data: {
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        confirmPassword: signupData.confirmPassword,
      },
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
      error: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      data: {
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        confirmPassword: signupData.confirmPassword,
      },
    };
  }
};
