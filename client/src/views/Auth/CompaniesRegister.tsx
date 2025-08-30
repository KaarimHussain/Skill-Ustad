"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CompaniesService, { type CompanyRegisterRequest } from "@/services/companies.service";
import { AlertCircle, ArrowRight, Building2, CheckCircle, Eye, EyeOff, Loader2, Mail, Users, Lock, Globe } from "lucide-react";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

// --- Background (unchanged) ---
const LoginBackground = () => (
    <>
        <div className="absolute inset-0 bg-gray-50" />
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-100/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-blue-100/10 rounded-full blur-2xl" />
        <div className="absolute top-20 left-20 w-1 h-1 bg-gray-300 rounded-full opacity-40" />
        <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-30" />
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-gray-300 rounded-full opacity-35" />
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-25" />
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-gray-200/50 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-gray-200/50 rounded-br-3xl" />
    </>
);

// --- Validation Functions (Enhanced) ---
const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";

    // Block personal email domains
    const personalDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(domain)) {
        return "Please use your company's official email (e.g., @yourcompany.com)";
    }

    return "";
};

const validateCompanyName = (name: string): string => {
    if (!name) return "Company name is required";
    if (name.trim().length < 2) return "Company name must be at least 2 characters";
    return "";
};

const validateWebsite = (url: string): string => {
    if (!url) return "Website is required";
    try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
        return "";
    } catch {
        return "Please enter a valid website URL (e.g., https://acme.com)";
    }
};

const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Include a lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Include an uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Include a number";
    return "";
};

// --- Messages ---
const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1 animate-in slide-in-from-left-2 duration-200">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
    </div>
);

const SuccessMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 text-green-600 text-sm mt-1 animate-in slide-in-from-left-2 duration-200">
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
    </div>
);

