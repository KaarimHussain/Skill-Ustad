"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import our modular components
import { SignupBackground } from "@/components/signup/background"
import { ProgressIndicator } from "@/components/signup/ui-components"
import { Step1BasicInfo } from "@/components/signup/step1-basic-info"
import { Step2ProfilePicture } from "@/components/signup/step2-profile-picture"
import { Step3AdditionalInfo } from "@/components/signup/step3-additional-info"

// Import types and utilities
import type { FormData, TouchedFields } from "@/types/signup"
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "@/utils/validation"
import { Link } from "react-router-dom"

function WelcomeAnimationFade({ onGetStartedClick }: { onGetStartedClick: () => void }) {
    const [isExiting, setIsExiting] = useState(false)

    const handleClick = () => {
        setIsExiting(true)
        // Wait for the animation to finish before calling the parent handler
        setTimeout(onGetStartedClick, 500)
    }

    return (
        <>
            {/* <DecorativeGlow /> */}
            <div
                className={`min-h-[100vh] w-full bg-white flex items-center justify-center flex-col animate-in fade-in duration-500 ${isExiting ? "animate-out fade-out duration-500" : ""
                    }`}
            >
                <p className="text-black lg:text-7xl md:text-5xl sm:text-2xl text-3xl font-bold text-center">Welcome, Let's get started</p>
                <p className="text-center text-black/80 my-5 lg:text-xl md:text-base sm:text-sm text-sm">You will first need to fill some information about yourself</p>
                <Button size={"lg"} className="text-white text-lg bg-indigo-500 hover:bg-indigo-600 rounded-full" onClick={handleClick}>
                    Get Started
                </Button>
            </div>
        </>
    )
}

function SignupForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [touched, setTouched] = useState<TouchedFields>({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
        expertiseLevel: false,
        fieldOfExpertise: false,
        language: false,
    })

    const [formData, setFormData] = useState<FormData>({
        // Step 1
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        acceptMarketing: false,
        // Step 2
        profilePicture: null,
        // Step 3
        expertiseLevel: "",
        fieldOfExpertise: "",
        language: "",
        additionalInfo: "",
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

    // Step validation
    const isStep1Valid =
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


    const isStep3Valid = formData.expertiseLevel && formData.fieldOfExpertise && formData.language

    const handleInputChange = useCallback((field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleBlur = useCallback((field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
    }, [])

    const handleNextStep = () => {
        if (currentStep === 1) {
            // Mark all step 1 fields as touched
            setTouched((prev) => ({
                ...prev,
                name: true,
                email: true,
                password: true,
                confirmPassword: true,
            }))

            if (isStep1Valid) {
                setCurrentStep(2)
            }
        } else if (currentStep === 2) {
            setCurrentStep(3)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()

            if (currentStep === 3) {
                // Mark all step 3 fields as touched
                setTouched((prev) => ({
                    ...prev,
                    expertiseLevel: true,
                    fieldOfExpertise: true,
                    language: true,
                }))

                if (!isStep3Valid) {
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
            } else {
                handleNextStep()
            }
        },
        [currentStep, formData, isStep3Valid],
    )

    const handleSocialSignup = useCallback((provider: string) => {
        console.log(`Sign up with ${provider}`)
    }, [])

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Create Account"
            case 2:
                return "Add Profile Picture"
            case 3:
                return "Tell Us About Yourself"
            default:
                return "Create Account"
        }
    }

    const getStepSubtitle = () => {
        switch (currentStep) {
            case 1:
                return "Start your learning journey today"
            case 2:
                return "Help others recognize you"
            case 3:
                return "Personalize your experience"
            default:
                return "Start your learning journey today"
        }
    }

    return (
        <section
            className="min-h-[100vh] pt-32 pb-10 w-full flex items-center justify-center p-4 relative overflow-hidden animate-in fade-in duration-500"
        >
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
                        {/* Progress Indicator */}
                        <ProgressIndicator currentStep={currentStep} totalSteps={3} />

                        {/* Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl text-gray-900 font-bold mb-3">{getStepTitle()}</h2>
                            <p className="text-gray-600 text-base">{getStepSubtitle()}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <Step1BasicInfo
                                    formData={formData}
                                    touched={touched}
                                    errors={errors}
                                    passwordValidation={passwordValidation}
                                    onInputChange={handleInputChange}
                                    onBlur={handleBlur}
                                    onSocialSignup={handleSocialSignup}
                                />
                            )}

                            {/* Step 2: Profile Picture */}
                            {currentStep === 2 && <Step2ProfilePicture formData={formData} onInputChange={handleInputChange} />}

                            {/* Step 3: Additional Information */}
                            {currentStep === 3 && (
                                <Step3AdditionalInfo formData={formData} touched={touched} onInputChange={handleInputChange} />
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 pt-4">
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] h-14"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Back
                                    </Button>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading || (currentStep === 1 && !isStep1Valid) || (currentStep === 3 && !isStep3Valid)}
                                    className={`${currentStep === 1 ? "w-full" : "flex-1"
                                        } bg-indigo-500 hover:bg-indigo-600 text-white py-6 text-base rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-200/50`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3">
                                            {currentStep === 3 ? "Create Account" : "Continue"}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </div>

                            {/* Form Validation Summary */}
                            {((currentStep === 1 && Object.values(touched).some(Boolean) && !isStep1Valid) ||
                                (currentStep === 3 &&
                                    (touched.expertiseLevel || touched.fieldOfExpertise || touched.language) &&
                                    !isStep3Valid)) && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <span>Please complete all required fields and fix any errors</span>
                                        </div>
                                    </div>
                                )}

                            {/* Sign In Link - Only show on first step */}
                            {currentStep === 1 && (
                                <div className="text-center pt-6 border-t border-gray-200">
                                    <p className="text-gray-600 text-base">
                                        Already have an account?{" "}
                                        <Link to={"/login"} className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Additional Info - Only show on first step */}
                {currentStep === 1 && (
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
                )}
            </div>
        </section>
    )
}

export default function Signup() {
    const [showForm, setShowForm] = useState(false)

    const handleGetStarted = () => {
        setShowForm(true)
    }
    if (!showForm) {
        return (
            <div className="bg-gradient-to-t from-indigo-400 to-indigo-500 h-screen flex items-center justify-center">
                <WelcomeAnimationFade onGetStartedClick={handleGetStarted} />
            </div>
        )
    } else {
        return <SignupForm />
    }

}