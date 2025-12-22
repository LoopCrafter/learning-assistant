import { useActionState, useEffect, useState } from "react";
import { loginAction } from "../../lib/actions/auth";
import type { LoginState } from "../../lib/actions/types";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialValue: LoginState = {
  success: false,
  error: {},
  data: null,
};
const LoginPage = () => {
  const navigate = useNavigate();
  const [state, formAction, inPending] = useActionState(
    loginAction,
    initialValue
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.success) {
      navigate("/dashboard", { replace: true });
    }
  }, [state.success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-gray-200 p-8 shadow-sm"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-green-600">
          Sign in
        </h1>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700">Email</label>
          <input
            name="email"
            defaultValue={state.data?.email as string}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
          {state.error.email && (
            <span className="text-red-500 text-xs">{state.error.email}</span>
          )}
        </div>

        <div className="mb-6 relative">
          <label className="mb-1 block text-sm text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              name="password"
              defaultValue={state.data?.password as string}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
            <button
              type="button"
              className="absolute right-2 top-2.5"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeClosed width={16} height={16} />
              ) : (
                <Eye width={16} height={16} />
              )}
            </button>
          </div>
          {state.error.password && (
            <span className="text-red-500 text-xs">{state.error.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={inPending}
          className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {inPending ? "Loading..." : "Login"}
        </button>

        <p className="mt-6 text-center text-xs text-gray-400">© Secure Login</p>
      </form>
    </div>
  );
};

export default LoginPage;
