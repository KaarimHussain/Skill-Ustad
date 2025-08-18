import AuthService from "./auth.service";

export default class MentorProfileService {
    private static readonly baseUrl = import.meta.env.VITE_SERVER_URL;

    public static async getData() {
        const mentorId = AuthService.getAuthenticatedUserId();
        try {
            const response = await fetch(`${this.baseUrl}/api/additionalinfo/get-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mentorId)
            })

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch data: ${errorText}`);
            }

            // Assuming your API returns JSON
            const data = await response.json();
            // console.log("Additional Info Fetched Data", data);
            return data;
        } catch (error: any) {
            throw new Error(error.message || "An error occurred while fetching mentor data");
        }
    }
}