"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Edit, Settings, GraduationCap, User, Target, Heart, Star, Award, BookOpen, Zap, ArrowRight, Users, ArrowUpDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import AuthService from "@/services/auth.service"
import { useNavigate, Link } from "react-router-dom"
import ProfileService, { type StudentProfileDto } from "@/services/profile.service"
import NotificationService from "@/components/Notification"

const quickLinks = [
    {
        title: "Q&A Analytics",
        description: "Track your questions votes",
        icon: ArrowUpDown,
        color: "from-indigo-500 to-purple-600",
        bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        action: "generate",
        link: "/user/qa"
    },
    {
        title: "Roadmaps",
        description: "Review your roadmaps and it's performance",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        action: "courses",
        link: "/user/courses"
    },
    {
        title: "Quiz Attempts",
        description: "Review your past challenges",
        icon: Zap,
        color: "from-yellow-500 to-orange-600",
        bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        action: "quiz",
        link: "/user/quiz"
    },
    {
        title: "Community Hub",
        description: "Discuss & grow together",
        icon: Users,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        action: "progress",
        link: "/community"
    },
]

export default function Profile() {
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<StudentProfileDto>({
        id: "",
        user: null,
        userId: "",
        name: "",
        profilePicture: null,
        currentLevelOfEducation: "",
        levelOfExpertise: "",
        fieldOfExpertise: "",
        userInterestsAndGoals: "",
        gender: "Male",
        city: "",
        address: "",
    })
    const [editData, setEditData] = useState(profileData)
    const [settings, setSettings] = useState({
        profileVisibility: true,
        emailNotifications: false,
        showLocation: true,
        showGender: true,
    })
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    // const [isLoading, setIsLoading] = useState(true)

    const handleSaveProfile = async () => {
        if (!editData.name.trim()) {
            NotificationService.error("Validation Error", "Name is required.");
            return;
        }

        setIsSaving(true);
        try {
            await ProfileService.updateStudentProfile(profileData.id, editData);
            console.log("Profile saved:", editData);
            setProfileData(editData);
            setIsEditDialogOpen(false);
            NotificationService.success("Profile updated successfully", "Your changes have been saved.");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            NotificationService.error("Profile update failed", error.message || "An error occurred while updating your profile.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleSaveSettings = () => {
        // In a real app, you'd save settings to backend
        console.log("Settings saved:", settings);
        setIsSettingsDialogOpen(false);
        NotificationService.success("Settings updated", "Your preferences have been saved.");
    }

    const handleCancelEdit = () => {
        setEditData(profileData); // Reset to original data
        setIsEditDialogOpen(false);
    }

    const getData = async () => {
        const userId = AuthService.getAuthenticatedUserId();
        if (userId == null) return navigate("/user/dashboard");

        const data = await ProfileService.getStudentProfile(userId)
        console.log("Response Profile Data:", data);
        setProfileData(data);
        setEditData(data);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/30">
            {/* Hero Section with Floating Elements */}
            <div className="relative overflow-hidden">
                <div className="relative pt-24 pb-16 px-4">
                    <div className="container mx-auto max-w-6xl">
                        {/* Welcome Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Heart className="h-4 w-4" />
                                Welcome to your profile home
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Hello, <span className="text-indigo-600">{profileData.name}</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Your personal space to showcase your journey, connect with others, and track your growth
                            </p>
                        </div>

                        {/* Profile Card - Centered and Elevated */}
                        <div className="flex justify-center mb-16">
                            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-8 max-w-md w-full">
                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {/* Edit Profile Dialog */}
                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-indigo-100 text-indigo-600">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Edit Profile</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">City</Label>
                                                        <Input
                                                            id="city"
                                                            value={editData.city || ""}
                                                            onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                                            placeholder="Enter your city"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="gender">Gender</Label>
                                                        <Select
                                                            value={editData.gender || ""}
                                                            onValueChange={(value) => setEditData({ ...editData, gender: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Male">Male</SelectItem>
                                                                <SelectItem value="Female">Female</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="address">Address</Label>
                                                    <Input
                                                        id="address"
                                                        value={editData.address || ""}
                                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                                        placeholder="Enter your full address"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="education">Current Level of Education</Label>
                                                        <Select
                                                            value={editData.currentLevelOfEducation || ""}
                                                            onValueChange={(value) => setEditData({ ...editData, currentLevelOfEducation: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select education level" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="High School">High School</SelectItem>
                                                                <SelectItem value="Some College">Some College</SelectItem>
                                                                <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                                                                <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                                                <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                                                <SelectItem value="PhD/Doctorate">PhD/Doctorate</SelectItem>
                                                                <SelectItem value="Professional Certification">Professional Certification</SelectItem>
                                                                <SelectItem value="Self-Taught">Self-Taught</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="expertise-level">Level of Expertise</Label>
                                                        <Select
                                                            value={editData.levelOfExpertise || ""}
                                                            onValueChange={(value) => setEditData({ ...editData, levelOfExpertise: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select expertise level" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                                                <SelectItem value="Expert">Expert</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="field-expertise">Field of Expertise</Label>
                                                    <Input
                                                        id="field-expertise"
                                                        value={editData.fieldOfExpertise || ""}
                                                        onChange={(e) => setEditData({ ...editData, fieldOfExpertise: e.target.value })}
                                                        placeholder="e.g., Software Development, Marketing, Design"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="interests-goals">Interests & Goals</Label>
                                                    <Textarea
                                                        id="interests-goals"
                                                        value={editData.userInterestsAndGoals || ""}
                                                        onChange={(e) => setEditData({ ...editData, userInterestsAndGoals: e.target.value })}
                                                        placeholder="Describe your interests, goals, and aspirations..."
                                                        rows={4}
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-2 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleCancelEdit}
                                                        disabled={isSaving}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleSaveProfile}
                                                        className="bg-indigo-600 hover:bg-indigo-700"
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Settings Dialog */}
                                    <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-indigo-100 text-indigo-600">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Profile Settings</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-6 py-4">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label>Profile Visibility</Label>
                                                            <p className="text-sm text-gray-500">Make your profile visible to others</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.profileVisibility}
                                                            onCheckedChange={(checked) => setSettings({ ...settings, profileVisibility: checked })}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label>Email Notifications</Label>
                                                            <p className="text-sm text-gray-500">Receive email updates</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.emailNotifications}
                                                            onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label>Show Location</Label>
                                                            <p className="text-sm text-gray-500">Display your city and address</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.showLocation}
                                                            onCheckedChange={(checked) => setSettings({ ...settings, showLocation: checked })}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label>Show Gender</Label>
                                                            <p className="text-sm text-gray-500">Display your gender information</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.showGender}
                                                            onCheckedChange={(checked) => setSettings({ ...settings, showGender: checked })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-2 pt-4">
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogTrigger>
                                                    <DialogTrigger asChild>
                                                        <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700">
                                                            Save Settings
                                                        </Button>
                                                    </DialogTrigger>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Profile Content */}
                                <div className="text-center">
                                    <div className="relative inline-block mb-6">
                                        <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                                            <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700">{profileData.name.charAt(0).toUpperCase() + profileData.name.charAt(1).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="h-2 w-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {profileData.id}
                                    </p>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                                    <p className="text-indigo-600 font-medium mb-4">{profileData.fieldOfExpertise}</p>

                                    {settings.showLocation && (
                                        <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">{profileData.city}</span>
                                        </div>
                                    )}

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                                                <Star className="h-4 w-4" />
                                                <span className="text-sm font-medium">Level</span>
                                            </div>
                                            <p className="text-xs text-gray-600">{profileData.levelOfExpertise}</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                                                <GraduationCap className="h-4 w-4" />
                                                <span className="text-sm font-medium">Education</span>
                                            </div>
                                            <p className="text-xs text-gray-600">{profileData.currentLevelOfEducation}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid - Bento Box Style */}
            <div className="container mx-auto px-4 pb-16 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Personal Info - Compact Card */}
                    <Card className="bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Personal Info</h3>
                                    <p className="text-indigo-100 text-xs">Your personal details</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                            {settings.showLocation && (
                                <div className="group/item hover:bg-indigo-50/50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-indigo-100">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-xl border border-indigo-200 group-hover/item:bg-indigo-200 transition-colors duration-200">
                                            <MapPin className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-sm font-semibold text-gray-900">Location</p>
                                                <Badge className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                                                    Current
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium mb-1">{profileData.city}</p>
                                            {profileData.address && (
                                                <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 px-3 py-2 rounded-lg border">
                                                    {profileData.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {settings.showGender && (
                                <div className="group/item hover:bg-indigo-50/50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-indigo-100">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-xl border border-indigo-200 group-hover/item:bg-indigo-200 transition-colors duration-200">
                                            <User className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-semibold text-gray-900">Gender</p>
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium bg-gray-50 px-3 py-2 rounded-lg border inline-block">
                                                {profileData.gender}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(!settings.showLocation && !settings.showGender) && (
                                <div className="text-center py-8">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Personal information is hidden</p>
                                        <p className="text-xs text-gray-400 mt-1">Enable in settings to display</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Expertise - Featured Card */}
                    <Card className="bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Expertise</h3>
                                    <p className="text-purple-100 text-xs">Your professional skills</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                            <div className="group/item hover:bg-purple-50/50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-100">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-xl border border-purple-200 group-hover/item:bg-purple-200 transition-colors duration-200">
                                        <Target className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="text-sm font-semibold text-gray-900">Primary Field</p>
                                            <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                                                Expert
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium bg-gray-50 px-3 py-2 rounded-lg border inline-block">
                                            {profileData.fieldOfExpertise}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="group/item hover:bg-purple-50/50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-xl border border-purple-200 group-hover/item:bg-purple-200 transition-colors duration-200">
                                        <Star className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-semibold text-gray-900">Experience Level</p>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium bg-gray-50 px-3 py-2 rounded-lg border inline-block">
                                            {profileData.levelOfExpertise}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card className="bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Education</h3>
                                    <p className="text-blue-100 text-xs">Academic background</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            <div className="group/item hover:bg-blue-50/50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl border border-blue-200 group-hover/item:bg-blue-200 transition-colors duration-200">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-semibold text-gray-900">Current Level</p>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium bg-gray-50 px-3 py-2 rounded-lg border inline-block">
                                            {profileData.currentLevelOfEducation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Goals - Wide Card */}
                    <Card className="lg:col-span-2 bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                    <Target className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Goals & Interests</h3>
                                    <p className="text-green-100 text-xs">Your aspirations and passions</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                            <div className="group/item hover:bg-green-50/50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-green-100">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-xl border border-green-200 group-hover/item:bg-green-200 transition-colors duration-200">
                                        <Heart className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="text-sm font-semibold text-gray-900">Personal Mission</p>
                                            <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                                Active
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 px-4 py-3 rounded-lg border">
                                            {profileData.userInterestsAndGoals || "No interests and goals specified yet."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Links Section */}
                <div className="my-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {quickLinks.map((link) => (
                            <Link to={link.link}>
                                <Card
                                    key={link.title}
                                    className={`${link.bgColor} border-0 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden h-full`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <CardContent className="p-6 relative">
                                        <div
                                            className={`w-12 h-12 ${link.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
                                        >
                                            <link.icon className={`w-6 h-6 ${link.iconColor}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">{link.description}</p>
                                        <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                                            Get started
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Achievement Section */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full">
                        <Award className="h-5 w-5" />
                        <span className="font-medium">Profile Complete</span>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-md mx-auto">
                        Your profile is looking great! Keep updating your information to help others connect with you.
                    </p>
                </div>
            </div>
        </div>
    )
}
