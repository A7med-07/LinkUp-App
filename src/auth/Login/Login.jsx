import { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaLogin } from "../../schema/schemas";
import { signIn } from "../../services/api";
import { AuthContext } from "../../context/authContext";

export default function Login() {
  const { setuserToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, formState: { errors, touchedFields } } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schemaLogin),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  async function submitForm(formData) {
    setIsLoading(true);
    setApiError(null);
    const response = await signIn(formData);
    if (response?.data?.token) {
      localStorage.setItem("token", response.data.token);
      setuserToken(response.data.token);
      navigate("/home");
    } else {
      setApiError(response?.errors ?? response?.message ?? "Something went wrong");
    }
    setIsLoading(false);
  }

  return (
    <div className=" flex items-center justify-center py-8 px-4 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-sky-50/20">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 rounded-3xl bg-white shadow-2xl border-2 border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">Welcome Back!</h2>
          <p className="text-blue-100 text-lg">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10 md:p-12">
          <form onSubmit={handleSubmit(submitForm)} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="example@email.com"
                className={`w-full bg-gray-50 border-2 rounded-xl p-4 outline-none transition-all duration-300 text-sm sm:text-base ${errors.email && touchedFields.email ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              {errors.email && touchedFields.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-gray-50 border-2 rounded-xl p-4 outline-none transition-all duration-300 text-sm sm:text-base ${errors.password && touchedFields.password ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
              />
              {errors.password && touchedFields.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {apiError}
              </div>
            )}

            {/* Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-base sm:text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors duration-300">
                Create Account
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Secure Login</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your login credentials are encrypted and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}