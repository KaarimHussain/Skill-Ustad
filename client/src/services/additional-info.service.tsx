import type { CheckAdditionalInfoRequest } from "@/dtos/checkAdditionalInfoRequest";

export default class AddtionalInfoService {
    private static readonly baseUrl = import.meta.env.VITE_SERVER_URL;

    public static async infoCheck(request: CheckAdditionalInfoRequest): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/api/additionalinfo/info-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            console.error("Failed to fetch the Info Data");
            return false;
        }

        return await response.json();
    }
}