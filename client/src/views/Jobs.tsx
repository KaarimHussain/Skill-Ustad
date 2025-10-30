"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Filter,
    Clock,
    MapPin,
    Building2,
    DollarSign,
    Users,
    Briefcase,
    Loader2,
    RefreshCw,
    Calendar,
    Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Logo from "@/components/Logo"
import { Link } from "react-router-dom"
import JobService, { type PostJob } from "@/services/job.service"
import FormatDate from "@/components/FormatDate"

export default function Jobs() {
    const [jobs, setJobs] = useState<PostJob[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [refreshing, setRefreshing] = useState(false)
    const fetchJobs = async () => {
        try {
            setLoading(true)
            const jobData = await JobService.getAllActiveJobs()
            setJobs(jobData)
            setError(null)
        } catch (err) {
            setError("Failed to fetch jobs")
            console.error("Error fetching jobs:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchJobs()
        setRefreshing(false)
    }

    // Filter jobs based on search and active filter
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "remote" && job.workMode.toLowerCase() === "remote") ||
            (activeFilter === "full-time" && job.jobType.toLowerCase() === "full-time") ||
            (activeFilter === "part-time" && job.jobType.toLowerCase() === "part-time") ||
            (activeFilter === "contract" && job.jobType.toLowerCase() === "contract")

        return matchesSearch && matchesFilter
    })

    // Sort jobs based on selected sort option
    const sortedJobs = [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
            case "salary":
                const salaryA = parseInt(a.salaryMax) || 0
                const salaryB = parseInt(b.salaryMax) || 0
                return salaryB - salaryA
            case "company":
                return a.company.name.localeCompare(b.company.name)
            case "newest":
            default:
                const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
                const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
                return dateB.getTime() - dateA.getTime()
        }
    })

    // Calculate filter counts
    const filterOptions = [
        { id: "all", label: "All Jobs", count: jobs.length },
        { id: "remote", label: "Remote", count: jobs.filter((j) => j.workMode.toLowerCase() === "remote").length },
        { id: "full-time", label: "Full Time", count: jobs.filter((j) => j.jobType.toLowerCase() === "full-time").length },
        { id: "part-time", label: "Part Time", count: jobs.filter((j) => j.jobType.toLowerCase() === "part-time").length },
        { id: "contract", label: "Contract", count: jobs.filter((j) => j.jobType.toLowerCase() === "contract").length },
    ]

    // Get popular skills from all jobs
    const getPopularSkills = () => {
        const skillCounts: { [key: string]: number } = {}
        jobs.forEach((job) => {
            job.skills.forEach((skill) => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1
            })
        })

        return Object.entries(skillCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([skill]) => skill)
    }

    // Format salary range
    const formatSalary = (job: PostJob) => {
        if (!job.salaryMin && !job.salaryMax) return null
        const min = job.salaryMin ? parseInt(job.salaryMin).toLocaleString() : "0"
        const max = job.salaryMax ? parseInt(job.salaryMax).toLocaleString() : "0"
        return `${job.currency || "$"}${min} - ${job.currency || "$"}${max}`
    }

    // Format date
    const formatDate = (date: any) => {
        if (!date) return "Recently"
        const jobDate = date.toDate ? date.toDate() : new Date(date)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - jobDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return "1 day ago"
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
        return jobDate.toLocaleDateString()
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Jobs</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading jobs...</span>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Jobs</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Jobs</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <Button onClick={handleRefresh} className="bg-indigo-500 hover:bg-indigo-600" disabled={refreshing}>
                                {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-18">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm top-18 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-2xl lg:text-3xl font-light">Jobs</span>
                            </div>

                            {/* Mobile buttons */}
                            <div className="flex lg:hidden items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="flex-1 lg:max-w-2xl lg:mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search jobs, companies, or skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background"
                                />
                            </div>
                        </div>

                        {/* Desktop buttons */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - hidden on mobile */}
                    <aside className="hidden lg:block lg:w-64 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Quick Stats</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Jobs</span>
                                    <span className="font-medium">{jobs.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Remote</span>
                                    <span className="font-medium text-blue-600">
                                        {jobs.filter((j) => j.workMode.toLowerCase() === "remote").length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Full Time</span>
                                    <span className="font-medium text-green-600">
                                        {jobs.filter((j) => j.jobType.toLowerCase() === "full-time").length}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Popular Skills</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {getPopularSkills().map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="secondary"
                                            className="text-xs cursor-pointer hover:bg-secondary/80"
                                            onClick={() => setSearchQuery(skill)}
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Mobile stats card */}
                    <div className="lg:hidden mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="font-semibold text-lg">{jobs.length}</div>
                                        <div className="text-xs text-muted-foreground">Total</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-blue-600">
                                            {jobs.filter((j) => j.workMode.toLowerCase() === "remote").length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Remote</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-green-600">
                                            {jobs.filter((j) => j.jobType.toLowerCase() === "full-time").length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Full Time</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0">
                                    {filterOptions.map((option) => (
                                        <Button
                                            key={option.id}
                                            variant={activeFilter === option.id ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setActiveFilter(option.id)}
                                            className={`text-sm cursor-pointer whitespace-nowrap flex-shrink-0 ${activeFilter === option.id ? "bg-indigo-500 hover:bg-indigo-600" : ""
                                                }`}
                                        >
                                            <span className="hidden sm:inline">{option.label}</span>
                                            <span className="sm:hidden">{option.label.split(" ")[0]}</span>
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                {option.count}
                                            </Badge>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                                <Button
                                    className={`cursor-pointer ${sortBy === "newest" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "newest" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("newest")}
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Newest</span>
                                </Button>
                                <Button
                                    className={`cursor-pointer ${sortBy === "salary" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "salary" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("salary")}
                                >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Salary</span>
                                </Button>
                                <Button
                                    className={`cursor-pointer ${sortBy === "company" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "company" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("company")}
                                >
                                    <Building2 className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Company</span>
                                </Button>
                            </div>
                        </div>

                        {/* Jobs List */}
                        <div className="space-y-4">
                            {sortedJobs.map((job) => (
                                <Link key={job.id} to={`/jobs/${job.id}`}>
                                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Job Content */}
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                        <h3 className="text-4xl font-semibold text-foreground hover:text-primary transition-colors">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {job.jobType}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {job.workMode}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                                        <div className="flex items-center space-x-1">
                                                            <Building2 className="h-4 w-4" />
                                                            <span className="font-medium">{job.company.name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{job.jobLocation}</span>
                                                        </div>
                                                        {formatSalary(job) && (
                                                            <div className="flex items-center space-x-1">
                                                                <DollarSign className="h-4 w-4" />
                                                                <span className="font-medium text-green-600">
                                                                    {formatSalary(job)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm sm:text-base">
                                                        {job.description.substring(0, 200)}
                                                        {job.description.length > 200 ? "..." : ""}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {job.skills.slice(0, 4).map((skill) => (
                                                            <Badge key={skill} variant="secondary" className="text-xs">
                                                                <Tag className="h-3 w-3 mr-1" />
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {job.skills.length > 4 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{job.skills.length - 4} more
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center space-x-1">
                                                                <Users className="h-4 w-4" />
                                                                <span>{job.applicationsCount || 0} applicants</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>Deadline: {FormatDate(job.applicationDeadline)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between sm:justify-end space-x-3">
                                                            <span className="text-sm text-muted-foreground">
                                                                {formatDate(job.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {sortedJobs.length === 0 && (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchQuery ? "Try adjusting your search terms or filters." : "No jobs are currently available."}
                                    </p>
                                    <Button onClick={() => setSearchQuery("")} className="bg-indigo-500 hover:bg-indigo-600">
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
