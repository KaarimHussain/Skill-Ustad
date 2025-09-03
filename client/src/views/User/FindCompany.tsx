import FormatDate from "@/components/FormatDate"
import NotificationService from "@/components/Notification"
import Logo from "@/components/Logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Building, Calendar, Search, Loader2, RefreshCw, ArrowRight, MapPin, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function FindCompany() {
    // State for data
    const [companies, setCompanies] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // State for UI
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest")
    const [refreshing, setRefreshing] = useState(false)

    const navigate = useNavigate()

    const fetchCompanies = async () => {
        const BASE_URL = import.meta.env.VITE_SERVER_URL

        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/user-data/company`)
            if (!response.ok) {
                throw new Error("Failed to fetch companies")
            }
            const data = await response.json()
            console.log("DATA COMPANY:", data)

            setCompanies(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCompanies()
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchCompanies()
        setRefreshing(false)
    }

    const handleViewCompany = (id: number) => {
        if (!id) {
            NotificationService.error("Failed to View", "Cannot view the Company Details! unable to get the id")
            return
        }
        navigate(`/user/find-company/${id}`)
    }

    // Filter companies based on search
    const filteredCompanies = companies.filter((company) => {
        const matchesSearch =
            company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (company.city && company.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (company.businessType && company.businessType.toLowerCase().includes(searchQuery.toLowerCase()))

        return matchesSearch
    })

    // Sort companies based on selected sort option
    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.companyName.localeCompare(b.companyName)
            case "newest":
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
    })

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Find Companies</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading companies...</span>
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
                                <span className="text-3xl font-light">Find Companies</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Companies</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleRefresh} className="bg-indigo-500 hover:bg-indigo-600" disabled={refreshing}>
                                    {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-18">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-2xl lg:text-3xl font-light">Find Companies</span>
                            </div>

                            {/* Mobile refresh button */}
                            <div className="flex lg:hidden items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="border-slate-300 bg-transparent"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="flex-1 lg:max-w-2xl lg:mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search Companies by name, industry, city, or type..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background"
                                />
                            </div>
                        </div>

                        {/* Desktop controls */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="border-slate-300 font-medium bg-transparent"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:w-64 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Quick Stats</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Companies</span>
                                    <span className="font-medium">{companies.length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Mobile stats */}
                    <div className="lg:hidden mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 gap-4 text-center">
                                    <div>
                                        <div className="font-semibold text-lg">{companies.length}</div>
                                        <div className="text-xs text-muted-foreground">Total Companies</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Filter bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div className="flex items-center space-x-2"></div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                                <Button
                                    className={`cursor-pointer ${sortBy === "newest" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "newest" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("newest")}
                                >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Newest</span>
                                </Button>
                                <Button
                                    className={`cursor-pointer ${sortBy === "name" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "name" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("name")}
                                >
                                    <Building className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Name</span>
                                </Button>
                            </div>
                        </div>

                        {/* Companies Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedCompanies.length === 0 ? (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-lg text-gray-500">No companies found matching your criteria.</p>
                                </div>
                            ) : (
                                sortedCompanies.map((company) => (
                                    <Card
                                        key={company.id}
                                        className="group flex flex-col h-full bg-white border border-indigo-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                                        onClick={() => handleViewCompany(company.id)}
                                    >
                                        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors">
                                                    <Building className="w-6 h-6 sm:w-8 sm:h-8" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                                                        <span className="block truncate" title={company.companyName}>
                                                            {company.companyName}
                                                        </span>
                                                    </CardTitle>
                                                    <p
                                                        className="text-sm sm:text-base text-indigo-600 font-medium mt-1 truncate"
                                                        title={company.industry || "Industry Not Specified"}
                                                    >
                                                        {company.industry || "Industry Not Specified"}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-600">
                                                        {company.city && (
                                                            <div className="flex items-center gap-1 min-w-0">
                                                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                                <span className="truncate" title={company.city}>
                                                                    {company.city}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {company.businessType && (
                                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm">
                                                                {company.businessType}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 px-4 sm:px-6 pb-4">
                                            <div className="space-y-3 sm:space-y-4">
                                                {company.companyDescription && (
                                                    <p
                                                        className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 text-pretty leading-relaxed"
                                                        title={company.companyDescription}
                                                    >
                                                        {company.companyDescription}
                                                    </p>
                                                )}
                                                {company.employeeCount && (
                                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                        <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                        <span>{company.employeeCount} Employees</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                        <span>Founded {FormatDate(company.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                                            <Button
                                                onClick={() => handleViewCompany(company.id)}
                                                size="lg"
                                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm sm:text-base group-hover:bg-indigo-600 transition-colors"
                                            >
                                                View Company
                                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}