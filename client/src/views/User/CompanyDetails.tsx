import FormatDate from "@/components/FormatDate"
import NotificationService from "@/components/Notification"
import Logo from "@/components/Logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building, Calendar, MapPin, Users, Briefcase, Link, Phone, User, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams, Link as RouteLink } from "react-router-dom"
import JobService, { type PostJob } from "@/services/job.service"

export default function UserCompanyDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [company, setCompany] = useState<any | null>(null)
    const [companyJob, setCompanyJob] = useState<PostJob[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCompany = async () => {
        const BASE_URL = import.meta.env.VITE_SERVER_URL

        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/user-data/company/${id}`)
            if (!response.ok) {
                throw new Error("Failed to fetch company details")
            }
            const data = await response.json()
            if (!data) {
                throw new Error("Company not found")
            }
            setCompany(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
            NotificationService.error("Failed to Load", err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchCompanyJob = async () => {
        const response = await JobService.getCompanyJobsById(id!);
        console.log("COMPANY JOB DATA:", response)
        setCompanyJob(response);
        setError(null)
    }

    useEffect(() => {
        if (id) {
            fetchCompany()
            fetchCompanyJob();
        } else {
            setError("Invalid company ID")
            setLoading(false)
        }
    }, [id])

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Company Details</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Building className="h-6 w-6 animate-spin" />
                        <span>Loading company details...</span>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !company) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Company Details</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate("/user/find-company")}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Companies
                            </Button>
                        </div>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Company</h3>
                            <p className="text-muted-foreground mb-4">{error || "Company not found"}</p>
                            <Button onClick={() => navigate("/user/find-company")} className="bg-indigo-500 hover:bg-indigo-600">
                                Back to Companies
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-18">
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Logo logoOnly />
                            <span className="text-2xl sm:text-3xl font-light">Company Details</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate("/user/find-company")}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Companies
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <Card className="max-w-5xl mx-auto bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-lg">
                    <CardHeader className="px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-400 border-4 border-white shadow-lg">
                                <Building className="w-12 h-12 sm:w-16 sm:h-16" />
                            </div>
                            <div className="text-center sm:text-left flex-1 min-w-0">
                                <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-balance leading-tight">
                                    <span className="block truncate" title={company.companyName}>
                                        {company.companyName}
                                    </span>
                                </CardTitle>
                                <p
                                    className="text-lg sm:text-xl text-indigo-600 font-medium mb-2 truncate"
                                    title={company.industry || "Industry Not Specified"}
                                >
                                    {company.industry || "Industry Not Specified"}
                                </p>
                                <p className="text-base text-gray-600 font-medium truncate" title={company.workEmail}>
                                    {company.workEmail}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 sm:px-8 pb-8">
                        <div className="space-y-8">
                            {/* Description */}
                            {company.companyDescription && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                        <p className="text-gray-700 leading-relaxed text-pretty">{company.companyDescription}</p>
                                    </div>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {company.city && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                                            <p className="text-gray-900 font-medium truncate" title={company.city}>
                                                {company.city}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {company.country && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Country</p>
                                            <p className="text-gray-900 font-medium truncate" title={company.country}>
                                                {company.country}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {company.businessType && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Business Type</p>
                                            <p className="text-gray-900 font-medium truncate" title={company.businessType}>
                                                {company.businessType}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {company.employeeCount && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Team Size</p>
                                            <p className="text-gray-900 font-medium">{company.employeeCount} Employees</p>
                                        </div>
                                    </div>
                                )}
                                {company.contactPersonName && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Contact Person</p>
                                            <p className="text-gray-900 font-medium truncate" title={company.contactPersonName}>
                                                {company.contactPersonName}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {company.contactPersonTitle && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Contact Title</p>
                                            <p className="text-gray-900 font-medium truncate" title={company.contactPersonTitle}>
                                                {company.contactPersonTitle}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Founded</p>
                                        <p className="text-gray-900 font-medium">{FormatDate(company.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            {(company.workPhone || company.website || company.linkedInUrl) && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {company.workPhone && (
                                            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Work Phone</p>
                                                    <p className="text-gray-900 font-medium truncate" title={company.workPhone}>
                                                        {company.workPhone}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {company.website && (
                                            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <Link className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Website</p>
                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 font-medium truncate hover:underline"
                                                        title={company.website}
                                                    >
                                                        {company.website}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {company.linkedInUrl && (
                                            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <Link className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">LinkedIn</p>
                                                    <a
                                                        href={company.linkedInUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 font-medium truncate hover:underline"
                                                        title={company.linkedInUrl}
                                                    >
                                                        {company.linkedInUrl}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Industry */}
                            {company.industry && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry</h3>
                                    <Badge
                                        variant="secondary"
                                        className="bg-emerald-100 text-emerald-800 text-base font-medium px-4 py-2 rounded-lg"
                                    >
                                        {company.industry}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                {/* Display Company Avalible Jobs */}
                <div className="container mx-auto">
                    <div className="space-y-8">
                        <Card className="max-w-5xl mx-auto mt-6 bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-lg">
                            <CardHeader className="px-6 sm:px-8 pt-6 pb-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Briefcase className="w-6 h-6 text-indigo-600" />
                                    Available Jobs
                                    {companyJob && companyJob.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
                                        >
                                            {companyJob.length} {companyJob.length === 1 ? "Position" : "Positions"}
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 sm:px-8 pb-8">
                                {!companyJob || companyJob.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Jobs</h3>
                                        <p className="text-gray-600 text-pretty">
                                            This company doesn't have any job openings at the moment. Check back later for new opportunities!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {companyJob.map((job) => (
                                            <RouteLink to={`/jobs/${job.id}`}>
                                                <Card
                                                    key={job.id}
                                                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <CardTitle className="text-3xl font-bold text-gray-900 mb-2 text-balance leading-tight">
                                                                    {job.title}
                                                                </CardTitle>
                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    {job.jobType && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 border-blue-200"
                                                                        >
                                                                            {job.jobType}
                                                                        </Badge>
                                                                    )}
                                                                    {job.workMode && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 border-green-200"
                                                                        >
                                                                            {job.workMode}
                                                                        </Badge>
                                                                    )}
                                                                    {job.experienceLevel && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-700 border-purple-200"
                                                                        >
                                                                            {job.experienceLevel}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {job.status && (
                                                                <Badge
                                                                    variant={job.status === "active" ? "default" : "secondary"}
                                                                    className={`text-xs font-medium px-2 py-1 ${job.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                                                                        }`}
                                                                >
                                                                    {job.status}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="pt-0">
                                                        <div className="space-y-3">
                                                            {/* Location and Department */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {job.jobLocation && (
                                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                        <span className="truncate" title={job.jobLocation}>
                                                                            {job.jobLocation}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {job.department && (
                                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                        <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                        <span className="truncate" title={job.department}>
                                                                            {job.department}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Salary Range */}
                                                            {(job.salaryMin || job.salaryMax) && (
                                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                                                    <span className="text-gray-500"><DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" /></span>
                                                                    <span>
                                                                        {job.currency || "$"}{" "}
                                                                        {job.salaryMin && job.salaryMax
                                                                            ? `${job.salaryMin} - ${job.salaryMax}`
                                                                            : job.salaryMin || job.salaryMax}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Description Preview */}
                                                            {job.description && (
                                                                <p className="text-sm text-gray-600 line-clamp-2 text-pretty">{job.description}</p>
                                                            )}

                                                            {/* Skills */}
                                                            {job.skills && job.skills.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-3">
                                                                    {job.skills.slice(0, 3).map((skill, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant="secondary"
                                                                            className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                                                                        >
                                                                            {skill}
                                                                        </Badge>
                                                                    ))}
                                                                    {job.skills.length > 3 && (
                                                                        <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                                                                            +{job.skills.length - 3} more
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Footer with Application Info */}
                                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    {job.createdAt && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Calendar className="w-3 h-3" />
                                                                            <span>Posted {FormatDate(job.createdAt)}</span>
                                                                        </div>
                                                                    )}
                                                                    {job.applicationsCount !== undefined && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Users className="w-3 h-3" />
                                                                            <span>{job.applicationsCount} applicants</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {job.applicationDeadline && (
                                                                    <div className="text-xs text-orange-600 font-medium">
                                                                        Deadline: {FormatDate(job.applicationDeadline)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </RouteLink>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}