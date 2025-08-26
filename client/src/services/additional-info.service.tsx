import type { CheckAdditionalInfoRequest } from "@/dtos/checkAdditionalInfoRequest";
import type { MentorAdditionalInfoRequest, MentorInfoTagsRequest } from "@/dtos/mentorAdditionalInfoRequest";
import type { StudentAdditionalInfoRequest } from "@/dtos/usersAdditionalInfoRequest";

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

    public static async addMentorAdditionalInfo(info: MentorAdditionalInfoRequest, tags: MentorInfoTagsRequest[]) {
        try {
            const response = await fetch(`${this.baseUrl}/api/additionalinfo/mentor-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ info, tags })
            })

            if (response.ok) {
                console.log("Mentor Additional Info Added Successfuly ");
                return await response.json();
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async addUserAdditionalInfo(info: StudentAdditionalInfoRequest) {
        try {
            const response = await fetch(`${this.baseUrl}/api/additionalinfo/student-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ info })
            })

            if (response.ok) {
                console.log("Student Additional Info Added Successfuly ");
                return await response.json();
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}