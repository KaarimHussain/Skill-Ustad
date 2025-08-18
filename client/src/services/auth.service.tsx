import axios from "axios"
import OtpService from "./otp.service"

// Types for the registration request
export interface RegisterRequest {
    Name: string
    Email: string
    Password?: string
    OAuthProvider?: string
    OAuthId?: string
    ProfilePicture?: string
    UserType: string
}

// Types for the login request
export interface LoginRequest {
    Email: string
    Password: string
}

// Types for Google login payload
export interface GoogleLoginPayload {
    IdToken: string // This will be the JWT ID token from Google
    Email: string
    Name: string
    Picture: string
    UserType?: string // Optional, for initial signup flow if needed
}

// Types for API responses
export interface AuthResponse {
    message: string
    userType: string
    token?: string
    user?: {
        id: string
        name: string
        email: string
        profilePicture?: string
    }
}

export interface ApiError {
    message: string
    status: number
    otpEmail: string | null
    otpError: boolean
}

// Types for stored user data
export interface StoredUser {
    id: string
    name: string
    email: string
    profilePicture?: string
    userType: string
    token: string
}

interface GoogleProfile {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
    // Add other fields you might get from the Google API if needed
}

export default class AuthService {
    private static readonly BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5018"
    private static readonly API_BASE = `${AuthService.BASE_URL}/api/auth`
    private static readonly TOKEN_KEY = "skillUstad_token"
    private static readonly USER_KEY = "skillUstad_user"

    // Configure axios instance with minimal interceptors
    private static axiosInstance = axios.create({
        baseURL: AuthService.API_BASE,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    })

