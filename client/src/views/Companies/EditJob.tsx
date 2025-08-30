"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, MapPin, DollarSign, Mail, Users, AlertCircle, X, ArrowBigLeft, Loader2 } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import JobService, { type PostJobRequest } from "@/services/job.service"
import { toast } from "sonner"

export default function CompanyEditJob() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [jobData, setJobData] = useState<PostJobRequest>({
        title: "",
        jobLocation: "",
        jobType: "full-time",
        workMode: "on-site",
        salaryMin: "",
        salaryMax: "",
        currency: "PKR",
        description: "",
        requirements: "",
        responsibilities: "",
        benefits: "",
        applicationDeadline: "",
        contactEmail: "",
        experienceLevel: "entry",
        department: "",
        skills: [],
    })
    const [newSkill, setNewSkill] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [fetchError, setFetchError] = useState("")

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) {
                setFetchError("Job ID is required")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const job = await JobService.getJobById(id)

                if (!job) {
                    setFetchError("Job not found")
                    return
                }

                // Convert job data to form format
                setJobData({
                    title: job.title,
                    jobLocation: job.jobLocation,
                    jobType: job.jobType,
                    workMode: job.workMode,
                    salaryMin: job.salaryMin,
                    salaryMax: job.salaryMax,
                    currency: job.currency,
                    description: job.description,
                    requirements: job.requirements,
                    responsibilities: job.responsibilities,
                    benefits: job.benefits,
                    applicationDeadline: job.applicationDeadline ?
                        (typeof job.applicationDeadline === 'string' ?
                            job.applicationDeadline.split('T')[0] :
                            new Date(job.applicationDeadline).toISOString().split('T')[0]
                        ) : "",
                    contactEmail: job.contactEmail,
                    experienceLevel: job.experienceLevel,
                    department: job.department,
                    skills: job.skills || [],
                })
            } catch (error: any) {
                console.error("Error fetching job:", error)
                setFetchError(error.message || "Failed to fetch job details")
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setJobData(prev => ({ ...prev, [name]: value }))
        if (submitError) setSubmitError("") // Clear error when user makes changes
    }

    const addSkill = () => {
        const skill = newSkill.trim()
        if (skill && !jobData.skills.includes(skill) && jobData.skills.length < 20) {
            setJobData(prev => ({
                ...prev,
                skills: [...prev.skills, skill],
            }))
            setNewSkill("")
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setJobData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove),
        }))
    }

    const isFormValid = () => {
        return (
            jobData.title.trim() &&
            jobData.jobLocation.trim() &&
            jobData.description.trim().length >= 50 &&
            jobData.requirements.trim().length >= 20 &&
            jobData.contactEmail.trim() &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(jobData.contactEmail)
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!id) {
            setSubmitError("Job ID is required")
            return
        }

        if (!isFormValid()) {
            setSubmitError("Please fill in all required fields correctly")
            return
        }

        if (jobData.salaryMin && jobData.salaryMax) {
            const min = parseFloat(jobData.salaryMin)
            const max = parseFloat(jobData.salaryMax)
            if (min >= max) {
                setSubmitError("Maximum salary must be greater than minimum salary")
                return
            }
        }

        setIsSubmitting(true)
        setSubmitError("")

        try {
            await JobService.updateJob(id, jobData)
            toast.success("Job listing updated successfully!")
            navigate("/company/jobs")
        } catch (error: any) {
            console.error("Error updating job listing:", error)
            setSubmitError(error.message || "Failed to update job listing. Please try again.")
            toast.error("Failed to update job listing")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to={`/company/jobs/${id}`}>
                        <Button variant="outline" className="mb-6">
                            <ArrowBigLeft className="mr-2" /> Go Back
                        </Button>
                    </Link>
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
                            <p className="text-gray-600">Loading job details...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-white py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/company/jobs">
                        <Button variant="outline" className="mb-6">
                            <ArrowBigLeft className="mr-2" /> Go Back
                        </Button>
                    </Link>
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{fetchError}</AlertDescription>
                    </Alert>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 flex flex-col items-center justify-center gap-2">
                    <Link to={`/company/jobs/${id}`}>
                        <Button variant="outline" className="mb-6">
                            <ArrowBigLeft className="mr-2" /> Go Back
                        </Button>
                    </Link>
                    <div>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-full mb-4">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Job Listing</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Update your job posting to attract the right candidates
                        </p>
                    </div>
                </div>

                {submitError && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{submitError}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-indigo-500 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription className="text-indigo-100">
                                Essential details about the position
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={jobData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Senior Software Engineer"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Location *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="jobLocation"
                                            value={jobData.jobLocation}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g. New York, NY or Remote"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="department"
                                            value={jobData.department}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g. Engineering, Marketing"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience Level *
                                    </label>
                                    <select
                                        name="experienceLevel"
                                        value={jobData.experienceLevel}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="entry">Entry Level</option>
                                        <option value="mid">Mid Level</option>
                                        <option value="senior">Senior Level</option>
                                        <option value="lead">Lead/Principal</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Type *
                                    </label>
                                    <select
                                        name="jobType"
                                        value={jobData.jobType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Work Mode *
                                    </label>
                                    <select
                                        name="workMode"
                                        value={jobData.workMode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="on-site">On-site</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Currency
                                    </label>
                                    <select
                                        name="currency"
                                        value={jobData.currency}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="PKR">PKR (₨)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Salary Information */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-indigo-500 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Salary Information
                            </CardTitle>
                            <CardDescription className="text-indigo-100">
                                Optional but recommended for better applications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Salary
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            name="salaryMin"
                                            value={jobData.salaryMin}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="50000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maximum Salary
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            name="salaryMax"
                                            value={jobData.salaryMax}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="80000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Details */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-indigo-500 text-white">
                            <CardTitle>Job Details</CardTitle>
                            <CardDescription className="text-indigo-100">
                                Detailed information about the role
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Description * (minimum 50 characters)
                                </label>
                                <textarea
                                    name="description"
                                    value={jobData.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    placeholder="Provide a detailed description of the role, company culture, and what makes this opportunity unique..."
                                    required
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className={`text-xs ${jobData.description.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                                        {jobData.description.length >= 50 ? '✓ Good length' : `${50 - jobData.description.length} characters needed`}
                                    </span>
                                    <span className="text-xs text-gray-500">{jobData.description.length} characters</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requirements * (minimum 20 characters)
                                </label>
                                <textarea
                                    name="requirements"
                                    value={jobData.requirements}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    placeholder="List the required qualifications, education, experience, and skills..."
                                    required
                                />
                                <span className={`text-xs ${jobData.requirements.length >= 20 ? 'text-green-600' : 'text-gray-500'}`}>
                                    {jobData.requirements.length >= 20 ? '✓ Good length' : `${20 - jobData.requirements.length} characters needed`}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Responsibilities
                                </label>
                                <textarea
                                    name="responsibilities"
                                    value={jobData.responsibilities}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    placeholder="Describe the key responsibilities and day-to-day tasks..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Benefits & Perks
                                </label>
                                <textarea
                                    name="benefits"
                                    value={jobData.benefits}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    placeholder="List benefits, perks, and what your company offers..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-indigo-500 text-white">
                            <CardTitle>Required Skills</CardTitle>
                            <CardDescription className="text-indigo-100">
                                Add relevant skills and technologies (max 20)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Add a skill (e.g. JavaScript, Project Management)"
                                    maxLength={50}
                                />
                                <Button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                                >
                                    Add
                                </Button>
                            </div>

                            {jobData.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {jobData.skills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="px-3 py-1 bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="ml-2 text-indigo-600 hover:text-indigo-800"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-gray-500">
                                {jobData.skills.length}/20 skills added
                            </p>
                        </CardContent>
                    </Card>

                    {/* Application Details */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-indigo-500 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Application Details
                            </CardTitle>
                            <CardDescription className="text-indigo-100">
                                How candidates can apply
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={jobData.contactEmail}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="hr@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        name="applicationDeadline"
                                        value={jobData.applicationDeadline}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <Card className="shadow-sm border border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isFormValid()}
                                    className="px-10 py-5 text-lg bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Updating...
                                        </div>
                                    ) : (
                                        "Update Job Listing"
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}