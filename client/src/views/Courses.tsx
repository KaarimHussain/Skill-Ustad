import NotificationService from "@/components/Notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import type { CourseData } from "@/services/lesson.service";
import LessonService from "@/services/lesson.service";
import { Calendar, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Courses() {
    const [courses, setCourses] = useState<CourseData[] | null>(null) // Replace with your actual data fetching logic
    const navigate = useNavigate();
    const getCourses = async () => {
        const data = await LessonService.getAllCourses();
        if (data != null) {
            setCourses(data);
        }
    }

    useEffect(() => {
        getCourses();
    }, [])

    const handleViewCourse = (id: string) => {
        if (id == null) {
            NotificationService.error("Failed to View", "Cannot view the Course Details! unable to get the id")
            return;
        }

        navigate(`/public/view-course/`, { state: { id } });
    }


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>
                    <div className="relative px-4 sm:px-6 lg:px-8 pt-30 pb-20">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className={"text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6"}>Your Courses</h1>
                            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto mb-8">
                                Explore and manage your courses. Click on a course to view details and track student progress.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses == null ? (
                            <div className="text-center py-10">
                                <p className="text-lg text-gray-500">No courses found.</p>
                            </div>
                        ) : courses.map((course) => {
                            return (
                                <Card key={course.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
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
                                                <span>Created {formatDate(course.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                <span>{course.totalSections} sections</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0 gap-2">
                                        <Button size="sm" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer" onClick={() => handleViewCourse(course.id!)}>
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}