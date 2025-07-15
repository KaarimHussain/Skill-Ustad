"use client"

import type React from "react"

import { useRef } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfilePictureUploadProps {
    profilePicture: string | null
    onProfilePictureChange: (file: string | boolean) => void
}

export const ProfilePictureUpload = ({ profilePicture, onProfilePictureChange }: ProfilePictureUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                onProfilePictureChange(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemove = () => {
        onProfilePictureChange(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="relative">
                {profilePicture ? (
                    <div className="relative">
                        <img
                            src={profilePicture || "/placeholder.svg"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-lg"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>

            <div className="text-center space-y-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Add Your Profile Picture</h3>
                    <p className="text-gray-600 text-sm max-w-md">
                        Upload a clear photo of yourself. This helps others recognize you and makes your profile more personal.
                        Recommended: Square image, at least 200x200 pixels.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={handleUploadClick}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <Upload className="w-5 h-5 mr-2" />
                    {profilePicture ? "Change Picture" : "Upload Picture"}
                </Button>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max size: 5MB)</p>
            </div>
        </div>
    )
}
