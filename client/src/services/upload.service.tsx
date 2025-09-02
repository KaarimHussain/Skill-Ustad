import axios from 'axios';

class UploadService {
    private readonly BASE_URL = import.meta.env.VITE_SERVER_URL;
    private readonly API_URL = `${this.BASE_URL}/api/cloudinary`;

    /**
     * Upload a file to Cloudinary via the backend API
     * @param file The file to upload (PDF or DOCX)
     * @returns Promise with the secure URL of the uploaded file
     */
    async uploadFile(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${this.API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("SERVICE UPLOAD API RESPONSE:", response.data)

            return response.data.url;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file');
        }
    }

    /**
     * Validate if the file is a valid resume format (PDF or DOCX)
     * @param file The file to validate
     * @returns Boolean indicating if the file is valid
     */
    isValidResumeFile(file: File): boolean {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        return validTypes.includes(file.type);
    }
}

export default new UploadService();