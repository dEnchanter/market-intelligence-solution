/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useChangePassword } from "@/hooks/use-users";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, setAuth, getToken } from "@/lib/utils/auth";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    } else {
      // Check if user must change password
      const user = getUser();
      if (user?.must_change_password) {
        setMustChangePassword(true);
      }
    }
  }, [router]);

  // Prevent autofill on mount
  useEffect(() => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }, []);

  const changePassword = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords Don't Match", {
        description: "New password and confirm password must match.",
      });
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      toast.error("Password Too Short", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    changePassword.mutate(
      {
        old_password: oldPassword,
        new_password: newPassword,
      },
      {
        onSuccess: () => {
          // Update user data to set must_change_password to false
          const user = getUser();
          const token = getToken();
          if (user && token) {
            setAuth(token, {
              ...user,
              must_change_password: false,
            });
          }

          // Clear form
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        },
      }
    );
  };

  const handleBack = () => {
    // Prevent navigation if user must change password
    if (mustChangePassword) {
      toast.warning("Password Change Required", {
        description: "You must change your password before continuing.",
      });
      return;
    }
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden animate-gradientShift bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-floatSlow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-orbitSlow" />
      </div>

      <MaxWidthWrapper className="relative z-10 w-full">
        <div className="flex items-center justify-center w-full py-4 lg:py-0">
          <div className="w-full max-w-md px-4 sm:px-6">
            {/* Back Button - Only show if not required to change password */}
            {!mustChangePassword && (
              <button
                onClick={handleBack}
                className="mb-3 flex items-center gap-2 text-sm text-gray-600 hover:text-[#013370] transition-colors animate-fadeInUp"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}

            {/* Change Password Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-6 transition-all duration-300 hover:shadow-3xl animate-scaleIn">
              {/* Logo */}
              <div className="flex justify-center mb-4 animate-fadeInUp delay-100">
                <div className="relative w-16 h-16">
                  <Image
                    src="/logo.png"
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-4 animate-fadeInUp delay-200">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {mustChangePassword ? "Password Change Required" : "Change Password"}
                </h1>
                <p className="text-sm text-gray-600">
                  {mustChangePassword
                    ? "Please change your password to continue"
                    : "Update your account password"}
                </p>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">
                {/* Old Password Field */}
                <div className="space-y-2 animate-fadeInUp delay-300">
                  <Label
                    htmlFor="old-password"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    Current Password
                  </Label>
                  <div className="relative group input-glow">
                    <Input
                      id="old-password"
                      name="old-password"
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full h-10 px-4 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#013370]/20 focus:border-[#013370] transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300"
                      placeholder="Enter current password"
                      autoComplete="new-password"
                      required
                      disabled={changePassword.isPending}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#013370] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#013370] transition-colors focus:outline-none"
                      disabled={changePassword.isPending}
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2 animate-fadeInUp delay-400">
                  <Label
                    htmlFor="new-password"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    New Password
                  </Label>
                  <div className="relative group input-glow">
                    <Input
                      id="new-password"
                      name="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-10 px-4 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#013370]/20 focus:border-[#013370] transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      required
                      disabled={changePassword.isPending}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#013370] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#013370] transition-colors focus:outline-none"
                      disabled={changePassword.isPending}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2 animate-fadeInUp delay-500">
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative group input-glow">
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-10 px-4 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#013370]/20 focus:border-[#013370] transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      required
                      disabled={changePassword.isPending}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#013370] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#013370] transition-colors focus:outline-none"
                      disabled={changePassword.isPending}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="w-full h-10 bg-linear-to-r from-[#013370] to-[#0147a3] hover:from-[#012a5c] hover:to-[#013370] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn-ripple animate-fadeInUp delay-600"
                >
                  {changePassword.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Password...
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>

              {/* Info */}
              <div className="mt-4 pt-3 border-t border-gray-200 animate-fadeInUp delay-700">
                <p className="text-center text-xs text-gray-600">
                  Password must be at least 6 characters long
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 text-center animate-fadeInUp delay-800">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Powered By Brs Limited © 2025
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
