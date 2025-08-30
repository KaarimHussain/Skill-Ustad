export interface CompanyPendingRequestDto {
    id: number;
    companyName: string;
    workEmail: string;
    website: string;
    createdAt: string;
}

export default class CompaniesPendingService {
    private static readonly BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5018";

    static async getCompaniesPending(): Promise<CompanyPendingRequestDto[]> {
        const response = await fetch(`${this.BASE_URL}/api/request`);
        if (!response.ok) {
            throw new Error('Failed to fetch companies pending');
        }
        return response.json();
    }

    static async sendApproved(id: number) {
        try {
            const response = await fetch(`${this.BASE_URL}/api/request/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            })

            console.log("API RESPONSE:", response)

            if (response.ok) {
                return true;
            }
        } catch (error: any) {
            console.error("Error Approving Company:", error);
        }
    }

    static async sendReject(id: number) {
        try {
            const response = await fetch(`${this.BASE_URL}/api/request/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            })

            console.log("API RESPONSE:", response)

            if (response.ok) {
                return true;
            }
        } catch (error: any) {
            console.error("Error Rejecting Company:", error);

        }
    }

}