"use client"
import type React from "react"
import { useState, useCallback } from "react"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,
    Github,
    Chrome,
    AlertCircle,
    CheckCircle,
    Check,
    X,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { memo } from "react"

// Background elements with reduced brightness and added visual interest
const SignupBackground = memo(() => (
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
const validateName = (name: string): string => {
    if (!name) return "Full name is required"
    if (name.length < 2) return "Name must be at least 2 characters long"
    if (name.length > 50) return "Name must be less than 50 characters"
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces"
    return ""
}

const validateEmail = (email: string): string => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
}

const validatePassword = (password: string): { isValid: boolean; message: string; requirements: any } => {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    const isValid = Object.values(requirements).every(Boolean)

    if (!password) return { isValid: false, message: "Password is required", requirements }
    if (!isValid) return { isValid: false, message: "Password doesn't meet all requirements", requirements }

    return { isValid: true, message: "Password is strong!", requirements }
}

const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return ""
}

// Password requirements component
const PasswordRequirements = ({ requirements, password }: { requirements: any; password: string }) => {
    const requirementsList = [
        { key: "length", text: "At least 8 characters" },
        { key: "uppercase", text: "One uppercase letter" },
        { key: "lowercase", text: "One lowercase letter" },
        { key: "number", text: "One number" },
        { key: "special", text: "One special character" },
    ]

    if (!password) return null

    return (
        <div className="mt-3 p-4 bg-gray-100/60 rounded-lg border border-gray-200/60 backdrop-blur-sm">
            <p className="text-gray-700 text-sm font-medium mb-3">Password Requirements:</p>
            <div className="space-y-2">
                {requirementsList.map((req) => (
                    <div key={req.key} className="flex items-center gap-2 text-sm">
                        {requirements[req.key] ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={requirements[req.key] ? "text-green-600" : "text-gray-500"}>{req.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
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

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    })
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        acceptMarketing: false,
    })

    // Validation state
    const nameError = touched.name ? validateName(formData.name) : ""
    const emailError = touched.email ? validateEmail(formData.email) : ""
    const passwordValidation = validatePassword(formData.password)
    const passwordError = touched.password && !passwordValidation.isValid ? passwordValidation.message : ""
    const confirmPasswordError = touched.confirmPassword
        ? validateConfirmPassword(formData.password, formData.confirmPassword)
        : ""

    const errors = {
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
    }

    const isFormValid =
        !errors.name &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword &&
        formData.name &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.acceptTerms &&
        passwordValidation.isValid

    const handleInputChange = useCallback((field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleBlur = useCallback((field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
    }, [])

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            // Mark all fields as touched to show validation errors
            setTouched({ name: true, email: true, password: true, confirmPassword: true })

            // Check if form is valid
            if (!isFormValid) {
                return
            }

            setIsLoading(true)
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 2500))
                console.log("Signup submitted:", formData)
                // Handle successful signup here
            } catch (error) {
                console.error("Signup failed:", error)
                // Handle signup error here
            } finally {
                setIsLoading(false)
            }
        },
        [formData, isFormValid],
    )

    const handleSocialSignup = useCallback((provider: string) => {
        console.log(`Sign up with ${provider}`)
    }, [])

    return (
        <section className="min-h-[100vh] pt-32 pb-10 w-full flex items-center justify-center p-4 relative overflow-hidden">
            <SignupBackground />

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
                            <h2 className="text-4xl text-gray-900 font-bold mb-3">Create Account</h2>
                            <p className="text-gray-600 text-base">Start your learning journey today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Name Field */}
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-gray-700 font-medium text-base">
                                    Full Name
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                        <User className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        onBlur={() => handleBlur("name")}
                                        className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.name ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.name && !errors.name && formData.name ? "border-green-500 focus:border-green-500" : ""}`}
                                        autoComplete="name"
                                    />
                                    {/* Success/Error Icon */}
                                    {touched.name && formData.name && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {errors.name ? (
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.name && <ErrorMessage message={errors.name} />}
                                {touched.name && !errors.name && formData.name && <SuccessMessage message="Name looks good!" />}
                            </div>

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
                                        className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.email ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.email && !errors.email && formData.email ? "border-green-500 focus:border-green-500" : ""
                                            }`}
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
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        onBlur={() => handleBlur("password")}
                                        className={`pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.password ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.password && !errors.password && formData.password && passwordValidation.isValid
                                                ? "border-green-500 focus:border-green-500"
                                                : ""
                                            }`}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <ErrorMessage message={errors.password} />}
                                {touched.password && !errors.password && formData.password && passwordValidation.isValid && (
                                    <SuccessMessage message="Password is strong!" />
                                )}
                                <PasswordRequirements requirements={passwordValidation.requirements} password={formData.password} />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-3">
                                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-base">
                                    Confirm Password
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                        <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        onBlur={() => handleBlur("confirmPassword")}
                                        className={`pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword
                                                ? "border-green-500 focus:border-green-500"
                                                : ""
                                            }`}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
                                {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                                    <SuccessMessage message="Passwords match!" />
                                )}
                            </div>

                            {/* Terms and Marketing */}
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={formData.acceptTerms}
                                        onCheckedChange={(checked) => handleInputChange("acceptTerms", !!checked)}
                                        className="border-gray-400 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 w-5 h-5 mt-0.5"
                                    />
                                    <Label htmlFor="terms" className="text-gray-600 text-base cursor-pointer leading-relaxed">
                                        I agree to the{" "}
                                        <button
                                            type="button"
                                            className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline"
                                        >
                                            Terms of Service
                                        </button>{" "}
                                        and{" "}
                                        <button
                                            type="button"
                                            className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline"
                                        >
                                            Privacy Policy
                                        </button>
                                    </Label>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="marketing"
                                        checked={formData.acceptMarketing}
                                        onCheckedChange={(checked) => handleInputChange("acceptMarketing", !!checked)}
                                        className="border-gray-400 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 w-5 h-5 mt-0.5"
                                    />
                                    <Label htmlFor="marketing" className="text-gray-600 text-base cursor-pointer leading-relaxed">
                                        I'd like to receive updates about new courses and features
                                    </Label>
                                </div>
                            </div>

                            {/* Signup Button */}
                            <Button
                                type="submit"
                                disabled={isLoading || !isFormValid}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        Create Account
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>

                            {/* Form Validation Summary */}
                            {Object.values(touched).some(Boolean) && !isFormValid && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>Please complete all required fields and fix any errors</span>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/70 text-gray-600 backdrop-blur-sm">Or sign up with</span>
                                </div>
                            </div>

                            {/* Social Signup Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignup("GitHub")}
                                    className="flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50"
                                >
                                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">GitHub</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignup("Google")}
                                    className="flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50"
                                >
                                    <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Google</span>
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center pt-6 border-t border-gray-200">
                                <p className="text-gray-600 text-base">
                                    Already have an account?{" "}
                                    <button className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline">
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        By creating an account, you agree to our{" "}
                        <button className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                            Terms of Service
                        </button>{" "}
                        and{" "}
                        <button className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                            Privacy Policy
                        </button>
                    </p>
                </div>
            </div>
        </section>
    )
}
