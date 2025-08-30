import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowBigLeft,
    Briefcase,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    Edit,
    AlertCircle,
    Loader2,
    Clock,
    Building,
    Mail,
    Globe,
    CheckCircle,
    XCircle,
    PauseCircle
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import JobService, { type PostJob } from "@/services/job.service"



export default function CompanyViewJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<PostJob | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) {
                setError("Job ID is required")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError("")

                const jobData = await JobService.getJobById(id)

                if (!jobData) {
                    setError("Job not found")
                    return
                }

                setJob(jobData)
            } catch (error: any) {
                console.error("Error fetching job:", error)
                setError(error.message || "Failed to fetch job details")
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [id])

    const getStatusIcon = (status: string | undefined) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-5 h-5 text-green-600" />
            case 'inactive':
                return <PauseCircle className="w-5 h-5 text-yellow-600" />
            case 'closed':
                return <XCircle className="w-5 h-5 text-red-600" />
            default:
                return <CheckCircle className="w-5 h-5 text-green-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'closed':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const formatSalary = (min: string, max: string, currency: string) => {
        if (!min && !max) return "Salary not specified"
        const formatter = new Intl.NumberFormat('en-US')
        if (min && max) return `${currency} ${formatter.format(parseInt(min))} - ${formatter.format(parseInt(max))}`
        if (min) return `${currency} ${formatter.format(parseInt(min))}+`
        if (max) return `Up to ${currency} ${formatter.format(parseInt(max))}`
    }

    const formatDate = (date: any) => {
        if (!date) return "Not specified"

        // Handle Firebase timestamp
        let dateObj: Date
        if (date.toDate && typeof date.toDate === 'function') {
            dateObj = date.toDate()
        } else if (date instanceof Date) {
            dateObj = date
        } else if (typeof date === 'string') {
            dateObj = new Date(date)
        } else {
            return "Invalid date"
        }

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="py-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link to="/company/jobs">
                            <Button variant="outline" className="mb-6">
                                <ArrowBigLeft className="mr-2 w-4 h-4" /> Back to Jobs
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
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="py-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link to="/company/jobs">
                            <Button variant="outline" className="mb-6">
                                <ArrowBigLeft className="mr-2 w-4 h-4" /> Back to Jobs
                            </Button>
                        </Link>
                        <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                {error || "Job not found"}
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <Link to="/company/jobs">
                            <Button variant="outline" className="mb-6">
                                <ArrowBigLeft className="mr-2 w-4 h-4" /> Back to Jobs
                            </Button>
                        </Link>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = `/company/jobs/${job.id}/applications`}
                            >
                                <Users className="mr-2 w-4 h-4" />
                                View Applications ({job.applicationsCount || 0})
                            </Button>
                            <Button
                                className="bg-indigo-500 hover:bg-indigo-600"
                                onClick={() => navigate(`/company/jobs/${job.id}/edit`)}
                            >
                                <Edit className="mr-2 w-4 h-4" />
                                Edit Job
                            </Button>
                        </div>
                    </div>

                    {/* Job Header Card */}
                    <Card className="mb-6 shadow-sm">
                        <CardHeader className="pb-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-4">
                                        {getStatusIcon(job.status || "active")}
                                        <div>
                                            <CardTitle className="text-3xl text-gray-900 mb-2">
                                                {job.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-lg text-gray-600 mb-3">
                                                <Building className="w-5 h-5" />
                                                {job.company.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{job.jobLocation}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="capitalize">{job.jobType} • {job.workMode}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Posted {formatDate(job.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Badge className={`${getStatusColor(job.status || 'active')} border capitalize px-3 py-1 text-sm font-medium`}>
                                    {job.status || 'active'}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900">{job.applicationsCount || 0}</div>
                                    <div className="text-sm text-gray-600">Applications</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900 capitalize">{job.experienceLevel}</div>
                                    <div className="text-sm text-gray-600">Experience Level</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900">{job.department}</div>
                                    <div className="text-sm text-gray-600">Department</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Job Description */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" />
                                        Job Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                                        {job.description}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Requirements */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Requirements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                                        {job.requirements}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Responsibilities */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Responsibilities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                                        {job.responsibilities}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Benefits */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="w-5 h-5" />
                                        Benefits & Perks
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                                        {job.benefits}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Job Details */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Job Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Job Type</div>
                                        <div className="capitalize">{job.jobType}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Work Mode</div>
                                        <div className="capitalize">{job.workMode}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Experience Level</div>
                                        <div className="capitalize">{job.experienceLevel}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Department</div>
                                        <div>{job.department}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Salary Range</div>
                                        <div>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Skills */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Required Skills</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Application Info */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Application Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Contact Email</div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <a href={`mailto:${job.contactEmail}`} className="text-indigo-600 hover:underline">
                                                {job.contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                    {job.applicationDeadline && (
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Application Deadline</div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {formatDate(new Date(job.applicationDeadline))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Posted Date</div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(job.createdAt)}
                                        </div>
                                    </div>
                                    {job.updatedAt && job.createdAt && (() => {
                                        // Handle Firebase timestamp comparison
                                        const getTimestamp = (date: any) => {
                                            if (date?.toDate && typeof date.toDate === 'function') {
                                                return date.toDate().getTime()
                                            } else if (date instanceof Date) {
                                                return date.getTime()
                                            } else if (typeof date === 'string') {
                                                return new Date(date).getTime()
                                            }
                                            return 0
                                        }

                                        const updatedTime = getTimestamp(job.updatedAt)
                                        const createdTime = getTimestamp(job.createdAt)

                                        return updatedTime !== createdTime
                                    })() && (
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">Last Updated</div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    {formatDate(job.updatedAt)}
                                                </div>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}