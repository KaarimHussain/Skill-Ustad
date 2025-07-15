import React from "react"
import { AlertCircle, CheckCircle, Check, X } from "lucide-react"
import { PASSWORD_REQUIREMENTS } from "@/constants/signup"
import type { PasswordValidation } from "@/types/signup"

// Error message component
export const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1 animate-in slide-in-from-left-2 duration-200">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
    </div>
)

// Success message component
export const SuccessMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-2 text-green-600 text-sm mt-1 animate-in slide-in-from-left-2 duration-200">
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
    </div>
)

// Progress indicator component
export const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
                {Array.from({ length: totalSteps }, (_, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${index + 1 <= currentStep ? "bg-indigo-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {index + 1 <= currentStep ? <Check className="w-5 h-5" /> : index + 1}
                        </div>
                        {index < totalSteps - 1 && (
                            <div
                                className={`w-12 h-1 rounded-full transition-all duration-300 ${index + 1 < currentStep ? "bg-indigo-500" : "bg-gray-200"
                                    }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

// Password requirements component
export const PasswordRequirements = ({
    requirements,
    password,
}: { requirements: PasswordValidation["requirements"]; password: string }) => {
    if (!password) return null

    return (
        <div className="mt-3 p-4 bg-gray-100/60 rounded-lg border border-gray-200/60 backdrop-blur-sm">
            <p className="text-gray-700 text-sm font-medium mb-3">Password Requirements:</p>
            <div className="space-y-2">
                {PASSWORD_REQUIREMENTS.map((req) => (
                    <div key={req.key} className="flex items-center gap-2 text-sm">
                        {requirements[req.key] ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={requirements[req.key] ? "text-green-600" : "text-gray-500"}>{req.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
