import type { Timestamp } from "firebase/firestore";

export interface QuizData {
    id: string; // Firebase document ID
    title: string;
    description: string;
    status: "active" | "inactive" | "draft"; // Card shows "Active"
    createdAt: Timestamp; // timestamp in ms
    updatedAt?: Timestamp; // optional

    // Quiz meta
    totalQuestions: number;
    durationMinutes: number; // e.g., 30
    totalAttempts: number;

    // Ratings
    averageRating: number; // e.g., 4.8
    totalReviews: number; // e.g., 24

    // Relationships
    createdBy: string; // userId of quiz creator
}

export interface QuizQuestion {
    id: string;
    questionText: string;
    options: string[]; // ["Option A", "Option B", ...]
    correctAnswerIndex: number; // index in options array
    explanation?: string; // optional explanation
}

export interface QuizReview {
    userId: string;
    rating: number; // 1–5
    reviewText?: string;
    createdAt: number; // timestamp
}

export interface QuizAttempt {
    userId: string;
    quizId: string;
    score: number; // in percentage
    correctAnswers: number;
    totalQuestions: number;
    completedAt: number; // timestamp
    durationTakenMinutes: number;
}
