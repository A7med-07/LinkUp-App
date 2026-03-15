import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaRegister } from "../../schema/schemas";
import { signUp } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, formState: { errors, touchedFields } } = useForm({
    defaultValues: { name: "", username: "", email: "", password: "", rePassword: "", dateOfBirth: "", gender: "" },
    resolver: zodResolver(schemaRegister),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  async function submitForm(formData) {
    setIsLoading(true);
    setApiError(null);
    const response = await signUp(formData);
    if (response?.message?.includes("created") || response?.success) {
      navigate("/");
    } else {
      setApiError(response?.errors ?? response?.message ?? "Something went wrong");
    }
    setIsLoading(false);
  }

  const fieldClass = (hasError) =>
    `w-full bg-gray-50 border-2 rounded-xl p-4 outline-none transition-all duration-300 text-sm sm:text-base ${hasError ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`;

  const ErrorMsg = ({ msg }) => msg ? (
    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
      {msg}
    </p>
  ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-sky-50/20">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 rounded-3xl bg-white shadow-2xl border-2 border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">Create Account</h2>
          <p className="text-blue-100 text-lg">Join us today for free!</p>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10 md:p-12">
          <form onSubmit={handleSubmit(submitForm)} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input {...register("name")} placeholder="Enter your full name" className={fieldClass(errors.name && touchedFields.name)} />
              <ErrorMsg msg={errors.name && touchedFields.name ? errors.name.message : null} />
            </div>

            {/* Username */}
            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Username <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input {...register("username")} placeholder="e.g. john_doe" className={fieldClass(errors.username && touchedFields.username)} />
              <ErrorMsg msg={errors.username && touchedFields.username ? errors.username.message : null} />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input {...register("email")} type="email" placeholder="example@email.com" className={fieldClass(errors.email && touchedFields.email)} />
              <ErrorMsg msg={errors.email && touchedFields.email ? errors.email.message : null} />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input {...register("password")} type="password" placeholder="Min 8 chars, uppercase, number, symbol" className={fieldClass(errors.password && touchedFields.password)} />
              <ErrorMsg msg={errors.password && touchedFields.password ? errors.password.message : null} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Confirm Password
              </label>
              <input {...register("rePassword")} type="password" placeholder="Re-enter your password" className={fieldClass(errors.rePassword && touchedFields.rePassword)} />
              <ErrorMsg msg={errors.rePassword && touchedFields.rePassword ? errors.rePassword.message : null} />
            </div>

            {/* Date & Gender */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date of Birth
                </label>
                <input {...register("dateOfBirth")} type="date" className={fieldClass(errors.dateOfBirth && touchedFields.dateOfBirth)} />
                <ErrorMsg msg={errors.dateOfBirth && touchedFields.dateOfBirth ? errors.dateOfBirth.message : null} />
              </div>
              <div className="flex-1">
                <label className="text-gray-700 font-semibold flex items-center gap-2 text-sm mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Gender
                </label>
                <select {...register("gender")} className={`${fieldClass(errors.gender && touchedFields.gender)} cursor-pointer`}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <ErrorMsg msg={errors.gender && touchedFields.gender ? errors.gender.message : null} />
              </div>
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
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors duration-300">
                Sign In
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Secure Registration</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your information is encrypted and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}