import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs } from "firebase/firestore";
import AuthService from "./auth.service"
import { db } from "@/lib/firebase";

export interface CourseSection {
    id: string
    type: "text" | "code" | "video" | "link" | "image" | "reading" | "achievement" | "note" | "tip"
    title: string
    content: string
    language?: string | null
    options?: string[] | null
    correctAnswer?: number | null
    duration?: number | null
}
export interface CourseData {
    title: string
    description: string
    sections: CourseSection[]
    totalSections: number
    createdAt: string
    userId?: string,
    id?: string
}

export default class LessonService {

    static async getAllCourses(): Promise<CourseData[]> {
        try {
            const q = query(
                collection(db, "courses"),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const courses: CourseData[] = [];

            querySnapshot.forEach((doc: any) => {
                courses.push({
                    id: doc.id,
                    ...doc.data()
                } as CourseData);
            });

            return courses;
        } catch (error) {
            console.error('Error fetching all courses:', error)
            throw error
        }
    }

    static async getUserCourses(): Promise<CourseData[]> {
        try {
            const userId = AuthService.getAuthenticatedUserId();
            if (!userId) {
                throw new Error('User not authenticated')
            }

            const q = query(
                collection(db, "courses"),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const courses: CourseData[] = [];

            querySnapshot.forEach((doc: any) => {
                courses.push({
                    id: doc.id,
                    ...doc.data()
                } as CourseData);
            });

            return courses;
        } catch (error) {
            console.error('Error fetching user courses:', error)
            throw error
        }
    }

    static async getCourseItsID(id: string): Promise<CourseData | null> {
        try {

            const q = query(
                collection(db, "courses"),
                where("__name__", "==", id)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return {
                ...doc.data()
            } as CourseData;
        } catch (error) {
            console.error('Error fetching course by id:', error)
            throw error
        }
    }

    static async getCourseById(id: string): Promise<CourseData | null> {
        try {
            const userId = AuthService.getAuthenticatedUserId();
            if (!userId) {
                throw new Error('User not authenticated')
            }

            const q = query(
                collection(db, "courses"),
                where("userId", "==", userId),
                where("__name__", "==", id)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return {
                ...doc.data()
            } as CourseData;
        } catch (error) {
            console.error('Error fetching course by id:', error)
            throw error
        }
    }

    static async saveCourse(courseData: CourseData): Promise<string> {
        try {
            const userId = AuthService.getAuthenticatedUserId();
            if (!userId) {
                throw new Error('User not authenticated')
            }
            console.log("Course Data: ", courseData);
            const docRef = await addDoc(collection(db, "courses"), {
                ...courseData,
                userId,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving course:', error)
            throw error
        }
    }
}
