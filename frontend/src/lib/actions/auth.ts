import { useAuthStore } from "../../store/useAuthStore";
import { LoginSchema } from "../schema/auth";
import type { LoginState } from "./types";

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
