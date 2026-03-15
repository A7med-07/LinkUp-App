import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/api";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState({ old: false, new: false, confirm: false });

  function validate() {
    const e = {};
    if (!form.oldPassword) e.oldPassword = "Current password is required";
    if (!form.newPassword || form.newPassword.length < 8) e.newPassword = "Min 8 characters";
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError(null);
    const res = await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
    if (res?.success || res?.message === "success") {
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 2000);
    } else {
      setApiError(res?.errors ?? res?.message ?? "Something went wrong");
    }
    setIsLoading(false);
  }

  const fields = [
    { key: "oldPassword", label: "Current Password", showKey: "old" },
    { key: "newPassword", label: "New Password", showKey: "new" },
    { key: "confirmPassword", label: "Confirm New Password", showKey: "confirm" },
  ];

  return (
    <div className="flex items-center justify-center py-8 px-4 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-sky-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">Change Password</h2>
          <p className="text-blue-100 text-lg">Keep your account secure</p>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10 md:p-12">
          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Password changed successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base mb-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={show[field.showKey] ? "text" : "password"}
                    placeholder="••••••••"
                    value={form[field.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border-2 rounded-xl p-4 pr-12 outline-none transition-all duration-300 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 ${
                      errors[field.key]
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                  />
                  <button type="button"
                    onClick={() => setShow((p) => ({ ...p, [field.showKey]: !p[field.showKey] }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show[field.showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors[field.key] && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}

            {apiError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {apiError}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => navigate("/profile")}
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                Cancel
              </button>
              <button disabled={isLoading} type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 font-medium">Secure</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your password is encrypted and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}