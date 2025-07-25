"use client"
import type React from "react"
import { useState, useCallback } from "react"
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { memo } from "react"
import { Link } from "react-router-dom"

// Background elements matching the login page design
const ForgetPasswordBackground = memo(() => (
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

// Validation function for email
const validateEmail = (email: string): string => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
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

export default function ForgetPassword() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)
    const [touched, setTouched] = useState(false)

    // Validation state
    const emailError = touched ? validateEmail(email) : ""
    const isFormValid = !emailError && email

    const handleInputChange = useCallback((value: string) => {
        setEmail(value)
    }, [])

    const handleBlur = useCallback(() => {
        setTouched(true)
    }, [])

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            // Mark field as touched to show validation errors
            setTouched(true)

            // Check if form is valid
            if (!isFormValid) {
                return
            }

            setIsLoading(true)
            try {
                // Simulate API call for password recovery
                await new Promise((resolve) => setTimeout(resolve, 2000))
                console.log("Password recovery email sent to:", email)
                setIsEmailSent(true)
                // Handle successful email sending here
            } catch (error) {
                console.error("Failed to send recovery email:", error)
                // Handle error here
            } finally {
                setIsLoading(false)
            }
        },
        [email, isFormValid],
    )

    const handleResendEmail = useCallback(async () => {
        setIsLoading(true)
        try {
            // Simulate API call for resending email
            await new Promise((resolve) => setTimeout(resolve, 1500))
            console.log("Recovery email resent to:", email)
            // Handle successful resend here
        } catch (error) {
            console.error("Failed to resend recovery email:", error)
            // Handle error here
        } finally {
            setIsLoading(false)
        }
    }, [email])

    const resetForm = useCallback(() => {
        setIsEmailSent(false)
        setEmail("")
        setTouched(false)
    }, [])

    return (
        <section className="min-h-[100vh] pt-32 pb-10 w-full flex items-center justify-center p-4 relative overflow-hidden">
            <ForgetPasswordBackground />

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
                        {!isEmailSent ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Mail className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <h2 className="text-4xl text-gray-900 font-bold mb-3">Forgot Password?</h2>
                                    <p className="text-gray-600 text-base">
                                        No worries! Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
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
                                                value={email}
                                                onChange={(e) => handleInputChange(e.target.value)}
                                                onBlur={handleBlur}
                                                className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${emailError ? "border-red-500 focus:border-red-500" : ""
                                                    } ${touched && !emailError && email ? "border-green-500 focus:border-green-500" : ""}`}
                                                autoComplete="email"
                                            />
                                            {/* Success/Error Icon */}
                                            {touched && email && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    {emailError ? (
                                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {emailError && <ErrorMessage message={emailError} />}
                                        {touched && !emailError && email && <SuccessMessage message="Email looks good!" />}
                                    </div>

                                    {/* Send Recovery Email Button */}
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !isFormValid}
                                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending recovery email...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                <Send className="w-5 h-5" />
                                                Send Recovery Email
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                    </Button>

                                    {/* Form Validation Summary */}
                                    {touched && !isFormValid && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <span>Please enter a valid email address to continue</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Back to Login Link */}
                                    <div className="text-center pt-6 border-t border-gray-200">
                                        <Link
                                            to="/login"
                                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline text-base"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                {/* Success State */}
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-4xl text-gray-900 font-bold mb-3">Check Your Email</h2>
                                    <p className="text-gray-600 text-base mb-8">
                                        We've sent a password recovery link to <span className="font-medium text-gray-900">{email}</span>
                                    </p>

                                    <div className="space-y-4">
                                        {/* Resend Email Button */}
                                        <Button
                                            onClick={handleResendEmail}
                                            disabled={isLoading}
                                            variant="outline"
                                            className="w-full py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 h-14 border-gray-300 hover:border-gray-400 bg-white/60 hover:bg-white/80 backdrop-blur-sm"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
                                                    Resending...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-3">
                                                    <Send className="w-5 h-5" />
                                                    Resend Email
                                                </div>
                                            )}
                                        </Button>

                                        {/* Try Different Email Button */}
                                        <Button
                                            onClick={resetForm}
                                            variant="ghost"
                                            className="w-full py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] h-14 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                                        >
                                            Try a different email address
                                        </Button>
                                    </div>

                                    {/* Instructions */}
                                    <div className="mt-8 p-4 bg-blue-50/50 border border-blue-200/50 rounded-xl backdrop-blur-sm">
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-900">Didn't receive the email?</strong>
                                            <br />
                                            Check your spam folder or try resending the email. The link will expire in 24 hours.
                                        </p>
                                    </div>

                                    {/* Back to Login Link */}
                                    <div className="text-center pt-6 border-t border-gray-200 mt-8">
                                        <Link
                                            to="/login"
                                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline text-base"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        Need help?{" "}
                        <button className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                            Contact Support
                        </button>
                    </p>
                </div>
            </div>
        </section>
    )
}
