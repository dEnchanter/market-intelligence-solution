/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { MaxWidthWrapper } from "@/components/utils/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { LoginRequest } from "@/lib/types/auth";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setAuth, isAuthenticated } from "@/lib/utils/auth";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  // Prevent autofill on mount
  useEffect(() => {
    setPhone("");
    setPassword("");
  }, []);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      console.log("Login successful:", data);

      // Store token and user data using auth utility
      setAuth(data.data.token, {
        name: data.data.name,
        profile_type: data.data.profile_type,
        district_id: data.data.district_id,
        expires_at: data.data.expires_at,
        must_change_password: data.data.must_change_password,
      });

      toast.success("Login Successful!", {
        description: data.message || "Welcome back!",
      });

      // Redirect based on must_change_password
      if (data.data.must_change_password) {
        toast.info("Password Change Required", {
          description: "Please change your password to continue.",
        });
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
      toast.error("Login Failed", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ phone, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden animate-gradientShift bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '0s'}} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-floatSlow" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-orbitSlow" />
      </div>

      <MaxWidthWrapper className="relative z-10 w-full">
        <div className="flex items-center justify-center w-full py-4 lg:py-0">
          <div className="w-full max-w-md px-4 sm:px-6">
            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-7 transition-all duration-300 hover:shadow-3xl animate-scaleIn">
              {/* Logo */}
              <div className="flex justify-center mb-5 animate-fadeInUp delay-100">
                <div className="relative w-20 h-20">
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
              <div className="text-center mb-5 animate-fadeInUp delay-200">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Welcome Back
                </h1>
                <p className="text-sm text-gray-600">
                  Administrative Profile Login
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                {/* Phone Field */}
                <div className="space-y-2 animate-fadeInUp delay-300">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    Phone Number
                  </Label>
                  <div className="relative group input-glow">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-4 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#013370]/20 focus:border-[#013370] transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300"
                      placeholder="Enter your phone number"
                      autoComplete="off"
                      required
                      disabled={loginMutation.isPending}
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#013370] transition-colors" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 animate-fadeInUp delay-400">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    Password
                  </Label>
                  <div className="relative group input-glow">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 px-4 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#013370]/20 focus:border-[#013370] transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-gray-300"
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      required
                      disabled={loginMutation.isPending}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#013370] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#013370] transition-colors focus:outline-none password-toggle-icon"
                      disabled={loginMutation.isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-end text-sm animate-fadeInUp delay-500">
                  <a
                    href="#"
                    className="text-xs text-[#013370] hover:text-[#0147a3] font-medium transition-all duration-200 hover:underline hover:scale-105"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-11 bg-linear-to-r from-[#013370] to-[#0147a3] hover:from-[#012a5c] hover:to-[#013370] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn-ripple animate-fadeInUp delay-600"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-5 pt-4 border-t border-gray-200 animate-fadeInUp delay-700">
                <p className="text-center text-xs text-gray-600">
                  Don&#39;t have an account?{" "}
                  <a
                    href="#"
                    className="text-xs text-[#013370] hover:text-[#0147a3] font-semibold transition-all duration-200 hover:underline"
                  >
                    Contact Administrator
                  </a>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center animate-fadeInUp delay-800">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Powered By BRA Limited © 2025
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
