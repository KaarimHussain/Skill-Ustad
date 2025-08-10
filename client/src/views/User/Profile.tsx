"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Edit, Settings, GraduationCap, User, Target } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function Profile() {
    const [profileData, setProfileData] = useState({
        CurrentLevelOfEducation: "Bachelor's Degree",
        LevelOfExpertise: "Intermediate",
        FieldOfExpertise: "Software Development",
        UserInterestsAndGoals:
            "Passionate about building scalable web applications and learning new technologies. Currently focusing on cloud architecture and DevOps practices. Goal is to become a senior technical lead within the next 2 years.",
        Gender: "Male",
        City: "San Francisco, CA",
        Address: "123 Tech Street, San Francisco, CA 94105",
    })

    const [editData, setEditData] = useState(profileData)
    const [settings, setSettings] = useState({
        profileVisibility: true,
        emailNotifications: true,
        showLocation: true,
        showGender: true,
    })

    const handleSaveProfile = () => {
        setProfileData(editData)
        // Here you would typically make an API call to save the data
        console.log("Profile saved:", editData)
    }

    const handleSaveSettings = () => {
        // Here you would typically make an API call to save settings
        console.log("Settings saved:", settings)
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-50/30 to-white pt-20">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="relative mb-8">
                    {/* Cover Image */}
                    <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            {/* Edit Profile Dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-indigo-700">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
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
                                                    value={editData.City || ""}
                                                    onChange={(e) => setEditData({ ...editData, City: e.target.value })}
                                                    placeholder="Enter your city"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="gender">Gender</Label>
                                                <Select
                                                    value={editData.Gender || ""}
                                                    onValueChange={(value) => setEditData({ ...editData, Gender: value })}
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
                                                value={editData.Address || ""}
                                                onChange={(e) => setEditData({ ...editData, Address: e.target.value })}
                                                placeholder="Enter your full address"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="education">Current Level of Education</Label>
                                                <Select
                                                    value={editData.CurrentLevelOfEducation || ""}
                                                    onValueChange={(value) => setEditData({ ...editData, CurrentLevelOfEducation: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select education level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="High School">High School</SelectItem>
                                                        <SelectItem value="Associate's Degree">Associate's Degree</SelectItem>
                                                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="expertise-level">Level of Expertise</Label>
                                                <Select
                                                    value={editData.LevelOfExpertise || ""}
                                                    onValueChange={(value) => setEditData({ ...editData, LevelOfExpertise: value })}
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
                                                value={editData.FieldOfExpertise || ""}
                                                onChange={(e) => setEditData({ ...editData, FieldOfExpertise: e.target.value })}
                                                placeholder="e.g., Software Development, Marketing, Design"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="interests-goals">Interests & Goals</Label>
                                            <Textarea
                                                id="interests-goals"
                                                value={editData.UserInterestsAndGoals || ""}
                                                onChange={(e) => setEditData({ ...editData, UserInterestsAndGoals: e.target.value })}
                                                placeholder="Describe your interests, goals, and aspirations..."
                                                rows={4}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4">
                                            <DialogTrigger asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogTrigger>
                                            <DialogTrigger asChild>
                                                <Button onClick={handleSaveProfile} className="bg-indigo-600 hover:bg-indigo-700">
                                                    Save Changes
                                                </Button>
                                            </DialogTrigger>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Settings Dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-indigo-700">
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
                    </div>

                    {/* Profile Info Overlay */}
                    <div className="absolute -bottom-16 left-8 flex items-end gap-6 p-5 rounded-2xl bg-black/10 backdrop-blur-3xl">
                        <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700">JD</AvatarFallback>
                        </Avatar>
                        <div className="pb-4">
                            <h1 className="text-3xl font-bold text-white mb-1">John Doe</h1>
                            <p className="text-indigo-100 text-lg">{profileData.FieldOfExpertise || "Professional"}</p>
                            {settings.showLocation && (
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="h-4 w-4 text-indigo-200" />
                                    <span className="text-indigo-100">{profileData.City || "Not specified"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Personal Information */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {settings.showLocation && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Location</p>
                                            <p className="text-sm text-gray-700">{profileData.City || "Not specified"}</p>
                                            {profileData.Address && <p className="text-xs text-gray-500">{profileData.Address}</p>}
                                        </div>
                                    </div>
                                )}
                                {settings.showGender && (
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Gender</p>
                                            <p className="text-sm text-gray-700">{profileData.Gender || "Not specified"}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Field of Expertise */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900">Field of Expertise</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Primary Field</p>
                                        <Badge
                                            variant="secondary"
                                            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm px-3 py-1"
                                        >
                                            {profileData.FieldOfExpertise || "Not specified"}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">Level of Expertise</p>
                                        <Badge variant="outline" className="border-indigo-200 text-indigo-700 text-sm px-3 py-1">
                                            {profileData.LevelOfExpertise || "Not specified"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    Passionate software engineer with 5+ years of experience building scalable web applications. I
                                    specialize in React, Node.js, and cloud technologies. Always eager to learn new technologies and solve
                                    complex problems. When I'm not coding, you can find me hiking, reading tech blogs, or contributing to
                                    open source projects.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Current Level of Education</h4>
                                        <p className="text-indigo-600 font-medium">
                                            {profileData.CurrentLevelOfEducation || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interests and Goals */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Interests & Goals</h3>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    {profileData.UserInterestsAndGoals || "No interests and goals specified yet."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
