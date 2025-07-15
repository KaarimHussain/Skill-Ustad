import type { PasswordValidation } from "@/types/signup"

export const validateName = (name: string): string => {
    if (!name) return "Full name is required"
    if (name.length < 2) return "Name must be at least 2 characters long"
    if (name.length > 50) return "Name must be less than 50 characters"
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces"
    return ""
}

export const validateEmail = (email: string): string => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
}

export const validatePassword = (password: string): PasswordValidation => {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    const isValid = Object.values(requirements).every(Boolean)
    if (!password) return { isValid: false, message: "Password is required", requirements }
    if (!isValid) return { isValid: false, message: "Password doesn't meet all requirements", requirements }
    return { isValid: true, message: "Password is strong!", requirements }
}

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return ""
}
