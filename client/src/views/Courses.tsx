"use client"

import FormatDate from "@/components/FormatDate";
import NotificationService from "@/components/Notification";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCachedCourses } from "@/hooks/use-cached-courses";
import { 
    Calendar, 
    BookOpen, 
    Search, 
    Filter, 
    Clock, 
    Loader2, 
    RefreshCw,
    ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Courses() {
    const { courses, loading, error, refreshCourses, clearCache } = useCachedCourses();
    
    // State for UI
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [refreshing, setRefreshing] = useState(false);
    
    const navigate = useNavigate();

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshCourses();
        setRefreshing(false);
    };

    const handleViewCourse = (id: string) => {
        if (id == null) {
            NotificationService.error("Failed to View", "Cannot view the Course Details! unable to get the id");
            return;
        }
        navigate(`/public/view-course/`, { state: { id } });
    };

    // Filter courses based on search and active filter
    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "large" && course.totalSections > 5) ||
            (activeFilter === "small" && course.totalSections <= 5);

        return matchesSearch && matchesFilter;
    });

    // Sort courses based on selected sort option
    const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
            case "sections":
                return b.totalSections - a.totalSections;
            case "newest":
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    // Calculate filter counts
    const filterOptions = [
        { id: "all", label: "All Courses", count: courses.length },
        { id: "large", label: "Large Courses", count: courses.filter((c) => c.totalSections > 5).length },
        { id: "small", label: "Small Courses", count: courses.filter((c) => c.totalSections <= 5).length },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Courses</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading courses...</span>
                    </div>
                </div>
            </div>
        );
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
                                <span className="text-3xl font-light">Courses</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Courses</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleRefresh} className="bg-indigo-500 hover:bg-indigo-600" disabled={refreshing}>
                                    {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Try Again
                                </Button>
                                <Button onClick={clearCache} variant="outline">
                                    Clear Cache
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
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
                                <span className="text-2xl lg:text-3xl font-light">Courses</span>
                            </div>

                            {/* Mobile buttons - show only essential ones */}
                            <div className="flex lg:hidden items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Search bar - full width on mobile */}
                        <div className="flex-1 lg:max-w-2xl lg:mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search courses by title or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background"
                                />
                            </div>
                        </div>

                        {/* Desktop buttons - hidden on mobile */}
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
                    {/* Sidebar - hidden on mobile, shown on desktop */}
                    <aside className="hidden lg:block lg:w-64 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <h3 className="font-semibold">Quick Stats</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Courses</span>
                                    <span className="font-medium">{courses.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Large Courses</span>
                                    <span className="font-medium text-green-600">{courses.filter((c) => c.totalSections > 5).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Small Courses</span>
                                    <span className="font-medium text-orange-600">{courses.filter((c) => c.totalSections <= 5).length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Mobile stats card - shown only on mobile */}
                    <div className="lg:hidden mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="font-semibold text-lg">{courses.length}</div>
                                        <div className="text-xs text-muted-foreground">Total</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-green-600">
                                            {courses.filter((c) => c.totalSections > 5).length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Large</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg text-orange-600">
                                            {courses.filter((c) => c.totalSections <= 5).length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Small</div>
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
                                    className={`cursor-pointer ${sortBy === "sections" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}
                                    variant={sortBy === "sections" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setSortBy("sections")}
                                >
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Sections</span>
                                </Button>
                            </div>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedCourses.length === 0 ? (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-lg text-gray-500">No courses found matching your criteria.</p>
                                </div>
                            ) : (
                                sortedCourses.map((course) => (
                                    <Card 
                                        key={course.id} 
                                        className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 border border-gray-200 cursor-pointer"
                                        onClick={() => handleViewCourse(course.id!)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <CardTitle className="text-3xl font-semibold text-gray-900 line-clamp-2 leading-tight">
                                                    {course.title}
                                                </CardTitle>
                                                <Badge variant="outline" className="shrink-0 bg-indigo-50 text-indigo-700 border-indigo-200">
                                                    {course.totalSections} sections
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 pb-4">
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{course.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>Created {FormatDate(course.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    <span>{course.totalSections} sections</span>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-0 gap-2">
                                            <Button size="sm" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white">
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4" />
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
    );
}