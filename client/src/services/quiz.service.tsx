import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import AuthService from "./auth.service";
import axios from "axios";

export interface Question {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
}

export interface QuizData {
    title: string
    userId?: string
    description: string
    duration: number
    difficulty: "beginner" | "intermediate" | "advanced"
    tags: string[]
    questions: Question[]
    isPublic: boolean
    createdAt?: Timestamp
    status: QuizStatus
}

export interface QuizDataWithId extends QuizData {
    id: string;
}

export interface QuizDataWithRatingAndAttemptCount extends QuizDataWithId {
    rating: number
    attemptCount: number
}


export interface QuizAiRequest {
    title: string
    description: string,
    difficulty: "beginner" | "intermediate" | "advanced"
    questionCount?: number
}

export interface QuizFirebaseResponse {
    id: string
    createdAt: Timestamp
    description: string
    difficulty: "beginner" | "intermediate" | "advanced"
    isPublic: boolean
    questions: Question[]
    status: QuizStatus
    tags: string[]
    title: string
    userId: string
    duration: number
}

export interface QuizAttempt {
    id?: string
    quizId: string
    userId: string
    answers: { [questionIndex: number]: number }
    score: number
    totalQuestions: number
    correctAnswers: number
    timeSpent: number
    completedAt: Date
    startedAt: Date
}

export interface QuizRating {
    id?: string
    quizId: string
    userId: string
    rating: number
    comment: string
    createdAt: Date
}

interface QuizStatus {
    status: "Active" | "Draft" | "Archived" | "Private"
}

export default class QuizService {

    private static readonly baseUrl = import.meta.env.VITE_PYTHON_SERVER_URL;

    static async fetchAll() {
        const snapshot = await getDocs(collection(db, "quizes"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async fetchAllAvalible(): Promise<QuizDataWithRatingAndAttemptCount[]> {
        const snapshot = await getDocs(query(collection(db, "quizes"), where("status.status", "==", "Active"), orderBy("createdAt", "asc")));

        const quizzes = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const quizData = { id: doc.id, ...doc.data() } as QuizDataWithId;

                // Get ratings for this quiz
                const ratings = await this.getQuizRatings(doc.id);
                const averageRating = ratings.length > 0
                    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
                    : 0;

                // Get attempt count for this quiz
                const attempts = await this.getQuizAttempts(doc.id);
                const attemptCount = attempts.length;

                return {
                    ...quizData,
                    rating: averageRating,
                    attemptCount
                } as QuizDataWithRatingAndAttemptCount;
            })
        );

        return quizzes;
    }

    static async fetchQuizWithId(id: string) {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return null;

        // Get reference to the specific document
        const quizRef = doc(db, "quizes", id);

        // Fetch the document
        const quizSnap = await getDoc(quizRef);

        // Return the data if exists
        if (quizSnap.exists()) {
            return { id: quizSnap.id, ...quizSnap.data() } as QuizDataWithId;
        } else {
            return null; // Quiz not found
        }
    }

    static async fetchCurrentUserQuiz(): Promise<QuizFirebaseResponse[]> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return [];

        const roadmapRef = collection(db, "quizes");
        const q = query(roadmapRef, where("userId", "==", userId), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as QuizFirebaseResponse[]; // Add type assertion here
    }

    static async addQuiz(quizData: QuizData): Promise<string | null> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return null;
        // Adding User Id to Quiz Data
        quizData.userId = userId;
        quizData.createdAt = Timestamp.now();
        try {
            const docRef = await addDoc(collection(db, "quizes"), quizData);
            return docRef.id; // Success
        } catch (error) {
            console.error("Error adding quiz to Firebase:", error);
            return null; // Failure
        }
    }

    static async updateQuiz(quizData: QuizDataWithId): Promise<boolean> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return false;

        try {
            const quizRef = doc(db, "quizes", quizData.id);

            // Prevent overwriting createdAt and id
            const { id, createdAt, ...updateData } = quizData;

            await updateDoc(quizRef, {
                ...updateData,
                userId, // ensure current user owns the quiz
                updatedAt: Timestamp.now()
            });

            return true; // success
        } catch (error) {
            console.error("Error updating quiz in Firebase:", error);
            return false; // failure
        }
    }

    static async fetchQuestionsWithAi(
        data: QuizAiRequest
    ): Promise<{ questions: Question[] }> {
        try {
            const response = await axios.post<{ questions: Question[] }>(
                `${this.baseUrl}/quiz/questions/generate`,
                {
                    title: data.title.trim(),
                    description: data.description.trim(),
                    difficulty: data.difficulty,
                    questionCount: data.questionCount ?? 5, // Default to 5 if not provided
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            console.log("AI response related to questions", response.data);
            return response.data; // { questions: [...] }

        } catch (error: any) {
            if (error.response) {
                // Server responded with error status
                console.error('AI Generation Error:', error.response.data);
                throw new Error(
                    error.response.data.message || 'Failed to generate questions. Please try again.'
                );
            } else if (error.request) {
                // No response received
                console.error('No response received:', error.request);
                throw new Error('No response from server. Is the backend running?');
            } else {
                // Something else happened
                console.error('Error:', error.message);
                throw new Error('An unexpected error occurred.');
            }
        }
    }

    static async saveQuizAttempt(attemptData: Omit<QuizAttempt, "id">): Promise<string | null> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return null;

        try {
            const docRef = await addDoc(collection(db, "quizAttempts"), attemptData);
            return docRef.id;
        } catch (error) {
            console.error("Error saving quiz attempt:", error);
            return null;
        }
    }

    static async saveRating(rating: number, comment: string, quizId: string): Promise<string | null> {
        const userId = AuthService.getAuthenticatedUserId();
        if (!userId) return null;

        const ratingData: Omit<QuizRating, "id"> = {
            quizId,
            userId,
            comment,
            rating,
            createdAt: new Date()
        };

        try {
            const docRef = await addDoc(collection(db, "quizRatings"), ratingData);
            return docRef.id;
        } catch (error) {
            console.error("Error saving quiz rating:", error);
            return null;
        }
    }

    static async getQuizRatings(quizId: string): Promise<QuizRating[]> {
        const ratingsRef = collection(db, "quizRatings");
        const q = query(ratingsRef, where("quizId", "==", quizId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizRating));
    }

    static async getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
        const attemptsRef = collection(db, "quizAttempts");
        const q = query(attemptsRef, where("quizId", "==", quizId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt));
    }

}