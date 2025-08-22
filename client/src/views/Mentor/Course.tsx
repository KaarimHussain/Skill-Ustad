import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { CourseCard } from "@/components/CourseCard"
import { BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import LessonService, { type CourseData } from "@/services/lesson.service"
import NotificationService from "@/components/Notification"

export default function MentorCourse() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<CourseData[] | null>(null) // Replace with your actual data fetching logic

    const getCourse = async () => {
        const data = await LessonService.getUserCourses();
        if (data != null) {
            setCourses(data);
        }
        console.log(data);

    }

    useEffect(() => {
        getCourse();
    }, [])


    const handleEditCourse = (courseTitle: string) => {
        console.log(`Edit course: ${courseTitle}`)
        // Add your edit logic here
    }

    const handleViewCourse = (id: string) => {
        if (id == null) {
            NotificationService.error("Failed to View", "Cannot view the Course Details! unable to get the id")
            return;
        }

        navigate(`/mentor/view-course/`, { state: { id } });
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
                            <h1 className={"text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6"}>Manage Your Courses</h1>
                            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto mb-8">
                                Create, edit, and monitor your courses with comprehensive analytics. Track student progress, manage
                                content, and optimize your teaching performance all in one place.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Courses</h2>
                            <p className="text-gray-600 mt-1">Manage and track your course content</p>
                        </div>
                        <div>
                            <Link to="/mentor/create-course">
                                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">Create Course</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses?.map((course, index) => (
                            <CourseCard
                                key={index}
                                course={course}
                                onEdit={() => handleEditCourse(course.id!)}
                                onView={() => handleViewCourse(course.id!)}
                            />
                        ))}
                    </div>

                    {/* Empty state when no courses */}
                    {courses == null && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first course</p>
                            <Link to="/mentor/create-course">
                                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">Create Your First Course</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
