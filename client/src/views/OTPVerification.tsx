"use client"
import { useState, useCallback, useEffect } from "react"
import { ArrowRight, ArrowLeft, Mail, Shield, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Link } from "react-router-dom"
import { memo } from "react"

// Background elements with light theme
const OTPBackground = memo(() => (
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

// Success background for light theme
const SuccessBackground = memo(() => (
    <>
        {/* Light success background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-gray-50" />

        {/* Success pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
            <div
                className="h-full w-full"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px, 30px 30px, 15px 15px, 15px 15px",
                    backgroundPosition: "0 0, 25px 25px, 0 0, 0 0",
                }}
            />
        </div>

        {/* Success floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-100/30 to-emerald-100/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-100/25 to-green-100/15 rounded-full blur-3xl animate-pulse" />

        {/* Success decorative elements */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-green-300 rounded-full opacity-40 animate-pulse" />
        <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-emerald-400 rounded-full opacity-30 animate-pulse" />
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-green-300 rounded-full opacity-35 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-25 animate-pulse" />
    </>
))

export default function OTPVerification() {
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [error, setError] = useState("")
    const [isVerified, setIsVerified] = useState(false)
    const [email] = useState("john.doe@example.com") // This would come from props or context

    // Countdown timer for resend functionality
    useEffect(() => {
        if (timeLeft > 0 && !canResend) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0) {
            setCanResend(true)
        }
    }, [timeLeft, canResend])

    // Auto-submit when OTP is complete
    useEffect(() => {
        if (otp.length === 6) {
            handleVerifyOTP()
        }
    }, [otp])

    const handleVerifyOTP = useCallback(async () => {
        if (otp.length !== 6) return

        setIsLoading(true)
        setError("")

        try {
            // Simulate API call
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate success/failure
                    if (otp === "123456") {
                        setIsVerified(true)
                        resolve(true)
                    } else {
                        reject(new Error("Invalid OTP code"))
                    }
                }, 1500)
            })
            console.log("OTP verified successfully:", otp)
            // Handle successful verification here
        } catch (error) {
            setError("Invalid verification code. Please try again.")
            setOtp("") // Clear the OTP input
            console.error("OTP verification failed:", error)
        } finally {
            setIsLoading(false)
        }
    }, [otp])

    const handleResendOTP = useCallback(async () => {
        setIsResending(true)
        setError("")

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            // Reset timer
            setTimeLeft(60)
            setCanResend(false)
            console.log("OTP resent to:", email)
        } catch (error) {
            setError("Failed to resend code. Please try again.")
            console.error("Resend OTP failed:", error)
        } finally {
            setIsResending(false)
        }
    }, [email])

    const handleOTPChange = useCallback(
        (value: string) => {
            setOtp(value)
            if (error) setError("") // Clear error when user starts typing
        },
        [error],
    )

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // Success state
    if (isVerified) {
        return (
            <section className="min-h-[100vh] w-full flex items-center justify-center p-4 relative overflow-hidden">
                <SuccessBackground />

                {/* Success Content */}
                <div className="relative z-10 w-full max-w-md mx-auto text-center">
                    <div
                        className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-10 shadow-2xl hover:shadow-green-100/50 transition-all duration-300"
                        style={{
                            boxShadow: "0 25px 50px rgba(34, 197, 94, 0.15)",
                        }}
                    >
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/20 rounded-2xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-bounce shadow-lg">
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl text-gray-900 font-bold mb-4">Verification Successful!</h2>
                            <p className="text-gray-600 text-base mb-8 leading-relaxed">
                                Your email has been verified successfully. You can now access your account and start learning.
                            </p>
                            <Button
                                asChild
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] group h-14 shadow-lg hover:shadow-xl hover:shadow-green-200/50"
                            >
                                <Link to="/dashboard">
                                    <div className="flex items-center justify-center gap-3">
                                        Continue to Dashboard
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-[100vh] pt-32 pb-10 w-full flex items-center justify-center p-4 relative overflow-hidden">
            <OTPBackground />

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
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-4xl text-gray-900 font-bold mb-3">Verify Your Email</h2>
                            <p className="text-gray-600 text-base leading-relaxed">We've sent a 6-digit verification code to</p>
                            <div className="flex items-center justify-center gap-2 mt-2 p-3 bg-white/60 rounded-lg border border-gray-200/60 backdrop-blur-sm">
                                <Mail className="w-4 h-4 text-indigo-600" />
                                <span className="text-indigo-700 font-medium">{email}</span>
                            </div>
                        </div>

                        {/* OTP Input */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={otp} onChange={handleOTPChange} disabled={isLoading} className="gap-3">
                                        <InputOTPGroup className="gap-3">
                                            <InputOTPSlot
                                                index={0}
                                                className="w-14 h-14 text-xl font-bold bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/70"
                                            />
                                            <InputOTPSlot
                                                index={1}
                                                className="w-14 h-14 text-xl font-bold bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/70"
                                            />
                                            <InputOTPSlot
                                                index={2}
                                                className="w-14 h-14 text-xl font-bold bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/70"
                                            />
                                        </InputOTPGroup>
                                        <InputOTPGroup className="gap-3">
                                            <InputOTPSlot
                                                index={3}
                                                className="w-14 h-14 text-xl font-bold bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/70"
                                            />
                                            <InputOTPSlot
                                                index={4}
                                                className="w-14 h-14 text-xl font-bold bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/70"
                                            />
                                            <InputOTPSlot
                                                index={5}
                                                className="w-14 h-14 text-xl font-bold bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/70"
                                            />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                {/* Loading State */}
                                {isLoading && (
                                    <div className="flex items-center justify-center gap-2 text-indigo-600 text-sm">
                                        <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                        <span>Verifying code...</span>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center justify-center gap-2 text-red-600 text-sm animate-in slide-in-from-top-2 duration-200">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Instructions */}
                                <p className="text-center text-gray-500 text-sm">Enter the 6-digit code sent to your email</p>
                            </div>

                            {/* Resend Section */}
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center gap-4 text-sm">
                                    {!canResend ? (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <span>Resend code in</span>
                                            <span className="font-mono text-indigo-600 font-medium">{formatTime(timeLeft)}</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleResendOTP}
                                            disabled={isResending}
                                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isResending ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-4 h-4" />
                                                    Resend Code
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Manual Verify Button (if needed) */}
                                {otp.length === 6 && !isLoading && (
                                    <Button
                                        onClick={handleVerifyOTP}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] group h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50"
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            Verify Code
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Button>
                                )}
                            </div>

                            {/* Back to Login */}
                            <div className="text-center pt-6 border-t border-gray-200">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors hover:underline"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        Didn't receive the email? Check your spam folder or{" "}
                        <button
                            onClick={handleResendOTP}
                            disabled={!canResend || isResending}
                            className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            request a new code
                        </button>
                    </p>
                </div>

                {/* Debug Info (remove in production) */}
                <div className="text-center mt-4 p-3 bg-white/60 rounded-lg border border-gray-200/60 backdrop-blur-sm">
                    <p className="text-gray-600 text-xs">
                        <strong>Demo:</strong> Use code <span className="font-mono text-indigo-600 font-medium">123456</span> to
                        verify
                    </p>
                </div>
            </div>
        </section>
    )
}
