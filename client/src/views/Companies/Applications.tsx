import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileUser, Briefcase, Calendar, Mail, ArrowLeft, Eye, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Link } from "react-router-dom"
import JobService, { type JobApplication, type PostJob } from "@/services/job.service"
import NotificationService from "@/components/Notification"

interface JobWithApplications extends PostJob {
    applications: JobApplication[]
}

export default function CompanyApplications() {
    const [jobsWithApplications, setJobsWithApplications] = useState<JobWithApplications[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Filter applications based on search and status
    const filteredApplications = jobsWithApplications.flatMap(job =>
        job.applications
            .filter(app => {
                const matchesSearch =
                    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.title.toLowerCase().includes(searchTerm.toLowerCase())

                const matchesStatus = selectedStatus === "all" || app.status === selectedStatus

                return matchesSearch && matchesStatus
            })
            .map(app => ({ ...app, jobTitle: job.title, jobId: job.id }))
    )

    // Calculate stats
    const totalApplications = jobsWithApplications.reduce((sum, job) => sum + job.applications.length, 0)
    const pendingApplications = jobsWithApplications.reduce((sum, job) =>
        sum + job.applications.filter(app => app.status === 'pending').length, 0
    )
    const reviewedApplications = jobsWithApplications.reduce((sum, job) =>
        sum + job.applications.filter(app => app.status === 'reviewed').length, 0
    )

    const fetchJobsAndApplications = async () => {
        setIsLoading(true)
        try {
            // Get all company jobs
            const jobs = await JobService.getCompanyJobs()

            // Get applications for each job
            const jobsWithApps: JobWithApplications[] = await Promise.all(
                jobs.map(async (job) => {
                    if (job.id) {
                        const applications = await JobService.getJobApplications(job.id)
                        return { ...job, applications }
                    }
                    return { ...job, applications: [] }
                })
            )

            setJobsWithApplications(jobsWithApps)
        } catch (error) {
            console.error("Error fetching jobs and applications:", error)
            NotificationService.error("Error", "Failed to load applications")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchJobsAndApplications()
    }, [])

    const handleStatusUpdate = async (applicationId: string, newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
        setActionLoading(true)
        try {
            await JobService.updateApplicationStatus(applicationId, newStatus)
            await fetchJobsAndApplications() // Refresh data
            NotificationService.success("Success", `Application ${newStatus} successfully`)
        } catch (error) {
            console.error("Error updating application status:", error)
            NotificationService.error("Error", "Failed to update application status")
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
            case 'reviewed':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Eye className="w-3 h-3 mr-1" />Reviewed</Badge>
            case 'accepted':
                return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>
            case 'rejected':
                return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatDate = (date: any) => {
        if (!date) return "N/A"

        // Handle Firebase timestamp
        if (date.toDate && typeof date.toDate === 'function') {
            return date.toDate().toLocaleDateString()
        }

        // Handle regular date
        return new Date(date).toLocaleDateString()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4">
                    <Link to="/company/dashboard">
                        <Button variant="outline" className="self-start">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <FileUser className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Applications</h1>
                            <p className="text-gray-600 dark:text-gray-300">Manage and review applications for your job postings</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileUser className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Applications</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Pending Review</p>
                                        <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Reviewed</p>
                                        <p className="text-2xl font-bold text-gray-900">{reviewedApplications}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Briefcase className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Active Jobs</p>
                                        <p className="text-2xl font-bold text-gray-900">{jobsWithApplications.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Search and Filter */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                        <h2 className="font-bold mb-4 text-2xl">Search & Filter</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by applicant name, email, or job title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Applications Table */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Applications ({filteredApplications.length})</CardTitle>
                        <CardDescription>All applications received for your job postings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Job Title</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Applied Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        // Loading placeholder rows
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <TableRow key={`loading-${index}`}>
                                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredApplications.length === 0 ? (
                                        // Empty state
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <FileUser className="h-12 w-12 text-gray-400" />
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900 dark:text-white">No applications found</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {searchTerm || selectedStatus !== "all"
                                                                ? "Try adjusting your search or filter criteria"
                                                                : "No applications have been received yet"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        // Display applications
                                        filteredApplications.map((application) => (
                                            <TableRow key={application.id} className="hover:bg-gray-50/50">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <FileUser className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{application.applicantName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{application.jobTitle}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{application.applicantEmail}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {formatDate(application.appliedAt)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(application.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {/* View Application Details */}
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>Application Details</DialogTitle>
                                                                    <DialogDescription>
                                                                        Review application from {application.applicantName}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="text-sm font-medium text-gray-700">Applicant Name</label>
                                                                            <p className="text-sm text-gray-900">{application.applicantName}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                                                            <p className="text-sm text-gray-900">{application.applicantEmail}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-sm font-medium text-gray-700">Job Title</label>
                                                                            <p className="text-sm text-gray-900">{application.jobTitle}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-sm font-medium text-gray-700">Applied Date</label>
                                                                            <p className="text-sm text-gray-900">{formatDate(application.appliedAt)}</p>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-sm font-medium text-gray-700">Status</label>
                                                                            <div className="mt-1">{getStatusBadge(application.status)}</div>
                                                                        </div>
                                                                    </div>

                                                                    {application.coverLetter && (
                                                                        <div>
                                                                            <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                                                                            <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                                                                <p className="text-sm text-gray-900 whitespace-pre-wrap">{application.coverLetter}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {application.resume && (
                                                                        <div>
                                                                            <label className="text-sm font-medium text-gray-700">Resume</label>
                                                                            <div className="mt-1">
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="text-blue-600 hover:text-blue-700"
                                                                                    onClick={() => window.open(application.resume, '_blank')}
                                                                                >
                                                                                    <Download className="h-4 w-4 mr-2" />
                                                                                    Download Resume
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>

                                                        {/* Accept Application */}
                                                        {application.status !== 'accepted' && (
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        disabled={actionLoading}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Accept Application</DialogTitle>
                                                                        <DialogDescription>
                                                                            Are you sure you want to accept the application from {application.applicantName}?
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <DialogClose asChild>
                                                                            <Button variant="outline">Cancel</Button>
                                                                        </DialogClose>
                                                                        <DialogClose asChild>
                                                                            <Button
                                                                                onClick={() => handleStatusUpdate(application.id!, 'accepted')}
                                                                                className="bg-green-600 hover:bg-green-700"
                                                                            >
                                                                                Accept
                                                                            </Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}

                                                        {/* Reject Application */}
                                                        {application.status !== 'rejected' && application.status !== 'accepted' && (
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        disabled={actionLoading}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Reject Application</DialogTitle>
                                                                        <DialogDescription>
                                                                            Are you sure you want to reject the application from {application.applicantName}?
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <DialogClose asChild>
                                                                            <Button variant="outline">Cancel</Button>
                                                                        </DialogClose>
                                                                        <DialogClose asChild>
                                                                            <Button
                                                                                onClick={() => handleStatusUpdate(application.id!, 'rejected')}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Reject
                                                                            </Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}

                                                        {/* Mark as Reviewed */}
                                                        {application.status === 'pending' && (
                                                            <Button
                                                                disabled={actionLoading}
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                onClick={() => handleStatusUpdate(application.id!, 'reviewed')}
                                                            >
                                                                Mark Reviewed
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}