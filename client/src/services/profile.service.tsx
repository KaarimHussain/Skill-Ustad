import axios from "axios";

export interface StudentProfileDto {
    id: string;
    name: string;
    profilePicture: string | null;
    address: string;
    city: string;
    currentLevelOfEducation: string;
    fieldOfExpertise: string;
    gender: string;
    levelOfExpertise: string;
    user: any | null;
    userId: string;
    userInterestsAndGoals: string;
}

export interface StudentProfileUpdateRequest {
    name: string;
    address: string;
    city: string;
    currentLevelOfEducation: string;
    fieldOfExpertise: string;
    gender: string;
    levelOfExpertise: string;
    userInterestsAndGoals: string;
}

export default class ProfileService {

    private static readonly BASE_URL = import.meta.env.VITE_SERVER_URL;

    static async getStudentProfile(studentId: string) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/profile/student`, { studentId });
            return response.data;
        } catch (error) {
            console.error('Error fetching student profile:', error);
            throw error;
        }
    }

    static async getMentorProfile(mentorId: string) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/profile/mentor`, { mentorId });
            return response.data;
        } catch (error) {
            console.error('Error fetching mentor profile:', error);
            throw error;
        }
    }

    static async updateStudentProfile(studentId: string, profileData: StudentProfileUpdateRequest) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/profile/student/${studentId}`, profileData);
            return response.data;
        } catch (error) {
            console.error('Error updating student profile:', error);
            throw error;
        }
    }

    static async changeProfilePicture(studentId: string, pictureFile: File) {
        try {
            const formData = new FormData();
            formData.append('profilePicture', pictureFile);

            const response = await axios.put(`${this.BASE_URL}/api/profile/student/${studentId}/picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error changing profile picture:', error);
            throw error;
        }
    }
}