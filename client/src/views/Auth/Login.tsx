"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Chrome, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { memo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useGoogleLogin } from "@react-oauth/google"
import AuthService, { type LoginRequest, type ApiError } from "@/services/auth.service"

// Background elements with reduced brightness and added visual interest
const LoginBackground = memo(() => (
  <>
    {/* Solid light background instead of gradient */}
    <div className="absolute inset-0 bg-gray-50" />
    {/* Subtle geometric pattern overlay */}
    <div className="absolute inset-0 opacity-[0.04]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 40px 40px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 30px 30px, 0 0, 0 0",
        }}
      />
    </div>
    {/* Subtle texture overlay */}
    <div className="absolute inset-0 opacity-[0.02]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.01) 2px,
              rgba(0, 0, 0, 0.01) 4px
            )
          `,
        }}
      />
    </div>
    {/* Muted floating shapes */}
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-100/15 rounded-full blur-3xl" />
    <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-blue-100/10 rounded-full blur-2xl" />
    {/* Subtle decorative elements */}
    <div className="absolute top-20 left-20 w-1 h-1 bg-gray-300 rounded-full opacity-40" />
    <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-30" />
    <div className="absolute bottom-32 left-40 w-1 h-1 bg-gray-300 rounded-full opacity-35" />
    <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-25" />
    {/* Subtle corner accents */}
    <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-gray-200/50 rounded-tl-3xl" />
    <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-gray-200/50 rounded-br-3xl" />
  </>
))

// Validation functions
const validateEmail = (email: string): string => {
  if (!email) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return ""
}

const validatePassword = (password: string): string => {
  if (!password) return "Password is required"
  if (password.length < 6) return "Password must be at least 6 characters long"
  return ""
}

// Error message component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-red-600 text-sm mt-1 animate-in slide-in-from-left-2 duration-200">
    <AlertCircle className="w-4 h-4 flex-shrink-0" />
    <span>{message}</span>
  </div>
)

// Success message component
const SuccessMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-green-600 text-sm mt-1 animate-in slide-in-from-left-2 duration-200">
    <CheckCircle className="w-4 h-4 flex-shrink-0" />
    <span>{message}</span>
  </div>
)

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialAuthLoading, setSocialAuthLoading] = useState(false)
  const [apiError, setApiError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Validation state
  const errors = {
    email: touched.email ? validateEmail(formData.email) : "",
    password: touched.password ? validatePassword(formData.password) : "",
  }

  const isFormValid = !errors.email && !errors.password && formData.email && formData.password

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear API error when user starts typing
      if (apiError) setApiError("")
    },
    [apiError],
  )

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  // Handle login submission
  const handleSubmit = useCallback(
    async (e?: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent any default behavior
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      try {
        // Mark all fields as touched to show validation errors
        setTouched({ email: true, password: true })

        // Check if form is valid
        if (!isFormValid) {
          setApiError("Please fix all validation errors before submitting.")
          return
        }

        setIsLoading(true)
        setApiError("")
        setSuccessMessage("")

        // Prepare login data
        const loginData: LoginRequest = {
          Email: formData.email.trim().toLowerCase(),
          Password: formData.password,
        }

        console.log("🚀 Submitting login:", { email: loginData.Email })

        const response = await AuthService.login(loginData)
        console.log("✅ Login successful:", response)

        // Handle success - use correct property names from AuthService response
        setSuccessMessage(response.message || "Login successful!")

        setTimeout(() => {
          if (response.userType == "Mentor") {
            navigate("/mentor/dashboard");
          } else {
            navigate("/user/dashboard");
          }
          setIsLoading(false);
        }, 1500)

      } catch (error) {
        console.error("❌ Login error:", error)
        const apiError = error as ApiError

        // Set error message
        setApiError(apiError.message || "Invalid email or password. Please try again.")

        // Clear error after delay
        setTimeout(() => {
          setApiError("")
        }, 8000)
      } finally {
        setIsLoading(false)
      }
    },
    [formData, isFormValid],
  )

  // Handle OAuth login (for users who registered with OAuth)
  const handleOAuthLogin = useCallback(async (profile: any, provider: string) => {
    try {
      // For OAuth users, we need to check if they exist and get their token
      // Since OAuth users don't have passwords, we'll use a special OAuth login flow
      // This would require a separate OAuth login endpoint in your backend

      console.log("🔍 OAuth login not yet implemented for existing users")
      setApiError("OAuth login for existing users is not yet implemented. Please use your email and password.")

      setTimeout(() => {
        setApiError("")
      }, 8000)
    } catch (error) {
      console.error("❌ OAuth login error:", error)
      setApiError("OAuth login failed. Please try again.")

      setTimeout(() => {
        setApiError("")
      }, 8000)
    }
  }, [])

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("🔑 Google token received:", tokenResponse)

      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch Google user info")
        }

        const profile = await res.json()
        console.log("👤 Google User Info:", profile)

        await handleOAuthLogin(profile, "Google")
      } catch (error) {
        console.error("❌ Failed to process Google OAuth:", error)
        setApiError("Failed to process Google authentication. Please try again.")

        setTimeout(() => {
          setApiError("")
        }, 8000)
      } finally {
        setSocialAuthLoading(false)
      }
    },
    onError: (error) => {
      console.error("❌ Google Login Failed:", error)
      setApiError("Google authentication failed. Please try again.")
      setSocialAuthLoading(false)

      setTimeout(() => {
        setApiError("")
      }, 8000)
    },
  })

  const handleSocialLogin = useCallback(
    (provider: string) => {
      setApiError("")
      setSuccessMessage("")

      if (provider === "GitHub") {
        setSocialAuthLoading(true)
        setApiError("GitHub authentication is not yet implemented.")
        setSocialAuthLoading(false)

        setTimeout(() => {
          setApiError("")
        }, 8000)
        return
      } else if (provider === "Google") {
        setSocialAuthLoading(true)
        googleLogin()
      }
    },
    [googleLogin],
  )

  // Handle Enter key press in form fields (use onKeyDown instead of onKeyPress)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (isFormValid && !isLoading && !socialAuthLoading) {
          handleSubmit();
        }
      }
    },
    [handleSubmit, isFormValid, isLoading, socialAuthLoading],
  )

  return (
    <section className="min-h-screen pt-32 pb-10 w-full flex items-center justify-center p-4 relative overflow-hidden">
      <LoginBackground />
      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-10 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:bg-white/80 hover:border-white/80"
          style={{
            boxShadow: "0 25px 50px rgba(99, 102, 241, 0.15)",
          }}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/20 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl text-gray-900 font-bold mb-3">Welcome Back</h2>
              <p className="text-gray-600 text-base">Start where you left off</p>
            </div>

            {/* API Error/Success Messages */}
            {apiError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">{apiError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-8" onKeyDown={handleKeyDown}>
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 font-medium text-base">
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || socialAuthLoading}
                    className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.email ? "border-red-500 focus:border-red-500" : ""
                      } ${touched.email && !errors.email && formData.email ? "border-green-500 focus:border-green-500" : ""
                      } ${isLoading || socialAuthLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    autoComplete="email"
                  />
                  {/* Success/Error Icon */}
                  {touched.email && formData.email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {errors.email ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {errors.email && <ErrorMessage message={errors.email} />}
                {touched.email && !errors.email && formData.email && <SuccessMessage message="Email looks good!" />}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 font-medium text-base">
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || socialAuthLoading}
                    className={`pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.password ? "border-red-500 focus:border-red-500" : ""
                      } ${touched.password && !errors.password && formData.password
                        ? "border-green-500 focus:border-green-500"
                        : ""
                      } ${isLoading || socialAuthLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || socialAuthLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <ErrorMessage message={errors.password} />}
                {touched.password && !errors.password && formData.password && (
                  <SuccessMessage message="Password is secure!" />
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: !!checked }))}
                    disabled={isLoading || socialAuthLoading}
                    className="border-gray-400 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 w-5 h-5"
                  />
                  <Label htmlFor="remember" className="text-gray-600 text-base cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  to={"/forget-password"}
                  className="text-indigo-600 hover:text-indigo-700 text-base font-medium transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || socialAuthLoading || !isFormValid}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              {/* Form Validation Summary */}
              {(touched.email || touched.password) && !isFormValid && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Please fix the errors above to continue</span>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/70 text-gray-600 backdrop-blur-sm">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("GitHub")}
                  disabled={isLoading || socialAuthLoading}
                  className={`flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50 ${isLoading || socialAuthLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {socialAuthLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="font-medium">GitHub</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  disabled={isLoading || socialAuthLoading}
                  className={`flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50 ${isLoading || socialAuthLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {socialAuthLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="font-medium">Google</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-base">
                  Don't have an account?{" "}
                  <Link
                    to={"/signup"}
                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
