export interface IStatsCount {
    totalStudents: number,
    totalMentor: number,
    totalCompanies: number,
    companiesPendingRequest: number
}

export default class AdminDashboardService {
    private static readonly BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/admin-dashboard`;

    static async getStatsCount(): Promise<IStatsCount> {
        const response = await fetch(`${this.BASE_URL}/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("STATS DATA RESPONSE:", data);
        return data as IStatsCount;
    }
}