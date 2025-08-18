"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, MapPin, Briefcase, GraduationCap, Tag, ChevronLeft, ChevronRight, Check, X, Plus } from "lucide-react"
import { useState } from "react"
import AuthService from "@/services/auth.service"
import AddtionalInfoService from "@/services/additional-info.service"
import { useNavigate } from "react-router-dom"

interface MentorAdditionalInfo {
    Bio: string
    LevelOfExpertise: string
    FieldOfExpertise: string
    IndustryExperience: string
    Gender: string
    City: string
    Address: string
}

interface MentorExpertiseTag {
    TagName: string
}

export default function AdditionalInfo() {
    // Navigation Hook
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<MentorAdditionalInfo>({
        Bio: "",
        LevelOfExpertise: "",
        FieldOfExpertise: "",
        IndustryExperience: "",
        Gender: "",
        City: "",
        Address: "",
    })

    const [expertiseTags, setExpertiseTags] = useState<MentorExpertiseTag[]>([])
    const [newTag, setNewTag] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const totalSteps = 4
    const progress = (currentStep / totalSteps) * 100

    const handleInputChange = (field: keyof MentorAdditionalInfo, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const addExpertiseTag = () => {
        if (newTag.trim() && !expertiseTags.some((tag) => tag.TagName.toLowerCase() === newTag.toLowerCase())) {
            setExpertiseTags((prev) => [...prev, { TagName: newTag.trim() }])
            setNewTag("")
        }
    }

    const removeExpertiseTag = (tagToRemove: string) => {
        setExpertiseTags((prev) => prev.filter((tag) => tag.TagName !== tagToRemove))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addExpertiseTag()
        }
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return formData.Bio.trim().length >= 50
            case 2:
                return formData.LevelOfExpertise !== "" && formData.FieldOfExpertise.trim() !== ""
            case 3:
                return formData.IndustryExperience.trim() !== "" && expertiseTags.length >= 3
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
            const mentorId = AuthService.getAuthenticatedUserId();
            if (!mentorId) {
                navigate("/login");
                return;
            }
            const mentorInfo = {
                ...formData,
                MentorId: mentorId!,
            }

            const tags = expertiseTags.map((tag) => ({
                ...tag,
                MentorId: mentorId!,
            }))

            console.log("Mentor Additional Info:", mentorInfo)
            console.log("Expertise Tags:", tags)

            // Simulate API call
            await AddtionalInfoService.addMentorAdditionalInfo(mentorInfo, tags);

            // Redirect to dashboard or next page
            console.log("Information saved successfully!")
            navigate("/mentor/dashboard");
        } catch (error) {
            console.error("Error saving information:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const steps = [
        {
            number: 1,
            title: "Professional Bio",
            description: "Tell us about yourself",
            icon: User,
        },
        {
            number: 2,
            title: "Expertise Level",
            description: "Your professional background",
            icon: GraduationCap,
        },
        {
            number: 3,
            title: "Experience & Skills",
            description: "Industry experience and tags",
            icon: Briefcase,
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
                        To ensure a great experience, we need you to provide us some information about yourself as a mentor.
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
                        {/* Step 1: Professional Bio */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="bio" className="text-base font-medium text-gray-900">
                                        Professional Bio *
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Write a compelling bio that showcases your expertise, experience, and what makes you a great mentor. Include your background, achievements, and what you're passionate about teaching..."
                                        value={formData.Bio}
                                        onChange={(e) => handleInputChange("Bio", e.target.value)}
                                        rows={6}
                                        className="bg-white/60 border-gray-300 focus:border-indigo-500 text-base resize-none"
                                    />
                                    <div className="flex justify-between items-center text-sm">
                                        <span
                                            className={`${formData.Bio.length >= 50 ? "text-green-600" : "text-gray-500"} transition-colors`}
                                        >
                                            {formData.Bio.length >= 50 ? "✓ Great! Your bio looks comprehensive" : "Minimum 50 characters"}
                                        </span>
                                        <span className="text-gray-400">{formData.Bio.length}/500</span>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                    <h4 className="font-medium text-indigo-900 mb-2">💡 Tips for a great bio:</h4>
                                    <ul className="text-sm text-indigo-700 space-y-1">
                                        <li>• Highlight your key expertise and experience</li>
                                        <li>• Mention your teaching or mentoring philosophy</li>
                                        <li>• Include notable achievements or certifications</li>
                                        <li>• Show your personality and passion for helping others</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Expertise Level */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="levelOfExpertise" className="text-base font-medium text-gray-900">
                                            Level of Expertise *
                                        </Label>
                                        <Select
                                            value={formData.LevelOfExpertise}
                                            onValueChange={(value) => handleInputChange("LevelOfExpertise", value)}
                                        >
                                            <SelectTrigger className="bg-white/60 border-gray-300 focus:border-indigo-500 h-12">
                                                <SelectValue placeholder="Select your expertise level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Junior">Junior (1-3 years experience)</SelectItem>
                                                <SelectItem value="Mid-Level">Mid-Level (3-7 years experience)</SelectItem>
                                                <SelectItem value="Senior">Senior (7-12 years experience)</SelectItem>
                                                <SelectItem value="Expert">Expert (12+ years experience)</SelectItem>
                                                <SelectItem value="Thought Leader">Thought Leader (Industry recognized expert)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="fieldOfExpertise" className="text-base font-medium text-gray-900">
                                            Primary Field of Expertise *
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
                                    <h4 className="font-medium text-gray-900 mb-2">🎯 Choose the right level:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>
                                            <strong>Junior/Mid-Level:</strong> Great for beginners and intermediate learners
                                        </div>
                                        <div>
                                            <strong>Senior/Expert:</strong> Perfect for advanced learners and career guidance
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Experience & Skills */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="industryExperience" className="text-base font-medium text-gray-900">
                                        Industry Experience *
                                    </Label>
                                    <Textarea
                                        id="industryExperience"
                                        placeholder="Describe your industry experience, key projects, companies you've worked with, and significant achievements that demonstrate your expertise..."
                                        value={formData.IndustryExperience}
                                        onChange={(e) => handleInputChange("IndustryExperience", e.target.value)}
                                        rows={4}
                                        className="bg-white/60 border-gray-300 focus:border-indigo-500 resize-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-gray-900">Expertise Tags * (Minimum 3 required)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a skill or expertise tag (e.g., React, Leadership, SEO)"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="bg-white/60 border-gray-300 focus:border-indigo-500"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addExpertiseTag}
                                            disabled={!newTag.trim()}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {expertiseTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {expertiseTags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-indigo-100 text-indigo-700 px-3 py-1 text-sm flex items-center gap-2"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {tag.TagName}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExpertiseTag(tag.TagName)}
                                                        className="ml-1 hover:text-red-600 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-sm text-gray-500">
                                        {expertiseTags.length >= 3 ? (
                                            <span className="text-green-600">✓ Great! You have {expertiseTags.length} tags</span>
                                        ) : (
                                            `Add ${3 - expertiseTags.length} more tags to continue`
                                        )}
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">🏷️ Tag suggestions:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "JavaScript",
                                            "Python",
                                            "Leadership",
                                            "Project Management",
                                            "UI/UX Design",
                                            "Data Analysis",
                                            "Marketing Strategy",
                                            "Team Building",
                                        ].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() => setNewTag(suggestion)}
                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
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
                                            placeholder="e.g., New York, London, Tokyo"
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
                                        This helps us match you with students in your area. Your full address will remain private.
                                    </p>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-900 mb-2">🎉 Almost done!</h4>
                                    <p className="text-sm text-green-700">
                                        You're about to complete your mentor profile. This information will help students find and connect
                                        with you based on their learning needs.
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
