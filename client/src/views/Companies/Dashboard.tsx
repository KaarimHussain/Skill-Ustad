import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Calendar, FileUser, BookCopy, User2 } from "lucide-react";
import CompaniesService, { type CompanyDashboardStats } from "@/services/companies.service";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "@/services/auth.service";

export default function CompanyDashboard() {

    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState<string | null>("Company")
    const [stats, setStats] = useState<CompanyDashboardStats>({
        totalJobs: 0,
        totalApplications: 0,
    })

    const handleCompanyName = async () => {
        const name = CompaniesService.getCompanyName() || "Company";
        console.log(name);
        setCompanyName(await name);
    }

    const fetchStats = async () => {
        try {
            const statsData = await CompaniesService.GetCompanyStats();
            setStats(statsData);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    const InfoCheck = async () => {
        const userId = AuthService.getAuthenticatedUserId();
        if (userId == null) return navigate("/company/login");
        const infoCheck = await CompaniesService.CheckCompanyAdditionalInfo(userId);
        // check if the infoCheck is true or false
        if (!infoCheck) {
            navigate("/company/info");
            return;
        }
    }

    useEffect(() => {
        InfoCheck();
        handleCompanyName();
        fetchStats();
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-purple-900/10 to-indigo-500/10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
                <div className="relative px-4 sm:px-6 lg:px-8 py-25">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6 hover:bg-white/30 transition-all duration-300">
                            <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            Welcome back,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient">
                                {companyName}!
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Streamline your hiring process with our comprehensive platform. Post job openings, manage candidate applications, and discover top talent to grow your team efficiently.
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 max-w-4xl mx-auto mt-8">
                            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                                <CardContent className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <BookCopy className="w-5 h-5 text-indigo-600 mr-2" />
                                        <span className="text-lg font-medium text-gray-600">Total Jobs Posted</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900">{stats.totalJobs.toLocaleString()}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
                                <CardContent className="p-4 text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <FileUser className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="text-lg font-medium text-gray-600">Total Applications</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            {/* Quick Links Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/company/jobs">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <BookCopy className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Post Job</h3>
                                        <p className="text-sm text-gray-500">Create an Job Listing</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Link to="/company/applications">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center">
                                    <div className="bg-yellow-100 p-3 rounded-lg">
                                        <User2 className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Applications</h3>
                                        <p className="text-sm text-gray-500">View Total Applicant's</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    )
}