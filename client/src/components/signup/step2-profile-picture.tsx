import { ProfilePictureUpload } from "./profile-picture-upload"
import type { FormData } from "@/types/signup"

interface Step2Props {
    formData: FormData
    onInputChange: (field: string, value: string | boolean) => void
}

export const Step2ProfilePicture = ({ formData, onInputChange }: Step2Props) => {
    return (
        <div className="space-y-8 animate-in slide-in-from-right-5 duration-500">
            <ProfilePictureUpload
                profilePicture={formData.profilePicture}
                onProfilePictureChange={(file) => onInputChange("profilePicture", file)}
            />
        </div>
    )
}
