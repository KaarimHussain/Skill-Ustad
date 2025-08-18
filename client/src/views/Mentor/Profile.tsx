"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Edit, Settings, User, Briefcase, Hash, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import type { MentorAdditionalInfoRequest } from "@/dtos/mentorAdditionalInfoRequest"
import AuthService from "@/services/auth.service"
import { useNavigate } from "react-router-dom"
import MentorProfileService from "@/services/mentor-profile.service"


export default function MentorProfile() {

    // Navigate Hook
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<MentorAdditionalInfoRequest>({
        MentorId: "", // This would come from auth context
        Bio: "",
        LevelOfExpertise: "",
        FieldOfExpertise: "",
        IndustryExperience: "",
        Gender: "",
        City: "",
        Address: "",
    })

    const [userName, setUsername] = useState("");

    const [tags, setTags] = useState<string[]>(["React", "Node.js", "TypeScript", "AWS", "MongoDB", "GraphQL"])
    const [newTag, setNewTag] = useState("")

    const [editData, setEditData] = useState(profileData)
    const [editTags, setEditTags] = useState(tags)
    const [settings, setSettings] = useState({
        profileVisibility: true,
        emailNotifications: true,
        showLocation: true,
        showGender: true,
    })

    const addTag = () => {
        if (newTag.trim() && !editTags.includes(newTag.trim())) {
            setEditTags([...editTags, newTag.trim()])
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setEditTags(editTags.filter((tag) => tag !== tagToRemove))
    }

    const handleSaveProfile = () => {
        setProfileData(editData)
        setTags(editTags)
        // Here you would typically make API calls to save both profile data and tags
        console.log("Profile saved:", editData)
        console.log(
            "Tags saved:",
            editTags.map((tag) => ({ TagName: tag, MentorId: editData.MentorId })),
        )
    }

    const handleSaveSettings = () => {
        console.log("Settings saved:", settings)
    }

    const setMentorId = () => {
        const mentorId = AuthService.getAuthenticatedUserId();
        if (mentorId) {
            setProfileData(prev => ({
                ...prev,
                MentorId: mentorId
            }));
        } else {
            // User is not loggedIn
            navigate("/login");
        }
    };

    // Dynamic Data Fetching Logic

    const fetchData = async () => {
        const mentorData = await MentorProfileService.getData();
        const profileData = AuthService.getAuthenticatedUserData();
        setUsername(profileData.name);


        setProfileData(prev => ({
            ...prev,
            MentorId: mentorData.mentorId ?? prev.MentorId,
            Bio: mentorData.bio ?? prev.Bio,
            LevelOfExpertise: mentorData.levelOfExpertise ?? prev.LevelOfExpertise,
            FieldOfExpertise: mentorData.fieldOfExpertise ?? prev.FieldOfExpertise,
            IndustryExperience: mentorData.industryExperience ?? prev.IndustryExperience,
            Gender: mentorData.gender ?? prev.Gender,
            City: mentorData.city ?? prev.City,
            Address: mentorData.address ?? prev.Address,
        }));
    };

    // Calling the method on mount

    useEffect(() => {
        setMentorId()
        fetchData();
    }, [])

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-indigo-50/30 to-white py-20">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="relative mb-8">
                    {/* Cover Image */}
                    <div className="h-48 md:h-64 bg-gradient-to-tr from-indigo-500 via-indigo-500 to-indigo-600 rounded-2xl relative overflow-hidden">
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
                                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Mentor Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Professional Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={editData.Bio || ""}
                                                onChange={(e) => setEditData({ ...editData, Bio: e.target.value })}
                                                placeholder="Write a compelling bio that showcases your expertise and experience..."
                                                rows={4}
                                                className="resize-none"
                                            />
                                            <p className="text-xs text-gray-500">This will be the first thing students see about you.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="field-expertise">Field of Expertise</Label>
                                                <Input
                                                    id="field-expertise"
                                                    value={editData.FieldOfExpertise || ""}
                                                    onChange={(e) => setEditData({ ...editData, FieldOfExpertise: e.target.value })}
                                                    placeholder="e.g., Software Development, Data Science, UX Design"
                                                />
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
                                                        <SelectItem value="Beginner">Beginner (0-2 years)</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate (2-5 years)</SelectItem>
                                                        <SelectItem value="Advanced">Advanced (5-10 years)</SelectItem>
                                                        <SelectItem value="Expert">Expert (10+ years)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="industry-experience">Industry Experience</Label>
                                            <Textarea
                                                id="industry-experience"
                                                value={editData.IndustryExperience || ""}
                                                onChange={(e) => setEditData({ ...editData, IndustryExperience: e.target.value })}
                                                placeholder="Describe your professional experience, industries you've worked in, notable projects, leadership roles..."
                                                rows={3}
                                                className="resize-none"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Include specific industries, company types, and key achievements.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Skills & Expertise Tags</Label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {editTags.map((tag, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 flex items-center gap-1"
                                                    >
                                                        <Hash className="h-3 w-3" />
                                                        {tag}
                                                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    placeholder="Add a skill or expertise tag..."
                                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                                />
                                                <Button type="button" onClick={addTag} size="sm" variant="outline">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Add relevant skills, technologies, and areas of expertise.
                                            </p>
                                        </div>

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
                                                    <p className="text-sm text-gray-500">Make your profile visible to students</p>
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
                    <div className="absolute -bottom-16 left-8 flex items-end gap-6 border border-white/30 p-4 rounded-2xl bg-black/20 backdrop-blur-3xl">
                        <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700">
                                {userName
                                    ? userName
                                        .split(" ")                 // Split into words
                                        .filter(Boolean)            // Remove empty strings
                                        .slice(0, 2)                 // Take first two words
                                        .map(word => word[0]?.toUpperCase()) // Get first char of each
                                        .join("")                    // Join them together
                                    : "JD"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="pb-4">
                            <h1 className="text-3xl font-bold text-white mb-1">{userName}</h1>
                            <p className="text-indigo-100 text-lg">{profileData.FieldOfExpertise || "Not specified"}</p>
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
                                <h3 className="text-lg font-semibold text-gray-900">Expertise</h3>
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
                                        <p className="text-sm font-medium text-gray-900 mb-1">Experience Level</p>
                                        <Badge variant="outline" className="border-indigo-200 text-indigo-700 text-sm px-3 py-1">
                                            {profileData.LevelOfExpertise || "Not specified"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Hash className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Skills & Tags</h3>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs px-2 py-1"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900">Professional Bio</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">{profileData.Bio || "No bio provided yet."}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Industry Experience</h3>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    {profileData.IndustryExperience || "No industry experience details provided yet."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
