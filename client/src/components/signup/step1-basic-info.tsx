"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Github, Chrome } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage, SuccessMessage, PasswordRequirements } from "./ui-components"
import type { FormData, TouchedFields, ValidationErrors, PasswordValidation } from "@/types/signup"

interface Step1Props {
    formData: FormData
    touched: TouchedFields
    errors: ValidationErrors
    passwordValidation: PasswordValidation
    onInputChange: (field: string, value: string | boolean) => void
    onBlur: (field: string) => void
    onSocialSignup: (provider: string) => void
}

export const Step1BasicInfo = ({
    formData,
    touched,
    errors,
    passwordValidation,
    onInputChange,
    onBlur,
    onSocialSignup,
}: Step1Props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="space-y-8 animate-in slide-in-from-right-5 duration-500">
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
                        onChange={(e) => onInputChange("name", e.target.value)}
                        onBlur={() => onBlur("name")}
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
                        onChange={(e) => onInputChange("email", e.target.value)}
                        onBlur={() => onBlur("email")}
                        className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.email ? "border-red-500 focus:border-red-500" : ""
                            } ${touched.email && !errors.email && formData.email ? "border-green-500 focus:border-green-500" : ""}`}
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
                        onChange={(e) => onInputChange("password", e.target.value)}
                        onBlur={() => onBlur("password")}
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
                        onChange={(e) => onInputChange("confirmPassword", e.target.value)}
                        onBlur={() => onBlur("confirmPassword")}
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
                        onCheckedChange={(checked) => onInputChange("acceptTerms", !!checked)}
                        className="border-gray-400 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 w-5 h-5 mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-gray-600 text-base cursor-pointer leading-relaxed">
                        I agree to the{" "}
                        <button type="button" className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                            Terms of Service
                        </button>{" "}
                        and{" "}
                        <button type="button" className="text-indigo-600 hover:text-indigo-700 transition-colors hover:underline">
                            Privacy Policy
                        </button>
                    </Label>
                </div>
                <div className="flex items-start space-x-3">
                    <Checkbox
                        id="marketing"
                        checked={formData.acceptMarketing}
                        onCheckedChange={(checked) => onInputChange("acceptMarketing", !!checked)}
                        className="border-gray-400 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 w-5 h-5 mt-0.5"
                    />
                    <Label htmlFor="marketing" className="text-gray-600 text-base cursor-pointer leading-relaxed">
                        I'd like to receive updates about new courses and features
                    </Label>
                </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-4">
                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/70 text-gray-600 backdrop-blur-sm">Or sign up with</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => onSocialSignup("GitHub")}
                        className="flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50"
                    >
                        <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">GitHub</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSocialSignup("Google")}
                        className="flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50"
                    >
                        <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Google</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
