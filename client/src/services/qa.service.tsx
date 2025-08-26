import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, serverTimestamp, addDoc, doc, getDoc, orderBy, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import AuthService from './auth.service';

// Interfaces for the Q&A data structures
export interface Author {
    name: string
    avatar: string
    reputation: number
    badges: string[]
    joinedDate?: string
    userId: string
}

export interface Question {
    id: string
    title: string
    content: string
    author: Author
    tags: string[]
    votes: number
    views: number
    createdAt: string
    isAnswered: boolean
    acceptedAnswerId?: string
}

export interface Answer {
    id: string
    questionId: string
    content: string
    author: Author
    votes: number
    createdAt: string
    isAccepted: boolean
}

// Extended interface for question list view
export interface QuestionWithAnswerCount extends Question {
    answerCount: number
}

// Combined interface for question details with answers
export interface QuestionDetails {
    question: Question
    answers: Answer[]
}

export default class QAService {
    // Fetch questions from Firebase (optimized for list view)
    static async fetchQuestions(): Promise<Question[]> {
        try {
            const questionsCollection = collection(db, 'questions')
            // Order by creation time (newest first) - you might want to add orderBy
            const q = query(questionsCollection, orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)

            return snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    ...data as Question,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate ?
                        this.formatDate(new Date(data.createdAt.toDate())) :
                        data.createdAt
                }
            })
        } catch (error) {
            console.error('Error fetching questions:', error)
            throw new Error('Failed to fetch questions')
        }
    }

    static async fetchQuestionsByUserId(userId: string): Promise<Question[]> {
        try {
            const questionsCollection = collection(db, 'questions')
            const q = query(
                questionsCollection,
                where('author.userId', '==', userId),
                orderBy('createdAt', 'desc')
            )
            const snapshot = await getDocs(q)

            return snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    ...data as Question,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate ?
                        this.formatDate(new Date(data.createdAt.toDate())) :
                        data.createdAt
                }
            })
        } catch (error) {
            console.error('Error fetching questions by user ID:', error)
            throw new Error('Failed to fetch questions by user ID')
        }
    }

    // Fetch questions with answer counts (more efficient for list view)
    static async fetchQuestionsWithAnswerCounts(): Promise<QuestionWithAnswerCount[]> {
        try {
            const questions = await this.fetchQuestions()

            // Fetch all answers in one query for efficiency
            const answersCollection = collection(db, 'answers')
            const answersSnapshot = await getDocs(answersCollection)

            // Count answers per question
            const answerCounts: { [questionId: string]: number } = {}
            answersSnapshot.docs.forEach(doc => {
                const answerData = doc.data()
                const questionId = answerData.questionId
                answerCounts[questionId] = (answerCounts[questionId] || 0) + 1
            })

            // Combine questions with answer counts
            return questions.map(question => ({
                ...question,
                answerCount: answerCounts[question.id] || 0
            }))
        } catch (error) {
            console.error('Error fetching questions with answer counts:', error)
            throw new Error('Failed to fetch questions')
        }
    }

    // Fetch a single question by ID
    static async fetchQuestionById(questionId: string): Promise<Question | null> {
        try {
            const questionDoc = doc(db, 'questions', questionId)
            const snapshot = await getDoc(questionDoc)

            if (!snapshot.exists()) {
                return null
            }

            const data = snapshot.data()
            return {
                ...data as Question,
                id: snapshot.id,
                createdAt: data.createdAt?.toDate ?
                    this.formatDate(new Date(data.createdAt.toDate())) :
                    data.createdAt
            }
        } catch (error) {
            console.error('Error fetching question:', error)
            throw new Error('Failed to fetch question')
        }
    }

    // Fetch answers for a specific question from Firebase
    static async fetchAnswers(questionId: string): Promise<Answer[]> {
        try {
            const answersCollection = collection(db, 'answers')
            const q = query(
                answersCollection,
                where('questionId', '==', questionId),
                orderBy('createdAt', 'desc')
            )
            const snapshot = await getDocs(q)

            return snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    ...data as Answer,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate ?
                        this.formatDate(new Date(data.createdAt.toDate())) :
                        data.createdAt
                }
            })
        } catch (error) {
            console.error('Error fetching answers:', error)
            throw new Error('Failed to fetch answers')
        }
    }

    // Fetch question with all its answers (main method you need)
    static async fetchQuestionWithAnswers(questionId: string): Promise<QuestionDetails | null> {
        try {
            // Fetch the question
            const question = await this.fetchQuestionById(questionId)

            if (!question) {
                return null
            }

            // Fetch the answers for this question
            const answers = await this.fetchAnswers(question.id)

            return {
                question,
                answers
            }
        } catch (error) {
            console.error('Error fetching question with answers:', error)
            throw new Error('Failed to fetch question details')
        }
    }

    // Add a new question
    static async addQuestion(question: Omit<Question, 'id' | 'createdAt'>): Promise<void> {
        const questionsCollection = collection(db, 'questions')

        try {
            await addDoc(questionsCollection, {
                ...question,
                createdAt: serverTimestamp(),
                views: 0, // Initialize views
                votes: 0, // Initialize votes
                isAnswered: false // Initialize as not answered
            })
        } catch (error) {
            console.error('Error adding question:', error)
            throw new Error('Failed to add question')
        }
    }

    // Add a new answer
    static async addAnswer(answer: Omit<Answer, 'id' | 'createdAt'>): Promise<void> {
        const answersCollection = collection(db, 'answers')

        try {
            await addDoc(answersCollection, {
                ...answer,
                createdAt: serverTimestamp(),
                votes: 0 // Initialize votes
            })
        } catch (error) {
            console.error('Error adding answer:', error)
            throw new Error('Failed to add answer')
        }
    }

    // Update question view count
    static async incrementQuestionViews(questionId: string): Promise<void> {
        try {
            const userId = AuthService.getAuthenticatedUserId();

            // Check if user has already viewed this question
            const viewsCollection = collection(db, 'questionViews')
            const q = query(
                viewsCollection,
                where('userId', '==', userId),
                where('questionId', '==', questionId)
            )
            const snapshot = await getDocs(q)

            // Only increment if user hasn't viewed this question before
            if (snapshot.empty) {
                // Add view record for this user
                await addDoc(viewsCollection, {
                    userId,
                    questionId,
                    viewedAt: serverTimestamp()
                })

                // Increment the question's view count
                const questionRef = doc(db, "questions", questionId)
                await updateDoc(questionRef, {
                    views: increment(1),
                })
            }
        } catch (error) {
            console.error("Error incrementing views:", error)
            throw new Error("Failed to increment question views")
        }
    }

    // Helper method to format dates consistently
    private static formatDate(date: Date): string {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const diffWeeks = Math.floor(diffDays / 7)

        if (diffMins < 1) return 'just now'
        if (diffMins < 60) return `${diffMins} minutes ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffWeeks < 4) return `${diffWeeks} weeks ago`

        return date.toLocaleDateString()
    }

    // Search questions by title, content, or tags
    static async searchQuestions(searchTerm: string): Promise<Question[]> {
        try {
            // Note: Firestore doesn't support full-text search natively
            // You might want to implement this with Algolia or similar service
            // For now, we'll fetch all questions and filter client-side
            const allQuestions = await this.fetchQuestions()

            const searchLower = searchTerm.toLowerCase()
            return allQuestions.filter(question =>
                question.title.toLowerCase().includes(searchLower) ||
                question.content.toLowerCase().includes(searchLower) ||
                question.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                question.author.name.toLowerCase().includes(searchLower)
            )
        } catch (error) {
            console.error('Error searching questions:', error)
            throw new Error('Failed to search questions')
        }
    }

    static async bookmarkQuestion(questionId: string, questionTitle: string): Promise<void> {
        const bookmarksCollection = collection(db, 'bookmarks')
        const userId = await AuthService.getAuthenticatedUserId();
        await addDoc(bookmarksCollection, {
            userId,
            questionId,
            questionTitle,
            createdAt: serverTimestamp()
        })
    }

    static async removeBookmarkQuestion(questionId: string) {
        const bookmarksCollection = collection(db, 'bookmarks')
        const userId = await AuthService.getAuthenticatedUserId();
        const q = query(
            bookmarksCollection,
            where('userId', '==', userId),
            where('questionId', '==', questionId)
        )
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
            const docRef = doc(db, 'bookmarks', snapshot.docs[0].id)
            await deleteDoc(docRef)
        }
    }

    static async isAlreadyBookmarked(questionId: string) {
        const bookmarksCollection = collection(db, 'bookmarks')
        const userId = await AuthService.getAuthenticatedUserId();
        const q = query(
            bookmarksCollection,
            where('userId', '==', userId),
            where('questionId', '==', questionId)
        )
        const snapshot = await getDocs(q)
        return !snapshot.empty
    }

    // Fetch questions asked by a specific user
    static async fetchUserQuestions(userId: string): Promise<(Question & { answerCount: number })[]> {
        try {
            console.log('🔍 Fetching questions for userId:', userId)

            const questionsCollection = collection(db, 'questions')

            // Get current user info for fallback matching
            const currentUser = AuthService.getUser()
            const currentUserEmail = AuthService.getUserEmail()

            console.log('� TCurrent user info:', {
                name: currentUser?.name,
                email: currentUserEmail
            })

            // Get all questions and filter them
            const allQuestionsQuery = query(questionsCollection, orderBy('createdAt', 'desc'))
            const allSnapshot = await getDocs(allQuestionsQuery)

            console.log('📊 Total questions in database:', allSnapshot.docs.length)

            // Filter questions by userId OR by user name/email (for backward compatibility)
            const userQuestions = allSnapshot.docs.filter(doc => {
                const data = doc.data()
                const authorUserId = data.author?.userId
                const authorName = data.author?.name
                const authorEmail = data.author?.email

                // Check multiple conditions for matching
                const matchByUserId = authorUserId === userId
                const matchByName = currentUser?.name && authorName === currentUser.name
                const matchByEmail = currentUserEmail && (authorEmail === currentUserEmail || authorName === currentUserEmail)

                const isMatch = matchByUserId || matchByName || matchByEmail

                console.log('🔍 Comparing question:', {
                    questionId: doc.id,
                    authorUserId,
                    authorName,
                    authorEmail,
                    targetUserId: userId,
                    currentUserName: currentUser?.name,
                    currentUserEmail,
                    matchByUserId,
                    matchByName,
                    matchByEmail,
                    finalMatch: isMatch
                })

                return isMatch
            })

            console.log('✅ Found user questions:', userQuestions.length)

            // Get answer counts for each question
            const questions = userQuestions.map(doc => {
                const data = doc.data()
                return {
                    ...data as Question,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate ?
                        this.formatDate(new Date(data.createdAt.toDate())) :
                        data.createdAt
                }
            })

            // Fetch answer counts for all questions
            const answersCollection = collection(db, 'answers')
            const answersSnapshot = await getDocs(answersCollection)

            const answerCounts: { [questionId: string]: number } = {}
            answersSnapshot.docs.forEach(doc => {
                const answerData = doc.data()
                const questionId = answerData.questionId
                answerCounts[questionId] = (answerCounts[questionId] || 0) + 1
            })

            // Add answer counts to questions
            const result = questions.map(question => ({
                ...question,
                answerCount: answerCounts[question.id] || 0
            })) as any[]

            console.log('🎯 Final result:', result.length, 'questions with answer counts')
            return result

        } catch (error) {
            console.error('❌ Error fetching user questions:', error)
            throw new Error('Failed to fetch user questions')
        }
    }

    // Fetch answers given by a specific user
    static async fetchUserAnswers(userId: string): Promise<any[]> {
        try {
            const answersCollection = collection(db, 'answers')
            const q = query(
                answersCollection,
                where('author.userId', '==', userId),
                orderBy('createdAt', 'desc')
            )
            const snapshot = await getDocs(q)

            const answers = snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    ...data as Answer,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate ?
                        this.formatDate(new Date(data.createdAt.toDate())) :
                        data.createdAt
                }
            })

            // Fetch question titles for each answer
            const questionsCollection = collection(db, 'questions')
            const answersWithQuestionTitles = await Promise.all(
                answers.map(async (answer) => {
                    try {
                        const questionDoc = doc(questionsCollection, answer.questionId)
                        const questionSnapshot = await getDoc(questionDoc)

                        if (questionSnapshot.exists()) {
                            const questionData = questionSnapshot.data()
                            return {
                                ...answer,
                                questionTitle: questionData.title || 'Unknown Question'
                            }
                        }

                        return {
                            ...answer,
                            questionTitle: 'Question not found'
                        }
                    } catch (error) {
                        console.error('Error fetching question title for answer:', answer.id, error)
                        return {
                            ...answer,
                            questionTitle: 'Error loading question'
                        }
                    }
                })
            )

            return answersWithQuestionTitles

        } catch (error) {
            console.error('Error fetching user answers:', error)
            throw new Error('Failed to fetch user answers')
        }
    }

    // Mark an answer as correct (accepted)
    static async markAnswerAsCorrect(questionId: string, answerId: string): Promise<void> {
        try {
            // First, verify that the current user is the author of the question
            const userId = AuthService.getAuthenticatedUserId()
            if (!userId) {
                throw new Error('User not authenticated')
            }

            const questionDoc = doc(db, 'questions', questionId)
            const questionSnapshot = await getDoc(questionDoc)

            if (!questionSnapshot.exists()) {
                throw new Error('Question not found')
            }

            const questionData = questionSnapshot.data()
            if (questionData.author.userId !== userId) {
                throw new Error('Only the question author can mark answers as correct')
            }

            // Update the answer to mark it as accepted
            const answerDoc = doc(db, 'answers', answerId)
            await updateDoc(answerDoc, {
                isAccepted: true
            })

            // Update the question to mark it as answered and set the accepted answer ID
            await updateDoc(questionDoc, {
                isAnswered: true,
                acceptedAnswerId: answerId
            })

            // Optionally, unmark any other answers for this question as accepted
            // (in case you want only one accepted answer per question)
            const answersCollection = collection(db, 'answers')
            const otherAnswersQuery = query(
                answersCollection,
                where('questionId', '==', questionId)
            )
            const otherAnswersSnapshot = await getDocs(otherAnswersQuery)

            const updatePromises = otherAnswersSnapshot.docs
                .filter(doc => doc.id !== answerId)
                .map(doc => updateDoc(doc.ref, { isAccepted: false }))

            await Promise.all(updatePromises)

        } catch (error) {
            console.error('Error marking answer as correct:', error)
            throw new Error('Failed to mark answer as correct')
        }
    }
}