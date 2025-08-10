// src/services/EmailService.ts
export default class EmailService {
    private static baseUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

    static async sendPasswordReset(email: string) {
        try {
            const response = await fetch(`${this.baseUrl}/api/forget-password/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to send password reset email");
            }

            return await response.json();
        } catch (error: any) {
            console.error("EmailService.sendPasswordReset error:", error.message);
            throw error;
        }
    }
    static async resendPasswordReset(email: string) {
        try {
            console.log('Sending resend request for:', email);

            const response = await fetch(`${this.baseUrl}/api/forget-password/resend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            // Get response text first to handle empty responses
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                let errorMessage = "Failed to resend password reset email";

                if (responseText) {
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        console.error('Failed to parse error response:', parseError);
                        errorMessage = responseText || errorMessage;
                    }
                }
                throw new Error(errorMessage);
            }

            // Handle successful response
            if (responseText.trim()) {
                try {
                    const data = JSON.parse(responseText);
                    console.log('Parsed success response:', data);
                    return data;
                } catch (parseError) {
                    console.error('Failed to parse success response:', parseError);
                    console.log('Raw response text:', responseText);
                    return { message: "Password reset email sent successfully" };
                }
            } else {
                console.warn('Empty response received');
                return { message: "Password reset email sent successfully" };
            }

        } catch (error) {
            console.error("EmailService.resendPasswordReset detailed error:", error);
            throw error;
        }
    }
}
