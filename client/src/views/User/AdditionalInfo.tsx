"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { User, MapPin, Briefcase, GraduationCap, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useState } from "react"
import AuthService from "@/services/auth.service"
import AddtionalInfoService from "@/services/additional-info.service"
import { useNavigate } from "react-router-dom"
import NotificationService from "@/components/Notification"

interface UserAdditionalInfo {
    CurrentLevelOfEducation: string
    LevelOfExpertise: string
    FieldOfExpertise: string
    UserInterestsAndGoals: string
    Gender: string
    City: string
    Address: string
}

export default function UserAdditionalInfo() {
    // Navigation Hook
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<UserAdditionalInfo>({
        CurrentLevelOfEducation: "",
        LevelOfExpertise: "",
        FieldOfExpertise: "",
        UserInterestsAndGoals: "",
        Gender: "",
        City: "",
        Address: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const totalSteps = 4
    const progress = (currentStep / totalSteps) * 100

    const handleInputChange = (field: keyof UserAdditionalInfo, value: string) => {
        // Limit UserInterestsAndGoals to 500 characters
        if (field === "UserInterestsAndGoals" && value.length > 500) {
            return
        }
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return formData.CurrentLevelOfEducation !== ""
            case 2:
                return formData.LevelOfExpertise !== "" && formData.FieldOfExpertise.trim() !== ""
            case 3:
                return formData.UserInterestsAndGoals.trim().length >= 50
            case 4:
                return formData.Gender !== "" && formData.City.trim() !== ""
            default:
                return false
        }
    }



    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return

        setIsSubmitting(true)
        try {
            const userId = AuthService.getAuthenticatedUserId()
            if (!userId) {
                navigate("/login")
                return
            }
            const userInfo = {
                ...formData,
                UserId: userId!,
            }

            await AddtionalInfoService.addUserAdditionalInfo(userInfo)

            console.log("Information saved successfully!")
            NotificationService.success("Information Saved Successfully!", "Thank you for providing your info.");
            setTimeout(() => {
                navigate("/user/dashboard")
            }, 1000)
        } catch (error) {
            NotificationService.error("Error saving information:", `${error}`);
            console.error("Error saving information:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const steps = [
        {
            number: 1,
            title: "Education Level",
            description: "Your current education status",
            icon: GraduationCap,
        },
        {
            number: 2,
            title: "Expertise & Field",
            description: "Your knowledge and interests",
            icon: Briefcase,
        },
        {
            number: 3,
            title: "Goals & Interests",
            description: "What you want to learn",
            icon: User,
        },
        {
            number: 4,
            title: "Personal Details",
            description: "Location and personal info",
            icon: MapPin,
        },
    ]

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-50/30 to-white pt-25">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Additional Information</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        To help us match you with the best mentors, please provide some information about your learning goals and
                        background.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm font-medium text-indigo-600">{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-200" />
                </div>

                {/* Steps Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        {steps.map((step) => {
                            const Icon = step.icon
                            const isCompleted = currentStep > step.number
                            const isCurrent = currentStep === step.number
                            const isAccessible = step.number <= currentStep || validateStep(step.number - 1)

                            return (
                                <div key={step.number} className="flex items-center">
                                    <div
                                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${isCompleted
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : isCurrent
                                                ? "bg-white border-indigo-600 text-indigo-600"
                                                : isAccessible
                                                    ? "bg-gray-100 border-gray-300 text-gray-400"
                                                    : "bg-gray-50 border-gray-200 text-gray-300"
                                            }`}
                                    >
                                        {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                    </div>
                                    {step.number < totalSteps && (
                                        <div
                                            className={`w-16 h-0.5 mx-2 ${isCompleted ? "bg-indigo-600" : "bg-gray-200"
                                                } transition-colors duration-200`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Form Card */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</CardTitle>
                        <p className="text-gray-600">{steps[currentStep - 1].description}</p>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="education" className="text-base font-medium text-gray-900">
                                        Current Level of Education *
                                    </Label>
                                    <Select
                                        value={formData.CurrentLevelOfEducation}
                                        onValueChange={(value) => handleInputChange("CurrentLevelOfEducation", value)}
                                    >
                                        <SelectTrigger className="bg-white/60 border-gray-300 focus:border-indigo-500 h-12">
                                            <SelectValue placeholder="Select your current education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="High School">High School</SelectItem>
                                            <SelectItem value="Some College">Some College</SelectItem>
                                            <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                            <SelectItem value="PhD/Doctorate">PhD/Doctorate</SelectItem>
                                            <SelectItem value="Professional Certification">Professional Certification</SelectItem>
                                            <SelectItem value="Self-Taught">Self-Taught</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                    <h4 className="font-medium text-indigo-900 mb-2">📚 Why we ask:</h4>
                                    <ul className="text-sm text-indigo-700 space-y-1">
                                        <li>• Helps mentors understand your academic background</li>
                                        <li>• Allows for better matching with appropriate mentors</li>
                                        <li>• Enables personalized learning recommendations</li>
                                        <li>• No judgment - all education paths are valuable!</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Expertise Level & Field */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="levelOfExpertise" className="text-base font-medium text-gray-900">
                                            Current Level of Expertise *
                                        </Label>
                                        <Select
                                            value={formData.LevelOfExpertise}
                                            onValueChange={(value) => handleInputChange("LevelOfExpertise", value)}
                                        >
                                            <SelectTrigger className="bg-white/60 border-gray-300 focus:border-indigo-500 h-12">
                                                <SelectValue placeholder="Select your current level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Complete Beginner">Complete Beginner</SelectItem>
                                                <SelectItem value="Beginner">Beginner (Some basic knowledge)</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate (Some experience)</SelectItem>
                                                <SelectItem value="Advanced">Advanced (Significant experience)</SelectItem>
                                                <SelectItem value="Expert">Expert (Professional level)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="fieldOfExpertise" className="text-base font-medium text-gray-900">
                                            Field of Interest *
                                        </Label>
                                        <Input
                                            id="fieldOfExpertise"
                                            placeholder="e.g., Software Development, Digital Marketing, Data Science"
                                            value={formData.FieldOfExpertise}
                                            onChange={(e) => handleInputChange("FieldOfExpertise", e.target.value)}
                                            className="bg-white/60 border-gray-300 focus:border-indigo-500 h-12"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">🎯 Be honest about your level:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>
                                            <strong>Beginner:</strong> Perfect for foundational learning and basic concepts
                                        </div>
                                        <div>
                                            <strong>Intermediate/Advanced:</strong> Great for specialized skills and career guidance
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="userInterestsAndGoals" className="text-base font-medium text-gray-900">
                                        Learning Goals & Interests *
                                    </Label>
                                    <Textarea
                                        id="userInterestsAndGoals"
                                        placeholder="Tell us about your learning goals, what you want to achieve, specific skills you want to develop, career aspirations, or projects you're working on..."
                                        value={formData.UserInterestsAndGoals}
                                        onChange={(e) => handleInputChange("UserInterestsAndGoals", e.target.value)}
                                        rows={6}
                                        className="bg-white/60 border-gray-300 focus:border-indigo-500 resize-none"
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between items-center text-sm">
                                        <span
                                            className={`${formData.UserInterestsAndGoals.length >= 50 ? "text-green-600" : "text-gray-500"} transition-colors`}
                                        >
                                            {formData.UserInterestsAndGoals.length >= 50
                                                ? "✓ Great! Your goals are clear"
                                                : "Minimum 50 characters"}
                                        </span>
                                        <span className="text-gray-400">{formData.UserInterestsAndGoals.length}/500</span>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                    <h4 className="font-medium text-indigo-900 mb-2">💡 Tips for writing great learning goals:</h4>
                                    <ul className="text-sm text-indigo-700 space-y-1">
                                        <li>• Be specific about what skills you want to develop</li>
                                        <li>• Mention your career aspirations or projects you're working on</li>
                                        <li>• Include any particular challenges you're facing</li>
                                        <li>• Share what motivates you to learn in this field</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Personal Details */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="gender" className="text-base font-medium text-gray-900">
                                            Gender *
                                        </Label>
                                        <Select value={formData.Gender} onValueChange={(value) => handleInputChange("Gender", value)}>
                                            <SelectTrigger className="bg-white/60 border-gray-300 focus:border-indigo-500 h-12">
                                                <SelectValue placeholder="Select your gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="city" className="text-base font-medium text-gray-900">
                                            City *
                                        </Label>
                                        <Input
                                            id="city"
                                            placeholder="e.g., Karachi, Lahore"
                                            value={formData.City}
                                            onChange={(e) => handleInputChange("City", e.target.value)}
                                            className="bg-white/60 border-gray-300 focus:border-indigo-500 h-12"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="address" className="text-base font-medium text-gray-900">
                                        Full Address (Optional)
                                    </Label>
                                    <Input
                                        id="address"
                                        placeholder="Complete address for location-based matching (kept private)"
                                        value={formData.Address}
                                        onChange={(e) => handleInputChange("Address", e.target.value)}
                                        className="bg-white/60 border-gray-300 focus:border-indigo-500 h-12"
                                    />
                                    <p className="text-sm text-gray-500">
                                        This helps us match you with mentors in your area. Your full address will remain private.
                                    </p>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-900 mb-2">🎉 Almost done!</h4>
                                    <p className="text-sm text-green-700">
                                        You're about to complete your learning profile. This information will help us match you with the
                                        perfect mentors based on your goals and interests.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2 px-6 py-3 bg-transparent"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    {currentStep === totalSteps ? "Ready to submit?" : `${totalSteps - currentStep} steps remaining`}
                                </p>
                            </div>

                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!validateStep(currentStep)}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!validateStep(currentStep) || isSubmitting}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Complete Profile
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
