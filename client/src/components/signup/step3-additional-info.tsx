"use client"

import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "./ui-components"
import { IT_FIELDS } from "@/constants/signup"
import type { FormData, TouchedFields } from "@/types/signup"

interface Step3Props {
    formData: FormData
    touched: TouchedFields
    onInputChange: (field: string, value: string | boolean) => void
}

export const Step3AdditionalInfo = ({ formData, touched, onInputChange }: Step3Props) => {
    return (
        <div className="space-y-8 animate-in slide-in-from-right-5 duration-500">
            {/* Expertise Level */}
            <div className="space-y-3">
                <Label className="text-gray-700 font-medium text-base">Expertise Level</Label>
                <Select value={formData.expertiseLevel} onValueChange={(value) => onInputChange("expertiseLevel", value)}>
                    <SelectTrigger className="h-14 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 rounded-xl backdrop-blur-sm hover:bg-white/70">
                        <SelectValue placeholder="Select your expertise level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                </Select>
                {touched.expertiseLevel && !formData.expertiseLevel && (
                    <ErrorMessage message="Please select your expertise level" />
                )}
            </div>

            {/* Field of Expertise */}
            <div className="space-y-3">
                <Label className="text-gray-700 font-medium text-base">Field of Expertise</Label>
                <Select value={formData.fieldOfExpertise} onValueChange={(value) => onInputChange("fieldOfExpertise", value)}>
                    <SelectTrigger className="h-14 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 rounded-xl backdrop-blur-sm hover:bg-white/70">
                        <SelectValue placeholder="Select your field of expertise" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                        {IT_FIELDS.map((field) => (
                            <SelectItem key={field} value={field.toLowerCase().replace(/\s+/g, "-")}>
                                {field}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {touched.fieldOfExpertise && !formData.fieldOfExpertise && (
                    <ErrorMessage message="Please select your field of expertise" />
                )}
            </div>

            {/* Language Preference */}
            <div className="space-y-3">
                <Label className="text-gray-700 font-medium text-base">Preferred Language</Label>
                <Select value={formData.language} onValueChange={(value) => onInputChange("language", value)}>
                    <SelectTrigger className="h-14 text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 rounded-xl backdrop-blur-sm hover:bg-white/70">
                        <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="urdu">Urdu</SelectItem>
                    </SelectContent>
                </Select>
                {touched.language && !formData.language && <ErrorMessage message="Please select your preferred language" />}
            </div>

            {/* Additional Information */}
            <div className="space-y-3">
                <Label htmlFor="additionalInfo" className="text-gray-700 font-medium text-base">
                    Additional Information <span className="text-gray-500 font-normal">(Optional)</span>
                </Label>
                <div className="bg-blue-50/60 border border-blue-200/60 rounded-lg p-4 mb-3 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Help us personalize your experience!</p>
                            <p>
                                Share any additional details about your background, goals, or specific interests. The more we know about
                                you, the better we can tailor our AI recommendations and learning paths to match your unique needs and
                                aspirations.
                            </p>
                        </div>
                    </div>
                </div>
                <Textarea
                    id="additionalInfo"
                    placeholder="Tell us more about your goals, interests, or any specific areas you'd like to focus on..."
                    value={formData.additionalInfo}
                    onChange={(e) => onInputChange("additionalInfo", e.target.value)}
                    className="min-h-[120px] text-base bg-white/60 border-gray-300 focus:border-indigo-500 focus:bg-white/80 text-gray-900 placeholder-gray-500 rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-white/70 resize-none"
                    maxLength={500}
                />
                <div className="text-right text-sm text-gray-500">{formData.additionalInfo.length}/500 characters</div>
            </div>
        </div>
    )
}
