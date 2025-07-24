import img from "@/assets/img/Signup-Form-Background.png";
import Logo from "@/assets/Logos/Light.png";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, CheckCircle, Chrome, Github, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
// Google OAuth Imports
import { useGoogleLogin } from '@react-oauth/google';

// Validation functions
const validateFullname = (fullname: string): string => {
    if (!fullname) return "Full name is required"
    if (fullname.length < 2) return "Full name must be at least 2 characters long"
    if (fullname.length > 50) return "Full name must be less than 50 characters"
    return ""
}

const validateEmail = (email: string): string => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
}

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
    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
    let color = 'bg-red-500'
    let width = '20%'

    if (score >= 5) {
        strength = 'strong'
        color = 'bg-green-500'
        width = '100%'
    } else if (score >= 4) {
        strength = 'good'
        color = 'bg-blue-500'
        width = '75%'
    } else if (score >= 3) {
        strength = 'fair'
        color = 'bg-yellow-500'
        width = '50%'
    } else if (score >= 1) {
        strength = 'weak'
        color = 'bg-red-500'
        width = '25%'
    }

    return { requirements, score, strength, color, width }
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

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    if (!password) return null

    const { requirements, strength, color, width } = calculatePasswordStrength(password)

    const strengthLabels = {
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong'
    }

    const strengthColors = {
        weak: 'text-red-600',
        fair: 'text-yellow-600',
        good: 'text-blue-600',
        strong: 'text-green-600'
    }

    return (
        <div className="mt-3 space-y-3">
            {/* Strength Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Password strength</span>
                    <span className={`text-sm font-medium ${strengthColors[strength]}`}>
                        {strengthLabels[strength]}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${color}`}
                        style={{ width }}
                    />
                </div>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-2">
                <span className="text-sm text-gray-600 font-medium">Password must contain:</span>
                <div className="grid grid-cols-1 gap-1">
                    <RequirementItem
                        met={requirements.length}
                        text="At least 8 characters"
                    />
                    <RequirementItem
                        met={requirements.lowercase}
                        text="One lowercase letter (a-z)"
                    />
                    <RequirementItem
                        met={requirements.uppercase}
                        text="One uppercase letter (A-Z)"
                    />
                    <RequirementItem
                        met={requirements.number}
                        text="One number (0-9)"
                    />
                    <RequirementItem
                        met={requirements.special}
                        text="One special character (!@#$%^&*)"
                    />
                </div>
            </div>
        </div>
    )
}

// Individual requirement item component
const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-200 ${met ? 'text-green-600' : 'text-gray-500'
        }`}>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${met ? 'bg-green-100' : 'bg-gray-100'
            }`}>
            {met ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
                <div className="w-2 h-2 rounded-full bg-gray-400" />
            )}
        </div>
        <span className={met ? 'line-through' : ''}>{text}</span>
    </div>
)

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [touched, setTouched] = useState({
        fullname: false,
        email: false,
        password: false,
        confirmPassword: false,
    })

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
        agreeToTerms: false
    })
    //  Social Auth Signup State Management
    const [socialAuthLoading, setSocialAuthLoading] = useState(false);

    // Password strength calculation
    const passwordStrength = calculatePasswordStrength(formData.password)

    // Validation state
    const errors = {
        fullname: touched.fullname ? validateFullname(formData.fullname) : "",
        email: touched.email ? validateEmail(formData.email) : "",
        password: touched.password ? validatePassword(formData.password) : "",
        confirmPassword: touched.confirmPassword ? validateConfirmPassword(formData.password, formData.confirmPassword) : "",
    }

    const isFormValid = !errors.fullname && !errors.email && !errors.password && !errors.confirmPassword &&
        formData.fullname && formData.email && formData.password && formData.confirmPassword &&
        passwordStrength.strength !== 'weak'

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleBlur = useCallback((field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
    }, [])

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            // Mark all fields as touched to show validation errors
            setTouched({ fullname: true, email: true, password: true, confirmPassword: true })

            // Check if form is valid
            if (!isFormValid) {
                return
            }

            setIsLoading(true)
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 2000))
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

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.table(tokenResponse);
            try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const profile = await res.json();
                console.log("👤 Google User Info:", profile);

            } catch (error) {
                console.error("Failed to fetch user info", error);
            }
            setSocialAuthLoading(false);
        },
        onError: (error) => {
            console.error("Google Login Failed", error);
            setSocialAuthLoading(false);
        },
    });

    const handleSocialLogin = useCallback((provider: string) => {
        if (provider == "GitHub") {
            setSocialAuthLoading(true);
            return;
        } else if (provider == "Google") {
            setSocialAuthLoading(true);
            googleLogin();
        } else {
            setSocialAuthLoading(false);
        }
    }, [googleLogin])

    return (
        <>
            <div className="min-h-screen w-full lg:px-20 md:px-15 sm:px-10 px-5 py-20 grid grid-flow-col lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-3">
                <div className="p-10">
                    <div className="py-3">
                        <img src={Logo} className="h-15 w-15 aspect-square object-cover" alt="Logo" />
                    </div>
                    <h1 className="font-bold text-5xl">Get Started</h1>
                    <p className="font-light pt-2">Enter your credentials to access your account and features!</p>
                    {/* Social Logins */}
                    <div className="flex gap-2 py-4 items-center justify-start">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <button
                                disabled={socialAuthLoading}
                                type="button"
                                onClick={() => handleSocialLogin("GitHub")}
                                className="w-full cursor-pointer flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50 text-sm sm:text-base"
                            >
                                <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">GitHub</span>
                            </button>
                            <button
                                disabled={socialAuthLoading}
                                type="button"
                                onClick={() => handleSocialLogin("Google")}
                                className="w-full cursor-pointer flex items-center justify-center gap-3 py-4 px-4 bg-white/60 hover:bg-white/80 border border-gray-300 hover:border-gray-400 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm group h-14 hover:shadow-lg hover:shadow-gray-200/50 text-sm sm:text-base"
                            >
                                <Chrome className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Google</span>
                            </button>
                        </div>
                    </div>
                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/70 text-gray-600 backdrop-blur-sm">Or continue with</span>
                        </div>
                    </div>
                    {/* Form Field */}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Full Name Field */}
                        <div className="space-y-3">
                            <Label htmlFor="fullname" className="text-gray-700 font-medium text-base">
                                Full Name
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                    <User className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <Input
                                    id="fullname"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.fullname}
                                    onChange={(e) => handleInputChange("fullname", e.target.value)}
                                    onBlur={() => handleBlur("fullname")}
                                    className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.fullname ? "border-red-500 focus:border-red-500" : ""
                                        } ${touched.fullname && !errors.fullname && formData.fullname ? "border-green-500 focus:border-green-500" : ""
                                        }`}
                                    autoComplete="name"
                                />
                                {/* Success/Error Icon */}
                                {touched.fullname && formData.fullname && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {errors.fullname ? (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.fullname && <ErrorMessage message={errors.fullname} />}
                            {touched.fullname && !errors.fullname && formData.fullname && <SuccessMessage message="Name looks good!" />}
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
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    onBlur={() => handleBlur("password")}
                                    className={`pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.password ? "border-red-500 focus:border-red-500" : ""
                                        } ${touched.password && !errors.password && formData.password
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
                            {touched.password && !errors.password && formData.password && passwordStrength.strength === 'strong' && (
                                <SuccessMessage message="Password is strong!" />
                            )}
                            {/* Password Strength Indicator */}
                            {(touched.password || formData.password) && (
                                <PasswordStrengthIndicator password={formData.password} />
                            )}
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
                                {/* Success/Error Icon */}
                                {touched.confirmPassword && formData.confirmPassword && (
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
                            {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                                <SuccessMessage message="Passwords match!" />
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="terms"
                                checked={formData.agreeToTerms}
                                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: !!checked }))}
                                className="border-gray-400 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 w-5 h-5 mt-0.5"
                            />
                            <Label htmlFor="terms" className="text-gray-600 cursor-pointer leading-relaxed text-sm text-nowrap">
                                I agree to the{" "}
                                <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline text-nowrap">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline text-nowrap">
                                    Privacy Policy
                                </Link>
                            </Label>
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
                        {(touched.fullname || touched.email || touched.password || touched.confirmPassword) && !isFormValid && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>Please fix the errors above to continue</span>
                                </div>
                            </div>
                        )}
                        {/* Sign In Link */}
                        <div className="text-center pt-6 border-t border-gray-200">
                            <p className="text-gray-600 text-base">
                                Already have an account?{" "}
                                <Link to={"/login"} className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
                {/* Abstract Image and Quote Section */}
                <div className="p-7 lg:block md:hidden sm:hidden hidden relative w-full overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="grayscale hover:grayscale-0 transition-all duration-500 relative rounded-4xl h-[100vh] w-full overflow-hidden">
                        <img
                            src={img}
                            className="h-full w-full object-cover object-center"
                            alt="Background Image"
                        />
                        {/* Gradient Overlay for Better Text Contrast */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>

                        {/* Quote Container with Improved Design */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-8">
                            {/* Main Quote Card */}
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                                {/* Decorative Quote Mark */}
                                <div className="mb-6">
                                    <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                                    </svg>
                                </div>

                                {/* Main Quote */}
                                <h1 className="font-extralight text-white text-4xl xl:text-5xl mb-6">
                                    Your Skills, Your Future.
                                </h1>

                                {/* Supporting Text */}
                                <p className="text-white/90 text-lg xl:text-xl font-medium leading-relaxed mb-6">
                                    The future belongs to those who learn more skills and combine them in creative ways.
                                </p>

                                {/* Attribution */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                                    <small className="text-white/70 text-sm font-medium">
                                        Robert Greene, Author of Mastery
                                    </small>
                                </div>
                            </div>

                            {/* Floating Elements for Visual Interest */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-xl"></div>
                        </div>

                        {/* Corner Accent Elements */}
                        <div className="absolute top-8 right-8 w-20 h-20 border-2 border-white/20 rounded-2xl rotate-12"></div>
                        <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-xl rotate-45"></div>
                    </div>
                </div>
            </div>
        </>
    );
}