export default function CompaniesRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const [touched, setTouched] = useState({
        companyName: false,
        email: false,
        website: false,
        password: false,
    });

    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        website: "",
        password: "",
    });

    // --- Validation ---
    const errors = {
        companyName: touched.companyName ? validateCompanyName(formData.companyName) : "",
        email: touched.email ? validateEmail(formData.email) : "",
        website: touched.website ? validateWebsite(formData.website) : "",
        password: touched.password ? validatePassword(formData.password) : "",
    };

    const isFormValid =
        !errors.companyName &&
        !errors.email &&
        !errors.website &&
        !errors.password &&
        formData.companyName &&
        formData.email &&
        formData.website &&
        formData.password;

    const handleInputChange = useCallback(
        (field: string, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (apiError) setApiError("");
        },
        [apiError]
    );

    const handleBlur = useCallback((field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }, []);

    const handleSubmit = useCallback(
        async (e?: React.MouseEvent<HTMLButtonElement>) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            setTouched({
                companyName: true,
                email: true,
                website: true,
                password: true,
            });

            if (!isFormValid) {
                setApiError("Please fix all errors before submitting.");
                return;
            }

            setIsLoading(true);
            setApiError("");
            setSuccessMessage("");

            try {
                const payload: CompanyRegisterRequest = {
                    companyName: formData.companyName.trim(),
                    companyEmail: formData.email.trim().toLowerCase(),
                    website: formData.website.startsWith("http")
                        ? formData.website
                        : `https://${formData.website.split('/')[0]}`,
                    password: formData.password,
                };

                console.log("🚀 Registering company:", payload);
                const response = await CompaniesService.Register(payload);
                if (response) {
                    setSuccessMessage("Registration successful! We'll verify your profile and email you once approved.");
                    setIsLoading(false);
                }else {
                    setApiError("Something went wrong. Please try again.");
                    setTimeout(() => setApiError(""), 8000);
                    setIsLoading(false);
                }

            } catch (error) {
                console.error("❌ Registration failed:", error);
                setApiError("Something went wrong. Please try again.");
                setTimeout(() => setApiError(""), 8000);
                setIsLoading(false);
            }
        },
        [formData, isFormValid]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (isFormValid && !isLoading) {
                    handleSubmit();
                }
            }
        },
        [handleSubmit, isFormValid, isLoading]
    );

    return (
        <section className="min-h-screen pt-32 pb-10 w-full flex items-center justify-center p-4 relative overflow-hidden">
            <LoginBackground />

            <div className="relative z-10 w-full max-w-lg mx-auto">
                <div
                    className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-10 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:bg-white/80 hover:border-white/80"
                    style={{
                        boxShadow: "0 25px 50px rgba(99, 102, 241, 0.15)",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/20 rounded-2xl pointer-events-none"></div>
                    <div className="relative z-10">

                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-indigo-100/70 text-indigo-600">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl text-gray-900 font-bold mb-3">Join SkillUstad</h2>
                            <p className="text-gray-600 text-base mb-2">Create your company account to start hiring</p>
                            <p className="text-gray-500 text-sm">Verify your domain to unlock full access</p>
                        </div>

                        {/* Messages */}
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

                            {/* Company Name */}
                            <div className="space-y-3">
                                <Label htmlFor="companyName" className="text-gray-700 font-medium text-base">
                                    Company Name
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                        <Building2 className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <Input
                                        id="companyName"
                                        type="text"
                                        placeholder="e.g., InnovateTech Solutions"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                        onBlur={() => handleBlur("companyName")}
                                        disabled={isLoading}
                                        className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.companyName ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.companyName && !errors.companyName && formData.companyName
                                                ? "border-green-500 focus:border-green-500"
                                                : ""
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    />
                                    {touched.companyName && formData.companyName && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {errors.companyName ? (
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.companyName && <ErrorMessage message={errors.companyName} />}
                                {touched.companyName && !errors.companyName && formData.companyName && (
                                    <SuccessMessage message="Great company name!" />
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-gray-700 font-medium text-base">
                                    Company Email
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                        <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@yourcompany.com"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        onBlur={() => handleBlur("email")}
                                        disabled={isLoading}
                                        className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.email ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.email && !errors.email && formData.email
                                                ? "border-green-500 focus:border-green-500"
                                                : ""
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                            </div>

                            {/* Website */}
                            <div className="space-y-3">
                                <Label htmlFor="website" className="text-gray-700 font-medium text-base">
                                    Company Website
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                        <Globe className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <Input
                                        id="website"
                                        type="text"
                                        placeholder="https://yourcompany.com"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                        onBlur={() => handleBlur("website")}
                                        disabled={isLoading}
                                        className={`pl-14 pr-4 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.website ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.website && !errors.website && formData.website
                                                ? "border-green-500 focus:border-green-500"
                                                : ""
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    />
                                    {touched.website && formData.website && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {errors.website ? (
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.website && <ErrorMessage message={errors.website} />}
                                {touched.website && !errors.website && formData.website && (
                                    <SuccessMessage message="Valid domain detected" />
                                )}
                            </div>

                            {/* Password */}
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
                                        disabled={isLoading}
                                        className={`pl-14 pr-14 py-6 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm h-14 hover:bg-white/70 ${errors.password ? "border-red-500 focus:border-red-500" : ""
                                            } ${touched.password && !errors.password && formData.password
                                                ? "border-green-500 focus:border-green-500"
                                                : ""
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <ErrorMessage message={errors.password} />}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading || !isFormValid}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Registering...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        Register Company
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>

                            {/* Validation Summary */}
                            {(touched.companyName || touched.email || touched.website || touched.password) &&
                                !isFormValid &&
                                !isLoading && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <span>Please fix the errors above to continue</span>
                                        </div>
                                    </div>
                                )}

                            {/* Login Link */}
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="text-indigo-800 font-medium mb-1">Already registered?</p>
                                        <p className="text-indigo-700">
                                            Sign in to manage your company profile.
                                            <Link to="/company/login" className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 hover:underline">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        By registering, you agree to our{" "}
                        <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}