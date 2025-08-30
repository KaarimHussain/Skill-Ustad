"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link } from "react-router-dom"
import { ArrowBigLeft, Briefcase, MapPin, Calendar, DollarSign, Users, Eye, Edit, AlertCircle, Loader2, Plus } from "lucide-react"
import JobService, { type PostJob } from "@/services/job.service"
import { format } from "date-fns"

export default function CompanyJobs() {
    const [jobs, setJobs] = useState<PostJob[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const companyJobs = await JobService.getCompanyJobs()
            setJobs(companyJobs)
        } catch (error: any) {
            console.error("Error fetching jobs:", error)
            setError(error.message || "Failed to fetch jobs")
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800'
            case 'closed':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatSalary = (min: string, max: string, currency: string) => {
        if (!min && !max) return "Salary not specified"
        if (min && max) return `${currency} ${min} - ${max}`
        if (min) return `${currency} ${min}+`
        if (max) return `Up to ${currency} ${max}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="py-10">
                    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link to="/company/dashboard">
                            <Button variant="outline">
                                <ArrowBigLeft className="mr-2" /> Go Back
                            </Button>
                        </Link>
                        <div className="flex justify-between items-center mt-3">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">Your Jobs</h1>
                            <Link to="/company/jobs/create">
                                <Button className="bg-indigo-500 hover:bg-indigo-600">
                                    <Plus className="mr-2 w-4 h-4" />
                                    Create a Job
                                </Button>
                            </Link>
                        </div>
                    </header>
                    <main>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                            <div className="flex justify-center items-center py-20">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
                                    <p className="text-gray-600">Loading your job listings...</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="py-10">
                <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/company/dashboard">
                        <Button variant="outline">
                            <ArrowBigLeft className="mr-2" /> Go Back
                        </Button>
                    </Link>
                    <div className="flex justify-between items-center mt-3">
                        <div>
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">Your Jobs</h1>
                            <p className="text-gray-600 mt-1">
                                {jobs.length} {jobs.length === 1 ? 'job listing' : 'job listings'}
                            </p>
                        </div>
                        <Link to="/company/jobs/create">
                            <Button className="bg-indigo-500 hover:bg-indigo-600">
                                <Plus className="mr-2 w-4 h-4" />
                                Create a Job
                            </Button>
                        </Link>
                    </div>
                </header>

                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                        {error && (
                            <Alert className="mb-6 border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">{error}</AlertDescription>
                            </Alert>
                        )}

                        {jobs.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                                    <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No job listings yet</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Start building your team by creating your first job listing. Attract top talent and grow your company.
                                </p>
                                <Link to="/company/jobs/create">
                                    <Button className="bg-indigo-500 hover:bg-indigo-600">
                                        <Plus className="mr-2 w-4 h-4" />
                                        Create Your First Job
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {jobs.map((job) => (
                                    <Card key={job.id} className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-3xl text-gray-900 mb-2">
                                                                {job.title}
                                                            </CardTitle>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    {job.jobLocation}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Briefcase className="w-4 h-4" />
                                                                    {job.jobType}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {job.createdAt ? format(job.createdAt.toDate(), "MMM dd, yyyy") : "Date not available"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge className={`${getStatusColor(job.status || 'active')} capitalize`}>
                                                            {job.status || 'active'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <DollarSign className="w-4 h-4" />
                                                        <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Users className="w-4 h-4" />
                                                        <span>{job.applicationsCount || 0} applications</span>
                                                    </div>

                                                    {job.department && (
                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-medium">Department:</span> {job.department}
                                                        </div>
                                                    )}

                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Experience:</span> {job.experienceLevel}
                                                    </div>
                                                </div>

                                                {job.skills && job.skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.skills.slice(0, 6).map((skill, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {job.skills.length > 6 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{job.skills.length - 6} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="text-sm text-gray-700 line-clamp-2">
                                                    {job.description}
                                                </div>

                                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                    <div className="text-sm text-gray-500">
                                                        {job.applicationDeadline && (
                                                            <span>
                                                                Deadline: {format(new Date(job.applicationDeadline), "MMM dd, yyyy")}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <Link to={`/company/jobs/${job.id}`}>
                                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                                <Eye className="w-4 h-4" />
                                                                View Applications
                                                            </Button>
                                                        </Link>

                                                        <Link to={`/company/jobs/${job.id}/edit`}>
                                                            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2">
                                                                <Edit className="w-4 h-4" />
                                                                Edit Post
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {jobs.length > 0 && (
                            <div className="mt-8 text-center">
                                <Link to="/company/jobs/create">
                                    <Button variant="outline" className="bg-white hover:bg-gray-50">
                                        <Plus className="mr-2 w-4 h-4" />
                                        Create Another Job
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}