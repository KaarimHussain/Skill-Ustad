"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Loader2, KeyRound } from "lucide-react"

// Password strength calculation
const calculatePasswordStrength = (password: string) => {
    const requirements = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    const score = Object.values(requirements).filter(Boolean).length
    let strength: "weak" | "fair" | "good" | "strong" = "weak"
    let color = "bg-red-500"
    let width = "20%"

    if (score >= 5) {
        strength = "strong"
        color = "bg-green-500"
        width = "100%"
    } else if (score >= 4) {
        strength = "good"
        color = "bg-blue-500"
        width = "75%"
    } else if (score >= 3) {
        strength = "fair"
        color = "bg-yellow-500"
        width = "50%"
    } else if (score >= 1) {
        strength = "weak"
        color = "bg-red-500"
        width = "25%"
    }

    return { requirements, score, strength, color, width }
}

// Individual requirement item component
const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div
        className={`flex items-center gap-2 text-xs transition-colors duration-200 ${met ? "text-green-600" : "text-gray-500"
            }`}
    >
        <div
            className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${met ? "bg-green-100" : "bg-gray-100"
                }`}
        >
            {met ? <CheckCircle className="w-3 h-3 text-green-600" /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
        </div>
        <span className={met ? "line-through" : ""}>{text}</span>
    </div>
)

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    if (!password) return null

    const { requirements, strength, color, width } = calculatePasswordStrength(password)

    const strengthLabels = {
        weak: "Weak",
        fair: "Fair",
        good: "Good",
        strong: "Strong",
    }

    const strengthColors = {
        weak: "text-red-600",
        fair: "text-yellow-600",
        good: "text-blue-600",
        strong: "text-green-600",
    }

    return (
        <div className="mt-3 space-y-3">
            {/* Strength Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Password strength</span>
                    <span className={`text-sm font-medium ${strengthColors[strength]}`}>{strengthLabels[strength]}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${color}`} style={{ width }} />
                </div>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-2">
                <span className="text-sm text-gray-600 font-medium">Password must contain:</span>
                <div className="grid grid-cols-1 gap-1">
                    <RequirementItem met={requirements.length} text="At least 8 characters" />
                    <RequirementItem met={requirements.lowercase} text="One lowercase letter (a-z)" />
                    <RequirementItem met={requirements.uppercase} text="One uppercase letter (A-Z)" />
                    <RequirementItem met={requirements.number} text="One number (0-9)" />
                    <RequirementItem met={requirements.special} text="One special character (!@#$%^&*)" />
                </div>
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

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [touched, setTouched] = useState({
        newPassword: false,
        confirmPassword: false,
    })

    // Password strength calculation
    const passwordStrength = calculatePasswordStrength(newPassword)

    // Validation
    const validatePassword = (password: string): string => {
        if (!password) return "Password is required"
        if (password.length < 8) return "Password must be at least 8 characters long"
        if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter"
        if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter"
        if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number"
        return ""
    }

    const validateConfirmPassword = (password: string, confirmPassword: string): string => {
        if (!confirmPassword) return "Please confirm your password"
        if (password !== confirmPassword) return "Passwords do not match"
        return ""
    }

    const errors = {
        newPassword: touched.newPassword ? validatePassword(newPassword) : "",
        confirmPassword: touched.confirmPassword ? validateConfirmPassword(newPassword, confirmPassword) : "",
    }

    const isFormValid =
        !errors.newPassword &&
        !errors.confirmPassword &&
        newPassword &&
        confirmPassword &&
        passwordStrength.strength !== "weak"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({ newPassword: true, confirmPassword: true })

        if (!isFormValid) {
            setMessage("Please fix all validation errors before submitting.")
            return
        }

        setLoading(true)
        setMessage("")

        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/forget-password/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            })

            const data = await res.json()

            if (res.ok) {
                setMessage("Password reset successful! You can now login with your new password.")
            } else {
                setMessage(data.message || "Password reset failed. Please try again.")
            }
        } catch (err) {
            setMessage("Something went wrong. Please try again.")
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-50/30 to-white flex items-center justify-center px-4 py-25">
            <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                        <KeyRound className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
                    <p className="text-gray-600">Enter your new password below</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Alert Messages */}
                    {message && (
                        <Alert
                            className={`${message.includes("successful") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                        >
                            {message.includes("successful") ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <AlertDescription className={message.includes("successful") ? "text-green-600" : "text-red-600"}>
                                {message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password Field */}
                        <div className="space-y-3">
                            <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                                New Password
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
                                    disabled={loading}
                                    className={`pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.newPassword ? "border-red-500 focus:border-red-500" : ""
                                        } ${touched.newPassword && !errors.newPassword && newPassword
                                            ? "border-green-500 focus:border-green-500"
                                            : ""
                                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.newPassword && <ErrorMessage message={errors.newPassword} />}
                            {touched.newPassword && !errors.newPassword && newPassword && passwordStrength.strength === "strong" && (
                                <SuccessMessage message="Password is strong!" />
                            )}
                            {/* Password Strength Indicator */}
                            {(touched.newPassword || newPassword) && <PasswordStrengthIndicator password={newPassword} />}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-3">
                            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                Confirm New Password
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                                    disabled={loading}
                                    className={`pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                                        } ${touched.confirmPassword && !errors.confirmPassword && confirmPassword
                                            ? "border-green-500 focus:border-green-500"
                                            : ""
                                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {/* Success/Error Icon */}
                                {touched.confirmPassword && confirmPassword && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                        {errors.confirmPassword ? (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
                            {touched.confirmPassword && !errors.confirmPassword && confirmPassword && (
                                <SuccessMessage message="Passwords match!" />
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Resetting Password...
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>

                        {/* Form Validation Summary */}
                        {(touched.newPassword || touched.confirmPassword) && !isFormValid && !loading && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>Please fix the errors above to continue</span>
                                </div>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
