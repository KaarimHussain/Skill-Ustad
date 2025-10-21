import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface MentorFeedbackData {
    mentorId: string;
    userId: string;
    rating: number; // For example, 1-5
    feedback: string;
    createdAt?: Timestamp; // Will be set on server
}

export interface MentorFeedbackWithId extends MentorFeedbackData {
    id: string;
}

export default class MentorFeedbackService {
    static async submitFeedback(feedbackData: MentorFeedbackData) {
        try {
            const docRef = await addDoc(collection(db, "mentor_feedbacks"), {
                mentorId: feedbackData.mentorId,
                userId: feedbackData.userId,
                rating: feedbackData.rating,
                feedback: feedbackData.feedback,
                createdAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error: any) {
            console.error("Error submitting mentor feedback:", error);
            throw error;
        }
    }

    static async getFeedbacksByMentorId(mentorId: string): Promise<MentorFeedbackWithId[]> {
        try {
            const q = query(
                collection(db, "mentor_feedbacks"),
                where("mentorId", "==", mentorId),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const feedbacks: MentorFeedbackWithId[] = [];

            querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                const data = doc.data();
                feedbacks.push({
                    id: doc.id,
                    mentorId: data.mentorId,
                    userId: data.userId,
                    rating: data.rating,
                    feedback: data.feedback,
                    createdAt: data.createdAt
                });
            });

            return feedbacks;
        } catch (error: any) {
            console.error("Error fetching mentor feedbacks:", error);
            throw error;
        }
    }
}