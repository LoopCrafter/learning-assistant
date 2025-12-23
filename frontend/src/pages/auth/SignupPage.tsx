import { useActionState, useState, useEffect } from "react";
import { signupAction } from "../../lib/actions/auth";
import type { SignupState } from "../../lib/actions/types";
import { BrainCircuit, Eye, EyeClosed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const initialValue: SignupState = {
  success: false,
  error: {},
  data: null,
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [state, formAction, inPending] = useActionState(
    signupAction,
    initialValue
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="text-center flex justify-center items-center flex-col mb-4">
          <div className=" flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-2">
            <BrainCircuit className="size-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-medium text-black">Welcome</h1>
          <p className="text-slate-500 text-sm">
            Sign up to start your journey
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700">Name</label>
          <input
            name="name"
            defaultValue={state.data?.name as string}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
          {state.error.name && (
            <span className="text-red-500 text-xs">{state.error.name}</span>
          )}
        </div>

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

        <div className="mb-4 relative">
          <label className="mb-1 block text-sm text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
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

        <div className="mb-6 relative">
          <label className="mb-1 block text-sm text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              defaultValue={state.data?.confirmPassword as string}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
            <button
              type="button"
              className="absolute right-2 top-2.5"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeClosed width={16} height={16} />
              ) : (
                <Eye width={16} height={16} />
              )}
            </button>
          </div>
          {state.error.confirmPassword && (
            <span className="text-red-500 text-xs">
              {state.error.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={inPending}
          className="w-full text-center group flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-slate-50 hover:text-slate-900 hover:shadow-lg hover:shadow-emerald-500/30
              "
        >
          {inPending ? "Loading..." : "Sign up"}
        </button>

        <p className="mt-6 text-center text-xs text-gray-400">
          Do you have already an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
