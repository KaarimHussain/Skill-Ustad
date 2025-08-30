"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Building, User, MapPin, Briefcase, ChevronLeft, ChevronRight, Check, Users, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import AuthService from "@/services/auth.service"
import CompaniesService from "@/services/companies.service"
import { useNavigate } from "react-router-dom"

interface CompanyAdditionalInfo {
    contactPersonName: string
    contactPersonTitle: string
    workPhone: string
    industry: string
    businessType: string
    employeeCount: string
    country: string
    city: string
    companyDescription: string
    linkedinUrl: string
}

export default function CompanyAdditionalInfo() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<CompanyAdditionalInfo>({
        contactPersonName: "",
        contactPersonTitle: "",
        workPhone: "",
        industry: "",
        businessType: "",
        employeeCount: "",
        country: "",
        city: "",
        companyDescription: "",
        linkedinUrl: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const totalSteps = 4
    const progress = (currentStep / totalSteps) * 100

    const InfoCheck = async () => {
        const userId = AuthService.getAuthenticatedUserId();
        if (userId == null) return navigate("/company/login");
        const infoCheck = await CompaniesService.CheckCompanyAdditionalInfo(userId);
        // check if the infoCheck is true or false
        if (infoCheck) {
            navigate("/company/dashboard");
            return;
        }
    }
    useEffect(() => {
        InfoCheck();
    }, [])

    const handleInputChange = (field: keyof CompanyAdditionalInfo, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return (
                    formData.contactPersonName.trim() !== "" &&
                    formData.contactPersonTitle.trim() !== "" &&
                    formData.workPhone.trim() !== ""
                )
            case 2:
                return (
                    formData.industry.trim() !== "" &&
                    formData.businessType.trim() !== "" &&
                    formData.employeeCount !== ""
                )
            case 3:
                return formData.companyDescription.trim().length >= 50
            case 4:
                return formData.country.trim() !== "" && formData.city.trim() !== ""
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

    const isValidUrl = (url: string) => {
        if (!url) return true // Optional field
        try {
            new URL(url)
            return url.includes('linkedin.com')
        } catch {
            return false
        }
    }

    const isValidPhone = (phone: string) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
    }

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return

        setIsSubmitting(true)
        try {
            // Get company ID from authenticated user
            const companyId = AuthService.getAuthenticatedUserId();
            if (!companyId) {
                throw new Error("Company ID not found. Please login again.");
            }

            // Prepare data matching backend DTO
            const requestData = {
                CompanyId: parseInt(companyId),
                ContactPersonName: formData.contactPersonName,
                ContactPersonTitle: formData.contactPersonTitle,
                WorkPhone: formData.workPhone,
                Industry: formData.industry,
                BusinessType: formData.businessType,
                Country: formData.country,
                City: formData.city,
                EmployeeCount: formData.employeeCount ? parseInt(formData.employeeCount.split('-')[0]) : null,
                CompanyDescription: formData.companyDescription,
                LinkedInUrl: formData.linkedinUrl || null,
            };

            console.log("Submitting Company Additional Info:", requestData);

            // Call your service method
            await CompaniesService.AddAdditionalInfo(requestData);

            console.log("Information saved successfully!");
            // Add navigation logic here if needed
            navigate("/company/dashboard");
        } catch (error) {
            console.error("Error saving information:", error);
            // You might want to show an error message to the user here
        } finally {
            setIsSubmitting(false)
        }
    }

    const steps = [
        {
            number: 1,
            title: "Contact Information",
            description: "Primary contact details",
            icon: User,
        },
        {
            number: 2,
            title: "Business Details",
            description: "Industry and company type",
            icon: Building,
        },
        {
            number: 3,
            title: "Company Overview",
            description: "About your company",
            icon: Briefcase,
        },
        {
            number: 4,
            title: "Location & Social",
            description: "Location and online presence",
            icon: MapPin,
        },
    ]

    const employeeRanges = [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1001-5000",
        "5000+"
    ]

    const businessTypes = [
        "Startup",
        "Small Business",
        "Medium Enterprise",
        "Large Corporation",
        "Non-Profit",
        "Government",
        "Educational Institution",
        "Consulting",
        "Freelance/Independent"
    ]

    const industries = [
        "Technology",
        "Healthcare",
        "Finance",
        "Education",
        "Manufacturing",
        "Retail",
        "Consulting",
        "Real Estate",
        "Marketing & Advertising",
        "Media & Entertainment",
        "Transportation",
        "Energy",
        "Food & Beverage",
        "Other"
    ]

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50/30 to-white pt-8">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Company Information</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Help us understand your company better to provide you with the best possible service and match you with the right mentors.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm font-medium text-blue-600">{Math.round(progress)}% Complete</span>
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
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : isCurrent
                                                ? "bg-white border-blue-600 text-blue-600"
                                                : isAccessible
                                                    ? "bg-gray-100 border-gray-300 text-gray-400"
                                                    : "bg-gray-50 border-gray-200 text-gray-300"
                                            }`}
                                    >
                                        {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                    </div>
                                    {step.number < totalSteps && (
                                        <div
                                            className={`w-16 h-0.5 mx-2 ${isCompleted ? "bg-blue-600" : "bg-gray-200"
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
                        {/* Step 1: Contact Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="contactPersonName" className="text-base font-medium text-gray-900">
                                            Contact Person Name *
                                        </Label>
                                        <Input
                                            id="contactPersonName"
                                            placeholder="Enter the primary contact person's full name"
                                            value={formData.contactPersonName}
                                            onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                                            className="bg-white/60 border-gray-300 focus:border-blue-500 h-12"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="contactPersonTitle" className="text-base font-medium text-gray-900">
                                            Contact Person Title *
                                        </Label>
                                        <Input
                                            id="contactPersonTitle"
                                            placeholder="e.g., CEO, HR Manager, Operations Director"
                                            value={formData.contactPersonTitle}
                                            onChange={(e) => handleInputChange("contactPersonTitle", e.target.value)}
                                            className="bg-white/60 border-gray-300 focus:border-blue-500 h-12"
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="workPhone" className="text-base font-medium text-gray-900">
                                        Work Phone Number *
                                    </Label>
                                    <Input
                                        id="workPhone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.workPhone}
                                        onChange={(e) => handleInputChange("workPhone", e.target.value)}
                                        className="bg-white/60 border-gray-300 focus:border-blue-500 h-12"
                                        maxLength={20}
                                    />
                                    {formData.workPhone && !isValidPhone(formData.workPhone) && (
                                        <p className="text-sm text-red-600">Please enter a valid phone number</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">📞 Contact Information</h4>
                                    <p className="text-sm text-blue-700">
                                        This information will be used to reach out to you regarding your company's mentorship needs and any questions about our services.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Business Details */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="industry" className="text-base font-medium text-gray-900">
                                            Industry *
                                        </Label>
                                        <Select
                                            value={formData.industry}
                                            onValueChange={(value) => handleInputChange("industry", value)}
                                        >
                                            <SelectTrigger className="bg-white/60 border-gray-300 focus:border-blue-500 h-12">
                                                <SelectValue placeholder="Select your industry" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {industries.map((industry) => (
                                                    <SelectItem key={industry} value={industry}>
                                                        {industry}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="businessType" className="text-base font-medium text-gray-900">
                                            Business Type *
                                        </Label>
                                        <Select
                                            value={formData.businessType}
                                            onValueChange={(value) => handleInputChange("businessType", value)}
                                        >
                                            <SelectTrigger className="bg-white/60 border-gray-300 focus:border-blue-500 h-12">
                                                <SelectValue placeholder="Select business type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {businessTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="employeeCount" className="text-base font-medium text-gray-900">
                                        Employee Count *
                                    </Label>
                                    <Select
                                        value={formData.employeeCount}
                                        onValueChange={(value) => handleInputChange("employeeCount", value)}
                                    >
                                        <SelectTrigger className="bg-white/60 border-gray-300 focus:border-blue-500 h-12">
                                            <SelectValue placeholder="Select company size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employeeRanges.map((range) => (
                                                <SelectItem key={range} value={range}>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        {range} employees
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">🏢 Business Classification</h4>
                                    <p className="text-sm text-gray-600">
                                        This information helps us understand your company's structure and recommend the most suitable mentorship programs for your team size and industry.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Company Overview */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="companyDescription" className="text-base font-medium text-gray-900">
                                        Company Description *
                                    </Label>
                                    <Textarea
                                        id="companyDescription"
                                        placeholder="Describe your company's mission, values, key services/products, and what makes your organization unique. Include information about your company culture and any specific mentorship goals..."
                                        value={formData.companyDescription}
                                        onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                                        rows={6}
                                        className="bg-white/60 border-gray-300 focus:border-blue-500 text-base resize-none"
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between items-center text-sm">
                                        <span
                                            className={`${formData.companyDescription.length >= 50 ? "text-green-600" : "text-gray-500"
                                                } transition-colors`}
                                        >
                                            {formData.companyDescription.length >= 50
                                                ? "✓ Great! Your description looks comprehensive"
                                                : "Minimum 50 characters required"}
                                        </span>
                                        <span className="text-gray-400">{formData.companyDescription.length}/500</span>
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-900 mb-2">💡 Tips for a great company description:</h4>
                                    <ul className="text-sm text-green-700 space-y-1">
                                        <li>• Highlight your company's mission and core values</li>
                                        <li>• Mention key products, services, or areas of expertise</li>
                                        <li>• Describe your company culture and work environment</li>
                                        <li>• Include any specific mentorship or professional development goals</li>
                                        <li>• Mention notable achievements, certifications, or recognition</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Location & Social */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="country" className="text-base font-medium text-gray-900">
                                            Country *
                                        </Label>
                                        <Input
                                            id="country"
                                            placeholder="e.g., United States, Canada, United Kingdom"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange("country", e.target.value)}
                                            className="bg-white/60 border-gray-300 focus:border-blue-500 h-12"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="city" className="text-base font-medium text-gray-900">
                                            City *
                                        </Label>
                                        <Input
                                            id="city"
                                            placeholder="e.g., New York, London, Toronto"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange("city", e.target.value)}
                                            className="bg-white/60 border-gray-300 focus:border-blue-500 h-12"
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="linkedinUrl" className="text-base font-medium text-gray-900">
                                        LinkedIn Company Page (Optional)
                                    </Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="linkedinUrl"
                                            type="url"
                                            placeholder="https://www.linkedin.com/company/your-company"
                                            value={formData.linkedinUrl}
                                            onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                                            className="bg-white/60 border-gray-300 focus:border-blue-500 h-12 pl-11"
                                            maxLength={255}
                                        />
                                    </div>
                                    {formData.linkedinUrl && !isValidUrl(formData.linkedinUrl) && (
                                        <p className="text-sm text-red-600">Please enter a valid LinkedIn company URL</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2">🌍 Location & Online Presence</h4>
                                    <p className="text-sm text-blue-700">
                                        Your location helps us match you with mentors in similar time zones or regions. Your LinkedIn page helps mentors learn more about your company culture and values.
                                    </p>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-medium text-green-900 mb-2">🎉 Ready to submit!</h4>
                                    <p className="text-sm text-green-700">
                                        You're about to complete your company profile. This information will help us provide you with the best mentorship recommendations and services tailored to your needs.
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
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!validateStep(currentStep) || isSubmitting}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Save Information
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