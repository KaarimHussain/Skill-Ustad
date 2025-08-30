import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import AuthService from "./auth.service";
import CompaniesService from "./companies.service";

// Simplified company info interface
export interface CompanyInfo {
    id: string;
    name: string;
    location: string;
    email?: string;
}

// Job creation request interface
export interface PostJobRequest {
    title: string;
    jobLocation: string;
    jobType: string;
    workMode: string;
    salaryMin: string;
    salaryMax: string;
    currency: string;
    description: string;
    requirements: string;
    responsibilities: string;
    benefits: string;
    applicationDeadline: string;
    contactEmail: string;
    experienceLevel: string;
    department: string;
    skills: string[];
}

// Complete job interface
export interface PostJob extends PostJobRequest {
    id?: string;
    company: CompanyInfo;
    createdAt?: any;
    updatedAt?: any;
    status?: 'active' | 'inactive' | 'closed';
    applicationsCount?: number;
}

export interface JobApplication {
    id?: string;
    jobId: string;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    resume?: string;
    coverLetter?: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    appliedAt?: any;
}

export default class JobService {
    private static readonly JOBS_COLLECTION = "jobs";
    private static readonly APPLICATIONS_COLLECTION = "job-applications";

    /**
     * Get simplified company information
     */
    private static async getCompanyInfo(): Promise<CompanyInfo> {
        const userId = AuthService.getAuthenticatedUserId();
        const userEmail = AuthService.getUserEmail();
        const companyName = await CompaniesService.getCompanyName();

        if (!userId || !companyName) {
            throw new Error("Company information not found. Please ensure you're logged in.");
        }

        return {
            id: userId,
            name: companyName,
            location: "Remote", // Default - can be updated later
            email: userEmail || undefined,
        };
    }

    /**
     * Create a new job listing
     */
    static async createJob(jobData: PostJobRequest): Promise<string> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            throw new Error("Authentication required to create job listing");
        }

        const companyInfo = await this.getCompanyInfo();

        const jobToCreate: Omit<PostJob, 'id'> = {
            ...jobData,
            company: companyInfo,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'active',
            applicationsCount: 0
        };

        const docRef = await addDoc(collection(db, this.JOBS_COLLECTION), jobToCreate);
        return docRef.id;
    }

    /**
     * Get all jobs posted by the current company
     */
    static async getCompanyJobs(): Promise<PostJob[]> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            throw new Error("Authentication required");
        }

        const q = query(
            collection(db, this.JOBS_COLLECTION),
            where("company.id", "==", userId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as PostJob));
    }

    /**
     * Get all active jobs (for job seekers)
     */
    static async getAllActiveJobs(): Promise<PostJob[]> {
        const q = query(
            collection(db, this.JOBS_COLLECTION),
            where("status", "==", "active"),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as PostJob));
    }

    /**
     * Get a specific job by ID
     */
    static async getJobById(jobId: string): Promise<PostJob | null> {
        const docRef = doc(db, this.JOBS_COLLECTION, jobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as PostJob;
        }
        return null;
    }

    /**
     * Update a job listing (with ownership check)
     */
    static async updateJob(jobId: string, updates: Partial<PostJobRequest>): Promise<void> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            throw new Error("Authentication required");
        }

        const jobRef = doc(db, this.JOBS_COLLECTION, jobId);
        const jobDoc = await getDoc(jobRef);

        if (!jobDoc.exists() || jobDoc.data().company?.id !== userId) {
            throw new Error("Job not found or access denied");
        }

        await updateDoc(jobRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }

    /**
     * Delete a job listing (with ownership check)
     */
    static async deleteJob(jobId: string): Promise<void> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            throw new Error("Authentication required");
        }

        const jobRef = doc(db, this.JOBS_COLLECTION, jobId);
        const jobDoc = await getDoc(jobRef);

        if (!jobDoc.exists() || jobDoc.data().company?.id !== userId) {
            throw new Error("Job not found or access denied");
        }

        await deleteDoc(jobRef);
    }

    /**
     * Update job status
     */
    static async updateJobStatus(jobId: string, status: 'active' | 'inactive' | 'closed'): Promise<void> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            throw new Error("Authentication required");
        }

        const jobRef = doc(db, this.JOBS_COLLECTION, jobId);
        const jobDoc = await getDoc(jobRef);

        if (!jobDoc.exists() || jobDoc.data().company?.id !== userId) {
            throw new Error("Job not found or access denied");
        }

        await updateDoc(jobRef, {
            status,
            updatedAt: serverTimestamp()
        });
    }

    /**
     * Apply for a job
     */
    static async applyForJob(application: Omit<JobApplication, 'id' | 'appliedAt' | 'applicantId'>): Promise<string> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            throw new Error("Authentication required to apply for jobs");
        }

        // Check if already applied
        const existingApplicationQuery = query(
            collection(db, this.APPLICATIONS_COLLECTION),
            where("jobId", "==", application.jobId),
            where("applicantId", "==", userId)
        );

        const existingApplications = await getDocs(existingApplicationQuery);
        if (!existingApplications.empty) {
            throw new Error("You have already applied for this job");
        }

        const applicationToCreate = {
            ...application,
            applicantId: userId,
            appliedAt: serverTimestamp(),
            status: 'pending' as const
        };

        const docRef = await addDoc(collection(db, this.APPLICATIONS_COLLECTION), applicationToCreate);

        // Update job applications count
        const jobRef = doc(db, this.JOBS_COLLECTION, application.jobId);
        const jobDoc = await getDoc(jobRef);
        if (jobDoc.exists()) {
            const currentCount = jobDoc.data().applicationsCount || 0;
            await updateDoc(jobRef, {
                applicationsCount: currentCount + 1
            });
        }

        return docRef.id;
    }

    /**
     * Get applications for a specific job (for employers)
     */
    static async getJobApplications(jobId: string): Promise<JobApplication[]> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) {
            throw new Error("Authentication required");
        }

        // Verify job ownership
        const jobDoc = await getDoc(doc(db, this.JOBS_COLLECTION, jobId));
        if (!jobDoc.exists() || jobDoc.data().company?.id !== userId) {
            throw new Error("Job not found or access denied");
        }

        const q = query(
            collection(db, this.APPLICATIONS_COLLECTION),
            where("jobId", "==", jobId),
            orderBy("appliedAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as JobApplication));
    }

    /**
     * Update application status
     */
    static async updateApplicationStatus(
        applicationId: string,
        status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
    ): Promise<void> {
        const applicationRef = doc(db, this.APPLICATIONS_COLLECTION, applicationId);
        await updateDoc(applicationRef, { status });
    }
}