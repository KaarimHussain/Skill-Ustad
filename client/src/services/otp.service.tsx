export default class OtpService {
    private static readonly baseUrl = import.meta.env.VITE_SERVER_URL;

    public static async verifyOtp(email: string, otp: string) {
        try {
            const response = await fetch(`${this.baseUrl}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "OTP verification failed")
            }

            return await response.json()
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public static async resendOtp(email: string) {
        try {
            const response = await fetch(`${this.baseUrl}/api/auth/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to send OTP. Please try again later!")
            }

            return await response.json()
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

}