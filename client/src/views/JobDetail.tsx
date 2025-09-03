"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    AlertCircle,
    Loader2,
    Clock,
    Building2,
    Mail,
    Globe,
    CheckCircle,
    Send,
    Share2,
    Tag,
    FileText,
    Lock,
    LogIn,
    Upload,
    X,
    ExternalLink,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import JobService, { type PostJob, type JobApplication } from "@/services/job.service"
import AuthService from "@/services/auth.service"
import UploadService from "@/services/upload.service"
import Logo from "@/components/Logo"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import NotificationService from "@/components/Notification"

export default function JobDetail() {
    // Context
    const { isAuthenticated, userType } = useAuth()
    const { id } = useParams()
    const [job, setJob] = useState<PostJob | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [applying, setApplying] = useState(false)
    const [showApplicationModal, setShowApplicationModal] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [uploadingResume, setUploadingResume] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [applicationData, setApplicationData] = useState({
        applicantName: "",
        applicantEmail: "",
        coverLetter: "",
        resume: "", // This will store the Cloudinary URL
        resumeFileName: ""
    })

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

                // Pre-fill user data if authenticated
                const userEmail = AuthService.getUserEmail()
                const userData = AuthService.getAuthenticatedUserData();
                if (userEmail) {
                    setApplicationData(prev => ({
                        ...prev,
                        applicantEmail: userEmail,
                        applicantName: userData.name || ""
                    }))
                }

                const userId = AuthService.getAuthenticatedUserId();

                // 👉 Check if user has already applied
                if (isAuthenticated && userType === "Student" && userId) {
                    const applications = await JobService.getApplicationsByUser(userId)
                    const hasUserApplied = applications.some(app => app.jobId === id)
                    if (hasUserApplied) {
                        setHasApplied(true)
                        setApplicationStatus(applications.find(app => app.jobId === id)?.status || 'pending')
                    }
                }
            } catch (error: any) {
                console.error("Error fetching job:", error)
                setError(error.message || "Failed to fetch job details")
            } finally {
                setLoading(false)
            }
        }
        fetchJob()
    }, [id, isAuthenticated, userType])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!UploadService.isValidResumeFile(file)) {
            toast.error("Invalid file format. Please upload a PDF or DOCX file.");
            return;
        }

        setResumeFile(file);
        setApplicationData(prev => ({
            ...prev,
            resumeFileName: file.name
        }));
    };

    const handleRemoveFile = () => {
        setResumeFile(null);
        setApplicationData(prev => ({
            ...prev,
            resumeFileName: "",
            resume: ""
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleApply = async () => {
        if (!job?.id) return;
        if (!isAuthenticated) {
            NotificationService.error("Login Required", "You need to login first in order to apply");
            return;
        }
        // Validate required fields
        if (!applicationData.applicantName || !applicationData.applicantEmail || !resumeFile) {
            NotificationService.error("Please fill in all required fields and upload your resume");
            return;
        }
        const userId = AuthService.getAuthenticatedUserId();

        if (userId == null) {
            NotificationService.error("Login Required", "You need to login first in order to apply");
        }

        try {
            setApplying(true);
            let resumeUrl: string;

            // Upload the resume file
            setUploadingResume(true);
            try {
                resumeUrl = await UploadService.uploadFile(resumeFile);
                console.log("RESUME URL: ", resumeUrl);
                // Ensure we have a valid URL
                if (!resumeUrl || resumeUrl.trim() === "") {
                    throw new Error("Upload service returned invalid URL");
                }

                toast.success("Resume uploaded successfully");
            } catch (error) {
                console.error("Error uploading resume:", error);
                toast.error("Failed to upload resume. Please try again.");
                setApplying(false);
                setUploadingResume(false);
                return;
            } finally {
                setUploadingResume(false);
            }

            const userData = AuthService.getAuthenticatedUserData();
            const application: Omit<JobApplication, 'id' | 'appliedAt'> = {
                companyId: userId!,
                jobId: job.id,
                applicantName: applicationData.applicantName,
                applicantEmail: applicationData.applicantEmail,
                coverLetter: applicationData.coverLetter || "", // Ensure not undefined
                resume: resumeUrl, // Now guaranteed to be a valid string
                status: 'pending',
                applicantId: userData.uid || ''
            };

            await JobService.applyForJob(application);
            toast.success("Application submitted successfully!");
            setShowApplicationModal(false);
            setHasApplied(true);
            setApplicationStatus('pending');

            // Update job data to reflect new application count
            if (job) {
                setJob({
                    ...job,
                    applicationsCount: (job.applicationsCount || 0) + 1
                });
            }
        } catch (error: any) {
            console.error("Error applying for job:", error);
            toast.error(error.message || "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    const formatSalary = (min: string, max: string, currency: string) => {
        if (!min && !max) return "Salary not specified"
        const formatter = new Intl.NumberFormat('en-US')
        if (min && max) return `${currency} ${formatter.format(parseInt(min))} - ${formatter.format(parseInt(max))}`
        if (min) return `${currency} ${formatter.format(parseInt(min))}+`
        if (max) return `Up to ${currency} ${formatter.format(parseInt(max))}`
    }

    const formatDate = (date: any) => {
        if (!date) return "Not specified"

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

    const getTimeAgo = (date: any) => {
        if (!date) return "Recently"

        let dateObj: Date
        if (date.toDate && typeof date.toDate === 'function') {
            dateObj = date.toDate()
        } else if (date instanceof Date) {
            dateObj = date
        } else if (typeof date === 'string') {
            dateObj = new Date(date)
        } else {
            return "Recently"
        }

        const now = new Date()
        const diffTime = Math.abs(now.getTime() - dateObj.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return "1 day ago"
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
        return formatDate(date)
    }

    const isDeadlinePassed = () => {
        if (!job?.applicationDeadline) return false
        const deadline = new Date(job.applicationDeadline)
        return deadline < new Date()
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: job?.title,
                    text: `Check out this job opportunity: ${job?.title} at ${job?.company.name}`,
                    url: window.location.href,
                })
            } catch (error) {
                // Fallback to copying to clipboard
                navigator.clipboard.writeText(window.location.href)
                toast.success("Job link copied to clipboard!")
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Job link copied to clipboard!")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center space-x-4">
                            <Logo logoOnly />
                            <span className="text-3xl font-light">Job Details</span>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading job details...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center space-x-4">
                            <Logo logoOnly />
                            <span className="text-3xl font-light">Job Details</span>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12">
                    <Link to="/jobs">
                        <Button variant="outline" className="mb-6">
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Jobs
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
        )
    }

    return (
        <div className="min-h-screen bg-background pt-18">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Logo logoOnly />
                            <span className="text-2xl lg:text-3xl font-light">Job Details</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Share</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                {/* Back Button */}
                <Link to="/jobs">
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Jobs
                    </Button>
                </Link>

                {/* Job Header Card */}
                <Card className="mb-6 shadow-sm">
                    <CardHeader className="pb-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-3 bg-indigo-100 rounded-lg">
                                        <Briefcase className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl lg:text-3xl text-foreground mb-2">
                                            {job.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-lg text-muted-foreground mb-3">
                                            <Building2 className="w-5 h-5" />
                                            <span className="font-medium">{job.company.name}</span>
                                            {job.company.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{job.company.location}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="outline" className="text-xs">
                                                {job.jobType}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {job.workMode}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {job.experienceLevel}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.jobLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="font-medium text-green-600">
                                            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>{job.applicationsCount || 0} applicants</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>Posted {getTimeAgo(job.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 lg:min-w-[200px]">
                                {userType == "Student" && (
                                    <>
                                        {isDeadlinePassed() ? (
                                            <Button disabled className="w-full">
                                                <AlertCircle className="mr-2 w-4 h-4" />
                                                Application Closed
                                            </Button>
                                        ) : hasApplied ? (
                                            <Button disabled className="w-full bg-green-500">
                                                <CheckCircle className="mr-2 w-4 h-4" />
                                                {applicationStatus === 'pending' ? 'Applied (Pending)' :
                                                    applicationStatus === 'accepted' ? 'Application Accepted' :
                                                        applicationStatus === 'rejected' ? 'Application Rejected' : 'Applied'}
                                            </Button>
                                        ) : (
                                            <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                                                        <Send className="mr-2 w-4 h-4" />
                                                        Apply Now
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    {isAuthenticated ? (
                                                        <>
                                                            <DialogHeader>
                                                                <DialogTitle className="text-3xl mb-3">Apply for {job.title}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <Label htmlFor="name">Full Name *</Label>
                                                                    <Input
                                                                        id="name"
                                                                        value={applicationData.applicantName}
                                                                        onChange={(e) => setApplicationData(prev => ({
                                                                            ...prev,
                                                                            applicantName: e.target.value
                                                                        }))}
                                                                        placeholder="Your full name"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="email">Email Address *</Label>
                                                                    <Input
                                                                        id="email"
                                                                        type="email"
                                                                        value={applicationData.applicantEmail}
                                                                        onChange={(e) => setApplicationData(prev => ({
                                                                            ...prev,
                                                                            applicantEmail: e.target.value
                                                                        }))}
                                                                        placeholder="your.email@example.com"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="resumeUpload">Resume/CV (PDF or DOCX) *</Label>
                                                                    <div className="mt-1">
                                                                        {applicationData.resumeFileName ? (
                                                                            <div className="flex items-center justify-between p-2 border rounded-md bg-slate-50">
                                                                                <div className="flex items-center">
                                                                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                                                                    <span className="text-sm truncate max-w-[200px]">
                                                                                        {applicationData.resumeFileName}
                                                                                    </span>
                                                                                </div>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={handleRemoveFile}
                                                                                    type="button"
                                                                                >
                                                                                    <X className="h-4 w-4 text-gray-500" />
                                                                                </Button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md border-gray-300 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                                                <div className="space-y-1 text-center">
                                                                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                                                                    <div className="text-sm text-gray-600">
                                                                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                                                            <span>Upload a file</span>
                                                                                        </label>
                                                                                        <p className="pl-1">or drag and drop</p>
                                                                                    </div>
                                                                                    <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                                                                                </div>
                                                                                <input
                                                                                    ref={fileInputRef}
                                                                                    id="resumeUpload"
                                                                                    name="resumeUpload"
                                                                                    type="file"
                                                                                    className="sr-only"
                                                                                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                                                    onChange={handleFileChange}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="coverLetter">Cover Letter</Label>
                                                                    <Textarea
                                                                        id="coverLetter"
                                                                        value={applicationData.coverLetter}
                                                                        onChange={(e) => setApplicationData(prev => ({
                                                                            ...prev,
                                                                            coverLetter: e.target.value
                                                                        }))}
                                                                        placeholder="Tell us why you're interested in this position..."
                                                                        rows={4}
                                                                    />
                                                                </div>
                                                                <div className="flex gap-2 pt-4">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => setShowApplicationModal(false)}
                                                                        className="flex-1"
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        onClick={handleApply}
                                                                        disabled={applying || uploadingResume || !applicationData.applicantName || !applicationData.applicantEmail || !resumeFile}
                                                                        className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                                                    >
                                                                        {applying ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                                                Submitting...
                                                                            </>
                                                                        ) : uploadingResume ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                                                Uploading Resume...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Send className="mr-2 w-4 h-4" />
                                                                                Submit Application
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DialogHeader>
                                                                <DialogTitle className="text-2xl font-bold text-center">
                                                                    <Lock className="w-12 h-12 mx-auto mb-2 text-indigo-500" />
                                                                    Login Required
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="p-6 text-center space-y-4">
                                                                <p className="text-lg text-muted-foreground">
                                                                    You need to login first to apply for this position.
                                                                </p>
                                                                <div className="flex flex-col gap-3">
                                                                    <Link to="/login">
                                                                        <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                                                                            <LogIn className="w-4 h-4 mr-2" />
                                                                            Login to Continue
                                                                        </Button>
                                                                    </Link>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        Don't have an account?{" "}
                                                                        <Link to="/register" className="text-indigo-500 hover:underline">
                                                                            Sign up
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                        {job.applicationDeadline && (
                                            <div className="text-center text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                Deadline: {formatDate(new Date(job.applicationDeadline))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Description */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Job Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
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
                                <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
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
                                <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
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
                                <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
                                    {job.benefits}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Company Info */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    About {job.company.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Company</div>
                                    <div className="flex gap-2 items-center">
                                        <div className="font-medium">{job.company.name}</div>
                                        {userType == "Student" && (
                                            <Button size="icon" className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
                                                <Link to={`/user/find-company/${job.companyId}`}>
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Location</div>
                                    <div>{job.company.location || job.jobLocation}</div>
                                </div>
                                {job.company.email && (
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground">Contact</div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <a href={`mailto:${job.company.email}`} className="text-indigo-600 hover:underline text-sm">
                                                {job.company.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Job Details */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Job Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Job Type</div>
                                    <div className="capitalize">{job.jobType}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Work Mode</div>
                                    <div className="capitalize">{job.workMode}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Experience Level</div>
                                    <div className="capitalize">{job.experienceLevel}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Department</div>
                                    <div>{job.department}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Salary Range</div>
                                    <div className="font-medium text-green-600">
                                        {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Required Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
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
                                    <div className="text-sm font-medium text-muted-foreground">Contact Email</div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <a href={`mailto:${job.contactEmail}`} className="text-indigo-600 hover:underline text-sm">
                                            {job.contactEmail}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Applicants</div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{job.applicationsCount || 0} people applied</span>
                                    </div>
                                </div>
                                {job.applicationDeadline && (
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground">Application Deadline</div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className={`text-sm ${isDeadlinePassed() ? 'text-red-600 font-medium' : ''}`}>
                                                {formatDate(new Date(job.applicationDeadline))}
                                                {isDeadlinePassed() && " (Expired)"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Posted Date</div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{formatDate(job.createdAt)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}