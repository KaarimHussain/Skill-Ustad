"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen } from "lucide-react"
import type { CourseData } from "@/services/lesson.service"

interface CourseCardProps {
    course: CourseData
    onEdit?: () => void
    onView?: () => void
}

export function CourseCard({ course, onEdit, onView }: CourseCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {course.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0 bg-indigo-50 text-indigo-700 border-indigo-200">
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
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent cursor-pointer"
                    onClick={onEdit}
                >
                    Edit Course
                </Button>
                <Button size="sm" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer" onClick={onView}>
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}
