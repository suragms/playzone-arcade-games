import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX, Gamepad2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);
  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {["🎮", "🕹️", "🏆", "🎯", "🎪", "🎲"].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-6xl"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                transform: `rotate(${i * 30}deg)`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">
            Welcome to<br />PlayZone
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Your ultimate gaming destination. Play, compete, and climb the leaderboards!
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: "100+", label: "Games" },
              { value: "5M+", label: "Players" },
              { value: "Free", label: "Forever" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">PlayZone</span>
          </div>

          {step === "signIn" ? (
            <div>
              {/* Header */}
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-800">
                  Get Started 🎮
                </h1>
                <p className="mt-3 text-slate-500">
                  Sign in to save your progress and compete on leaderboards
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    className="pl-12 h-14 bg-white border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl text-base"
                    disabled={isLoading}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-xl text-base shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 px-4 text-sm text-slate-400">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Guest Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl font-semibold text-base"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                <UserX className="mr-2 h-5 w-5" />
                Play as Guest
              </Button>

              {/* Benefits */}
              <div className="mt-10 p-5 bg-white rounded-2xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3">With an account you get:</h3>
                <ul className="space-y-2">
                  {[
                    "🏆 Save high scores across devices",
                    "⭐ Track your favorite games",
                    "🎯 Compete on leaderboards",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              {/* OTP Header */}
              <div className="mb-10">
                <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-cyan-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800 text-center">
                  Check your email
                </h1>
                <p className="mt-3 text-slate-500 text-center">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-slate-700">{step.email}</span>
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={otp} />

                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    className="gap-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) {
                          form.requestSubmit();
                        }
                      }
                    }}
                  >
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-14 bg-white border-slate-200 focus:border-violet-400 rounded-xl text-lg font-bold"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-xl text-base shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Play
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-3">
                  <p className="text-sm text-slate-500">
                    Didn't receive a code?{" "}
                    <button
                      type="button"
                      onClick={() => setStep("signIn")}
                      className="text-violet-600 hover:text-violet-700 font-semibold"
                    >
                      Try again
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Use different email
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
