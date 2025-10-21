"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, useNavigate } from "react-router-dom"
import { useGoogleLogin } from "@react-oauth/google"
import AuthService, { type LoginRequest, type ApiError } from "@/services/auth.service"
import { useAuth } from "@/context/AuthContext"
import type GoogleLoginRequest from "@/dtos/GoogleLoginRequest"
import img from "@/assets/img/Signup-Form-Background.png"
import Logo from "@/components/Logo"


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
  const { refreshAuth } = useAuth();
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
            refreshAuth(); // Update auth context immediately
            navigate("/mentor/dashboard");

          } else {
            refreshAuth(); // Update auth context immediately
            navigate("/user/dashboard");
          }
          setIsLoading(false);
        }, 1500)

      } catch (error) {
        console.error("❌ Login error:", error)
        const apiError = error as ApiError

        // Set error message
        setApiError(apiError.message || "Invalid email or password. Please try again.")
        if (apiError.otpError) {
          navigate(`/otp?email=${encodeURIComponent(apiError.otpEmail || "")}`)
        }
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
  // Handle Google OAuth login: send token to backend, handle response
  const handleOAuthLogin = useCallback(
    async (loginResponse: GoogleLoginRequest) => {
      setApiError("");
      setSuccessMessage("");
      setSocialAuthLoading(true);
      try {
        // Send OAuth login request to backend
        const response = await AuthService.googleLogin(loginResponse);
        console.log("✅ OAuth login successful:", response);

        // Handle success - use correct property names from AuthService response
        setSuccessMessage(response.message || "Login successful!");
        setTimeout(() => {
          if (response.userType == "Mentor") {
            refreshAuth(); // Update auth context immediately
            navigate("/mentor/dashboard");
          } else {
            refreshAuth(); // Update auth context immediately
            navigate("/user/dashboard");
          }
          setSocialAuthLoading(false);
        }, 1500);
      } catch (error) {
        console.error("❌ OAuth login error:", error);
        const apiError = error as ApiError;

        // Set error message
        setApiError(apiError.message || "Failed to authenticate with Google. Please try again.");
        setSocialAuthLoading(false);
        // Clear error after delay
        setTimeout(() => {
          setApiError("");
          setSocialAuthLoading(false);
        }, 8000);
      }
    }, [navigate, refreshAuth]);

  // Google login: get id_token, send to backend
  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        // Get Google id_token (JWT) from OAuth response
        if (tokenResponse && tokenResponse.access_token) {
          // Exchange access_token for id_token
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch Google user info");
          const profile = await res.json();
          console.log("Google profile:", profile);
          var loginRequest: GoogleLoginRequest = {
            IdToken: profile.sub, // Use access_token as id_token
            Email: profile.email,
            Name: profile.name,
            Picture: profile.picture,
          }
          await handleOAuthLogin(loginRequest);
        } else {
          throw new Error("No Google access token received");
        }
      } catch (error: any) {
        setApiError(error.message || "Failed to process Google authentication. Please try again.");
        setTimeout(() => setApiError(""), 8000);
        setSocialAuthLoading(false);
      }
    },
    onError: (error) => {
      console.error("Error Loggin In with Google: " + error);
      setApiError("Google authentication failed. Please try again.");
      setSocialAuthLoading(false);
      setTimeout(() => setApiError(""), 8000);
    },
    onNonOAuthError: () => {
      setApiError("Google authentication failed. Please try again.");
      setSocialAuthLoading(false);
      setTimeout(() => setApiError(""), 8000);
    }
  });

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
    <div className="min-h-screen w-full px-0 sm:px-5 md:px-10 lg:px-20 py-20 grid grid-flow-col lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-3">
      {/* Abstract Image and Quote Section - LEFT SIDE */}
      <div className="p-7 lg:block md:hidden sm:hidden hidden relative w-full overflow-hidden">
        <div className="grayscale hover:grayscale-0 transition-all duration-500 relative rounded-4xl min-h-[100vh] w-full overflow-hidden">
          <img
            src={img}
            className="h-full w-full object-cover object-center"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6">
                <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>

              <h1 className="font-extralight text-white text-4xl xl:text-5xl mb-6">Welcome Back to Your Journey</h1>

              <p className="text-white/90 text-lg xl:text-xl font-medium leading-relaxed mb-6">
                Continue your path to mastery. Every login is a step forward in your learning adventure.
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                <small className="text-white/70 text-sm font-medium">Your growth never stops</small>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-xl"></div>
          </div>

          <div className="absolute top-8 right-8 w-20 h-20 border-2 border-white/20 rounded-2xl rotate-12"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-xl rotate-45"></div>
        </div>
      </div>

      {/* Login Form Section - RIGHT SIDE */}
      <div className="p-10">
        <div className="py-3">
          <Logo logoOnly />
        </div>
        <h1 className="font-bold text-5xl">Welcome Back</h1>
        <p className="font-light pt-2">Enter your credentials to access your account and features!</p>

        {/* API Error/Success Messages */}
        {apiError && (
          <Alert className="mt-4 border-red-200 bg-red-50 p-4 rounded-xl">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">{apiError}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mt-4 border-green-200 bg-green-50 p-4 rounded-xl">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Social Login */}
        <div className="py-6">
          <div className="grid grid-cols-1 gap-4 w-full">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              disabled={isLoading || socialAuthLoading}
              className={`w-full cursor-pointer flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50 ${isLoading || socialAuthLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {socialAuthLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-600">Or continue with email</span>
          </div>
        </div>

        {/* Login Form */}
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
                className={`w-full pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.email ? "border-red-500 focus:border-red-500" : ""
                  } ${touched.email && !errors.email && formData.email ? "border-green-500 focus:border-green-500" : ""
                  } ${isLoading || socialAuthLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                autoComplete="email"
              />
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
                className={`w-full pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.password ? "border-red-500 focus:border-red-500" : ""
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
                className="border-gray-400 w-5 h-5 rounded accent-indigo-500"
              />
              <Label htmlFor="remember" className="text-gray-600 text-base cursor-pointer">
                Remember me
              </Label>
            </div>
            <a
              href="/forget-password"
              className="text-indigo-600 hover:text-indigo-700 text-base font-medium transition-colors hover:underline"
            >
              Forgot password?
            </a>
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

          {/* Sign Up Link */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-base">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
