"use client"

import FormatDate from "@/components/FormatDate"
import NotificationService from "@/components/Notification"
import Logo from "@/components/Logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Briefcase, Calendar, Globe, MapPin, Star, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MentorFeedbackService from "@/services/mentor-feedback.service"
import AuthService from "@/services/auth.service"

export default function UserMentorDetails() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [mentor, setMentor] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [feedback, setFeedback] = useState("")
    const [rating, setRating] = useState<number>(0)
    const [hoveredRating, setHoveredRating] = useState<number>(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
    const [mentorFeedbacks, setMentorFeedbacks] = useState<any[]>([])
    const [feedbacksLoading, setFeedbacksLoading] = useState(true)

    const fetchMentor = async () => {
        const BASE_URL = import.meta.env.VITE_SERVER_URL

        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/user-data/mentor/${id}`)
            if (!response.ok) {
                throw new Error("Failed to fetch mentor details")
            }
            const data = await response.json()
            if (!data) {
                throw new Error("Mentor not found")
            }
            setMentor(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
            NotificationService.error("Failed to Load", err.message)
        } finally {
            setLoading(false)
        }
    }

    // Function to fetch existing feedbacks for the mentor
    const fetchMentorFeedbacks = async () => {
        if (!id) return;

        setFeedbacksLoading(true);
        try {
            const feedbacks = await MentorFeedbackService.getFeedbacksByMentorId(id);
            setMentorFeedbacks(feedbacks);
        } catch (error) {
            console.error("Error fetching mentor feedbacks:", error);
            NotificationService.error("Error", "Failed to load feedbacks");
        } finally {
            setFeedbacksLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMentor()
        } else {
            setError("Invalid mentor ID")
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (mentor) {
            fetchMentorFeedbacks();
        }
    }, [mentor])

    // Function to submit feedback
    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating) {
            NotificationService.error("Invalid Rating", "Please select a rating");
            return;
        }

        if (feedback.trim().length < 10) {
            NotificationService.error("Invalid Feedback", "Feedback must be at least 10 characters long");
            return;
        }

        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            NotificationService.error("Authentication Error", "Please log in to submit feedback");
            return;
        }

        setIsSubmitting(true);

        try {
            await MentorFeedbackService.submitFeedback({
                mentorId: id!,
                userId: userId,
                rating: rating,
                feedback: feedback
            });

            NotificationService.success("Success", "Feedback submitted successfully!");
            setFeedback("");
            setRating(0);
            setFeedbackSubmitted(true);
            // Optionally, refetch feedbacks to show the new one
        } catch (error: any) {
            console.error("Error submitting feedback:", error);
            NotificationService.error("Error", "Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Mentor Details</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <User className="h-6 w-6 animate-spin" />
                        <span>Loading mentor details...</span>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !mentor) {
        return (
            <div className="min-h-screen bg-background pt-18">
                <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Logo logoOnly />
                                <span className="text-3xl font-light">Mentor Details</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate("/user/find-mentor")}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Mentors
                            </Button>
                        </div>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-12">
                    <Card className="text-center py-12">
                        <CardContent>
                            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error Loading Mentor</h3>
                            <p className="text-muted-foreground mb-4">{error || "Mentor not found"}</p>
                            <Button onClick={() => navigate("/user/find-mentor")} className="bg-indigo-500 hover:bg-indigo-600">
                                Back to Mentors
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-18">
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-18 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Logo logoOnly />
                            <span className="text-2xl sm:text-3xl font-light">Mentor Details</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate("/user/find-mentor")}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Mentors
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <Card className="max-w-5xl mx-auto bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-lg">
                    <CardHeader className="px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {mentor.profilePicture ? (
                                <img
                                    src={mentor.profilePicture || "/placeholder.svg"}
                                    alt={mentor.name}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-400 border-4 border-white shadow-lg">
                                    <User className="w-12 h-12 sm:w-16 sm:h-16" />
                                </div>
                            )}
                            <div className="text-center sm:text-left flex-1 min-w-0">
                                <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-balance leading-tight">
                                    <span className="block truncate" title={mentor.name}>
                                        {mentor.name}
                                    </span>
                                </CardTitle>
                                <p
                                    className="text-lg sm:text-xl text-indigo-600 font-medium mb-2 truncate"
                                    title={mentor.fieldOfExpertise || "Expert Mentor"}
                                >
                                    {mentor.fieldOfExpertise || "Expert Mentor"}
                                </p>
                                <p className="text-base text-gray-600 font-medium truncate" title={mentor.email}>
                                    {mentor.email}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 sm:px-8 pb-8">
                        <div className="space-y-8">
                            {/* Bio */}
                            {mentor.bio && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                        <p className="text-gray-700 leading-relaxed text-pretty">{mentor.bio}</p>
                                    </div>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {mentor.city && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                                            <p className="text-gray-900 font-medium truncate" title={mentor.city}>
                                                {mentor.city}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {mentor.industryExperience && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                                            <p className="text-gray-900 font-medium truncate" title={mentor.industryExperience}>
                                                {mentor.industryExperience}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {mentor.gender && (
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Gender</p>
                                            <p className="text-gray-900 font-medium truncate" title={mentor.gender}>
                                                {mentor.gender}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                                        <p className="text-gray-900 font-medium">{FormatDate(mentor.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expertise Level */}
                            {mentor.levelOfExpertise && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Expertise Level</h3>
                                    <Badge
                                        variant="secondary"
                                        className="bg-emerald-100 text-emerald-800 text-base font-medium px-4 py-2 rounded-lg"
                                    >
                                        {mentor.levelOfExpertise}
                                    </Badge>
                                </div>
                            )}

                            {/* Skills Tags */}
                            {mentor.expertiseTags && mentor.expertiseTags.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {mentor.expertiseTags.map((tag: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="text-sm font-medium px-4 py-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg truncate max-w-48"
                                                title={tag}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {mentor.spokenLanguages && mentor.spokenLanguages.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Languages</h3>
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-gray-900 font-medium truncate" title={mentor.spokenLanguages.join(", ")}>
                                                {mentor.spokenLanguages.join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Feedback Section */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h3>

                            {/* Display existing feedbacks */}
                            <div className="mb-6">
                                {feedbacksLoading ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-600">Loading feedbacks...</p>
                                    </div>
                                ) : mentorFeedbacks.length > 0 ? (
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-gray-800">Recent Feedbacks</h4>
                                        {mentorFeedbacks.map((feedbackItem) => (
                                            <Card key={feedbackItem.id} className="p-4 bg-white border border-gray-200">
                                                <div className="flex items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-1">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < feedbackItem.rating
                                                                                ? "text-yellow-400 fill-current"
                                                                                : "text-gray-300"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="ml-2 text-sm text-gray-500">
                                                                {feedbackItem.createdAt?.toDate ?
                                                                    new Date(
                                                                        feedbackItem.createdAt.toDate()
                                                                    ).toLocaleDateString()
                                                                    :
                                                                    'Date unknown'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">{feedbackItem.feedback}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 italic">No feedbacks yet. Be the first to share your experience!</p>
                                )}
                            </div>

                            {/* Feedback submission form */}
                            {!feedbackSubmitted ? (
                                <Card className="p-6 bg-indigo-50 border border-indigo-100">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Add Your Feedback</h4>
                                    <form onSubmit={handleSubmitFeedback}>
                                        <div className="mb-4">
                                            <Label className="text-gray-700 mb-2 block">Rating</Label>
                                            <div className="flex space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        className={`text-2xl focus:outline-none ${star <= (hoveredRating || rating)
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                            }`}
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoveredRating(star)}
                                                        onMouseLeave={() => setHoveredRating(rating)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <Star
                                                            className={
                                                                star <= (hoveredRating || rating)
                                                                    ? "fill-current text-yellow-400"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <Label htmlFor="feedback" className="text-gray-700 mb-2 block">
                                                Your Feedback
                                            </Label>
                                            <Textarea
                                                id="feedback"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Share your experience with this mentor..."
                                                rows={4}
                                                className="w-full"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                            disabled={isSubmitting || !rating}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="flex items-center">
                                                        <span className="ml-2">Submitting...</span>
                                                    </span>
                                                </>
                                            ) : (
                                                "Submit Feedback"
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            ) : (
                                <Card className="p-6 bg-green-50 border border-green-200 text-center">
                                    <p className="text-green-700 font-medium">
                                        Thank you for your feedback! Your rating and comments will help others.
                                    </p>
                                </Card>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
