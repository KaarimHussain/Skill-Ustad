export interface FormData {
    // Step 1
    name: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
    acceptMarketing: boolean
    // Step 2
    profilePicture: string | null
    // Step 3
    expertiseLevel: string
    fieldOfExpertise: string
    language: string
    additionalInfo: string
}

export interface TouchedFields {
    name: boolean
    email: boolean
    password: boolean
    confirmPassword: boolean
    expertiseLevel: boolean
    fieldOfExpertise: boolean
    language: boolean
}

export interface ValidationErrors {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface PasswordValidation {
    isValid: boolean
    message: string
    requirements: {
        length: boolean
        uppercase: boolean
        lowercase: boolean
        number: boolean
        special: boolean
    }
}