    // Simple request interceptor - only add token, no error handling
    static {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            },
        )

        // REMOVED the response interceptor that was causing redirects
        // This was likely causing the page refresh on 401 errors
    }

    /**
     * Register a new user (both normal and OAuth registration)
     */
    static async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            console.log("🚀 Sending registration request:", data)

            const response = await this.axiosInstance.post<AuthResponse>("/register", data)

            console.log("✅ Registration successful:", response.data)

            // If OAuth registration, store token and user data
            if (response.data.token && response.data.user) {
                this.storeAuthData(response.data.token, response.data.user, response.data.userType)
            }

            return response.data
        } catch (error) {
            console.error("❌ Registration failed:", error)

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || error.response?.data || error.message || "Registration failed"

                throw {
                    message: typeof errorMessage === "string" ? errorMessage : "Registration failed",
                    status: error.response?.status || 500,
                } as ApiError
            }

            throw {
                message: "Network error occurred",
                status: 0,
            } as ApiError
        }
    }

    /**
     * Login user with email and password - FIXED VERSION
     */
    static async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            console.log("🚀 Sending login request for:", data.Email)

            // Make the API call without any interceptor interference
            const response = await axios.post<AuthResponse>(`${this.API_BASE}/login`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })

            console.log("✅ Login successful:", response.data)

            // Store token and user data
            if (response.data.token && response.data.user) {
                this.storeAuthData(response.data.token, response.data.user, response.data.userType)
            }

            return response.data
        } catch (error: any) {
            console.error("❌ Login failed:", error)
            var isOtpError = false;
            var otpEmail = null;
            // Handle axios errors properly without causing page refresh
            if (error.response.data.otpError) {
                await OtpService.resendOtp(error.response.data.otpEmail)
                isOtpError = true;
                otpEmail = error.response.data.otpEmail;
            }
            if (axios.isAxiosError(error)) {
                let errorMessage = "Login failed. Please try again."

                if (error.response?.data) {
                    // Handle different response formats
                    if (typeof error.response.data === "string") {
                        errorMessage = error.response.data
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message
                    } else if (error.response.data.Message) {
                        errorMessage = error.response.data.Message
                    }
                } else if (error.message) {
                    errorMessage = error.message
                }

                // Create a clean error object
                const apiError: ApiError = {
                    message: errorMessage,
                    status: error.response?.status || 500,
                    otpError: isOtpError,
                    otpEmail: otpEmail,
                }

                // Throw the error without any side effects
                throw apiError
            }

            // Handle non-axios errors
            throw {
                message: "Network error occurred. Please check your connection.",
                status: 0,
            } as ApiError
        }
    }

    /**
     * Login user with Google OAuth
     */
    static async googleLogin(data: GoogleLoginPayload): Promise<AuthResponse> {
        try {
            console.log("🚀 Sending Google login request for:", data.Email)

            const response = await axios.post<AuthResponse>(`${this.API_BASE}/google-login`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            })

            console.log("✅ Google login successful:", response.data)

            // Store token and user data
            if (response.data.token && response.data.user) {
                this.storeAuthData(response.data.token, response.data.user, response.data.userType)
            }

            return response.data
        } catch (error) {
            console.error("❌ Google login failed:", error)

            if (axios.isAxiosError(error)) {
                let errorMessage = "Google login failed. Please try again."

                if (error.response?.data) {
                    if (typeof error.response.data === "string") {
                        errorMessage = error.response.data
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message
                    } else if (error.response.data.Message) {
                        errorMessage = error.response.data.Message
                    }
                } else if (error.message) {
                    errorMessage = error.message
                }

                const apiError: ApiError = {
                    message: errorMessage,
                    status: error.response?.status || 500,
                    otpEmail: null,
                    otpError: false
                }
                throw apiError
            }

            throw {
                message: "Network error occurred. Please check your connection.",
                status: 0,
            } as ApiError
        }
    }

    /**
     * Verify current token and get user info
     */
    static async verifyToken(): Promise<AuthResponse> {
        try {
            const response = await this.axiosInstance.get<AuthResponse>("/verify")
            return response.data
        } catch (error) {
            console.error("❌ Token verification failed:", error)
            this.clearAuthData()

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || error.response?.data || error.message || "Token verification failed"

                throw {
                    message: typeof errorMessage === "string" ? errorMessage : "Token verification failed",
                    status: error.response?.status || 500,
                } as ApiError
            }

            throw {
                message: "Network error occurred",
                status: 0,
            } as ApiError
        }
    }

    /**
     * Store authentication data in localStorage
     */
    private static storeAuthData(token: string, user: any, userType: string): void {
        try {
            const userData: StoredUser = {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                profilePicture: user.ProfilePicture,
                userType: userType,
                token: token,
            }

            localStorage.setItem(this.TOKEN_KEY, token)
            localStorage.setItem(this.USER_KEY, JSON.stringify(userData))

            console.log("✅ Auth data stored successfully")
        } catch (error) {
            console.error("❌ Failed to store auth data:", error)
        }
    }

    // Get User ID
    public static getAuthenticatedUserId(): string | null {
        const isAuthenticated = this.isAuthenticated()
        if (!isAuthenticated) {
            return null;
        } else {
            const token = this.getUser()?.token;
            const userId = this.decodeToken(token || "");
            if (userId) {
                return userId.UserId;
            } else {
                return null
            }
        }
    }

    public static getUserEmail(): string | null {
        const isAuthenticated = this.isAuthenticated()
        if (!isAuthenticated) {
            return null;
        } else {
            const token = this.getUser()?.token;
            const email = this.decodeToken(token || "");
            if (email) {
                return email.email;
            } else {
                return null
            }
        }
    }

    public static getAuthenticatedUserData() {
        const token = this.getToken();

        if (token == null || token == undefined) {
            return
        }
        const data = this.decodeToken(token);
        return data;
    }

    /**
     * Get stored token
     */
    static getToken(): string | null {
        try {
            return localStorage.getItem(this.TOKEN_KEY)
        } catch (error) {
            console.error("❌ Failed to get token:", error)
            return null
        }
    }

    /**
     * Get stored user data
     */
    static getUser(): StoredUser | null {
        try {
            const userData = localStorage.getItem(this.USER_KEY)
            return userData ? JSON.parse(userData) : null
        } catch (error) {
            console.error("❌ Failed to get user data:", error)
            return null
        }
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        const token = this.getToken()
        const user = this.getUser()
        return !!(token && user)
    }

    /**
     * Get user type (Student or Mentor)
     */
    static getUserType(): string | null {
        const user = this.getUser()
        return user?.userType || null
    }

    /**
     * Clear all authentication data
     */
    static clearAuthData(): void {
        try {
            localStorage.removeItem(this.TOKEN_KEY)
            localStorage.removeItem(this.USER_KEY)
            console.log("✅ Auth data cleared")
        } catch (error) {
            console.error("❌ Failed to clear auth data:", error)
        }
    }

    /**
     * Logout user
     */
    static logout(): void {
        this.clearAuthData()
        // Don't automatically redirect - let the component handle it
    }

    /**
     * Get redirect URL based on user type
     */
    static getRedirectUrl(userType: string): string {
        return userType.toLowerCase() === "mentor" ? "/mentor/dashboard" : "/user/dashboard"
    }

    /**
     * Helper method to validate registration data before sending
     */
    static validateRegistrationData(data: RegisterRequest): string[] {
        const errors: string[] = []

        if (!data.Name?.trim()) {
            errors.push("Name is required")
        }

        if (!data.Email?.trim()) {
            errors.push("Email is required")
        }

        if (!data.UserType?.trim()) {
            errors.push("User type is required")
        }

        // For OAuth registration, we don't need password
        const isOAuthRegistration = data.OAuthProvider && data.OAuthId

        if (!isOAuthRegistration && !data.Password?.trim()) {
            errors.push("Password is required for normal registration")
        }

        if (isOAuthRegistration && (!data.OAuthProvider?.trim() || !data.OAuthId?.trim())) {
            errors.push("OAuth provider and ID are required for OAuth registration")
        }

        return errors
    }

    /**
     * Helper method to check if the server is reachable
     */
    static async checkServerHealth(): Promise<boolean> {
        try {
            await axios.get(`${this.BASE_URL}/health`, { timeout: 5000 })
            return true
        } catch {
            return false
        }
    }

    /**
     * Decode JWT token (client-side only for display purposes)
     */
    public static decodeToken(token: string): any {
        try {
            const base64Url = token.split(".")[1]
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join(""),
            )
            return JSON.parse(jsonPayload)
        } catch (error) {
            console.error("❌ Failed to decode token:", error)
            return null
        }
    }

    static async decodeGoogleToken(accessToken: string): Promise<GoogleProfile> {
        try {
            const response = await axios.get<GoogleProfile>(
                'https://www.googleapis.com/oauth2/v3/userinfo', // Or 'https://openidconnect.googleapis.com/v1/userinfo'
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching Google profile:', error.response?.data || error.message);
                throw new Error(`Failed to fetch Google profile: ${error.response?.data?.error_description || error.message}`);
            } else {
                console.error('An unexpected error occurred:', error);
                throw new Error('An unexpected error occurred while fetching Google profile.');
            }
        }
    }

    /**
     * Check if token is expired (client-side check)
     */
    static isTokenExpired(token?: string): boolean {
        try {
            const tokenToCheck = token || this.getToken()
            if (!tokenToCheck) return true

            const decoded = this.decodeToken(tokenToCheck)
            if (!decoded || !decoded.exp) return true

            const currentTime = Date.now() / 1000
            return decoded.exp < currentTime
        } catch (error) {
            console.error("❌ Failed to check token expiration:", error)
            return true
        }
    }
}
