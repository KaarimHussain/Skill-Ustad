import axios from "axios"
import type { StoredUser } from "./auth.service"
import AuthService from "./auth.service"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

export interface CompanyLoginRequest {
    CompanyEmail: string,
    Password: string
}

export interface CompanyRegisterRequest {
    companyName: string,
    companyEmail: string,
    website: string,
    password: string
}

// Update your CompanyAdditionalInfo interface to match the backend DTO
export interface CompanyAdditionalInfoRequest {
    CompanyId: number;
    ContactPersonName: string;
    ContactPersonTitle: string;
    WorkPhone: string;
    Industry: string;
    BusinessType: string;
    Country: string;
    City: string;
    EmployeeCount: number | null;
    CompanyDescription: string;
    LinkedInUrl: string | null;
}

export interface CompanyDashboardStats {
    totalJobs: number,
    totalApplications: number
}

export default class CompaniesService {
    private static readonly BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5018"
    private static readonly TOKEN_KEY = "skillUstad_token"
    private static readonly USER_KEY = "skillUstad_user"

    static async Login(request: CompanyLoginRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/company/auth/login`, request)

            // Store token and user data
            if (response.data.token && response.data.user) {
                this.storeAuthData(response.data.token, response.data.user, response.data.userType)
            }

            return response.data;
        } catch (error: any) {
            console.error("Error Logging In: ", error)

            // Extract error message from backend response
            let errorMessage = "Login failed. Please try again.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data) {
                errorMessage = typeof error.response.data === 'string'
                    ? error.response.data
                    : "Login failed. Please check your credentials.";
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Throw error so it can be caught in the frontend
            throw new Error(errorMessage);
        }
    }
    static async Register(request: CompanyRegisterRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/company/auth/register`, request)

            if (response.status === 200) {
                return response.data;
            }
        } catch (error: any) {
            console.error("Error Registering: ", error)
            return error.response.data.message;
        }
    }
    private static storeAuthData(token: string, user: any, userType: string): void {
        console.log("User Data From API: TOKEN", token);
        console.log("User Data From API: USER", user);
        console.log("User Data From API: USER TYPE", userType);

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
    static async getCompanyName() {
        const user = AuthService.getAuthenticatedUserData();
        console.log("User Data From Local Storage: USER", user);

        if (user == null) return null;
        return user?.name;
    }
    static async CheckCompanyAdditionalInfo(id: string): Promise<boolean> {
        const response = await fetch(`${this.BASE_URL}/api/company/additional-info/info-check`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(id)
        });
        const data = await response.json()
        console.log("ADDITIONAL INFO CHECK (EXIST OR NOT): ", data)
        if (!data.exists) return false;
        return true;
    }
    static async AddAdditionalInfo(request: CompanyAdditionalInfoRequest) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/company/additional-info/add`, request, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                return response.data;
            }
        } catch (error: any) {
            console.error("Error adding additional info: ", error);

            // Extract error message from backend response
            let errorMessage = "Failed to save company information.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            throw new Error(errorMessage);
        }
    }
    static async GetCompanyStats(): Promise<CompanyDashboardStats> {
        try {
            const userId = AuthService.getAuthenticatedUserId();
            if (!userId) {
                throw new Error("User not authenticated");
            }

            // Get jobs count
            const jobsRef = collection(db, "jobs");
            const jobsQuery = query(jobsRef, where("companyId", "==", userId));
            const jobsSnapshot = await getDocs(jobsQuery);
            const totalJobs = jobsSnapshot.size;

            // Get applications count
            const applicationsRef = collection(db, "job-applications");
            const applicationsQuery = query(applicationsRef, where("companyId", "==", userId));
            const applicationsSnapshot = await getDocs(applicationsQuery);
            const totalApplications = applicationsSnapshot.size;

            return {
                totalJobs,
                totalApplications
            };
        } catch (error) {
            console.error("Error fetching company stats:", error);
            return {
                totalJobs: 0,
                totalApplications: 0
            };
        }
    }
}