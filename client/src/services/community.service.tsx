import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    serverTimestamp,
    increment,
    arrayUnion,
    arrayRemove,
    getDoc,
    where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Post {
    id?: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    userId: string;
    userName: string;
    userProfilePicture?: string;
    likesCount: number;
    commentsCount: number;
    likedBy: string[];
    createdAt: any;
    updatedAt: any;
}

export interface Comment {
    id?: string;
    postId: string;
    content: string;
    userId: string;
    userName: string;
    userProfilePicture?: string;
    createdAt: any;
    updatedAt: any;
}

export interface CreatePostData {
    content: string;
    imageUrl?: string;
    videoUrl?: string;
}

export interface CreateCommentData {
    content: string;
}

export default class CommunityService {
    private static readonly POSTS_COLLECTION = 'posts';
    private static readonly COMMENTS_COLLECTION = 'comments';

    // Posts CRUD operations
    static async createPost(postData: CreatePostData, userId: string, userName: string, userProfilePicture?: string): Promise<string> {
        try {
            const post: Omit<Post, 'id'> = {
                ...postData,
                userId,
                userName,
                userProfilePicture,
                likesCount: 0,
                commentsCount: 0,
                likedBy: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, this.POSTS_COLLECTION), post);
            return docRef.id;
        } catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Failed to create post');
        }
    }

    static async getAllPosts(): Promise<Post[]> {
        try {
            const q = query(
                collection(db, this.POSTS_COLLECTION),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Post));
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Failed to fetch posts');
        }
    }

    static async getPostById(postId: string): Promise<Post | null> {
        try {
            const docRef = doc(db, this.POSTS_COLLECTION, postId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                } as Post;
            }
            return null;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw new Error('Failed to fetch post');
        }
    }

    static async updatePost(postId: string, updateData: Partial<CreatePostData>, userId: string): Promise<void> {
        try {
            const postRef = doc(db, this.POSTS_COLLECTION, postId);
            const postSnap = await getDoc(postRef);
            
            if (!postSnap.exists()) {
                throw new Error('Post not found');
            }

            const postData = postSnap.data() as Post;
            if (postData.userId !== userId) {
                throw new Error('Unauthorized to update this post');
            }

            await updateDoc(postRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating post:', error);
            throw new Error('Failed to update post');
        }
    }

    static async deletePost(postId: string, userId: string): Promise<void> {
        try {
            const postRef = doc(db, this.POSTS_COLLECTION, postId);
            const postSnap = await getDoc(postRef);
            
            if (!postSnap.exists()) {
                throw new Error('Post not found');
            }

            const postData = postSnap.data() as Post;
            if (postData.userId !== userId) {
                throw new Error('Unauthorized to delete this post');
            }

            // Delete all comments for this post
            await this.deleteAllCommentsForPost(postId);
            
            // Delete the post
            await deleteDoc(postRef);
        } catch (error) {
            console.error('Error deleting post:', error);
            throw new Error('Failed to delete post');
        }
    }

    // Like/Unlike functionality
    static async toggleLike(postId: string, userId: string): Promise<void> {
        try {
            const postRef = doc(db, this.POSTS_COLLECTION, postId);
            const postSnap = await getDoc(postRef);
            
            if (!postSnap.exists()) {
                throw new Error('Post not found');
            }

            const postData = postSnap.data() as Post;
            const isLiked = postData.likedBy?.includes(userId) || false;

            if (isLiked) {
                // Unlike
                await updateDoc(postRef, {
                    likesCount: increment(-1),
                    likedBy: arrayRemove(userId)
                });
            } else {
                // Like
                await updateDoc(postRef, {
                    likesCount: increment(1),
                    likedBy: arrayUnion(userId)
                });
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            throw new Error('Failed to toggle like');
        }
    }

    // Comments CRUD operations
    static async createComment(postId: string, commentData: CreateCommentData, userId: string, userName: string, userProfilePicture?: string): Promise<string> {
        try {
            const comment: Omit<Comment, 'id'> = {
                postId,
                ...commentData,
                userId,
                userName,
                userProfilePicture,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, this.COMMENTS_COLLECTION), comment);
            
            // Update post comments count
            const postRef = doc(db, this.POSTS_COLLECTION, postId);
            await updateDoc(postRef, {
                commentsCount: increment(1)
            });

            return docRef.id;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw new Error('Failed to create comment');
        }
    }

    static async getCommentsForPost(postId: string): Promise<Comment[]> {
        try {
            const q = query(
                collection(db, this.COMMENTS_COLLECTION),
                where('postId', '==', postId),
                orderBy('createdAt', 'asc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Comment));
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw new Error('Failed to fetch comments');
        }
    }

    static async updateComment(commentId: string, content: string, userId: string): Promise<void> {
        try {
            const commentRef = doc(db, this.COMMENTS_COLLECTION, commentId);
            const commentSnap = await getDoc(commentRef);
            
            if (!commentSnap.exists()) {
                throw new Error('Comment not found');
            }

            const commentData = commentSnap.data() as Comment;
            if (commentData.userId !== userId) {
                throw new Error('Unauthorized to update this comment');
            }

            await updateDoc(commentRef, {
                content,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating comment:', error);
            throw new Error('Failed to update comment');
        }
    }

    static async deleteComment(commentId: string, userId: string): Promise<void> {
        try {
            const commentRef = doc(db, this.COMMENTS_COLLECTION, commentId);
            const commentSnap = await getDoc(commentRef);
            
            if (!commentSnap.exists()) {
                throw new Error('Comment not found');
            }

            const commentData = commentSnap.data() as Comment;
            if (commentData.userId !== userId) {
                throw new Error('Unauthorized to delete this comment');
            }

            // Update post comments count
            const postRef = doc(db, this.POSTS_COLLECTION, commentData.postId);
            await updateDoc(postRef, {
                commentsCount: increment(-1)
            });

            await deleteDoc(commentRef);
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw new Error('Failed to delete comment');
        }
    }

    private static async deleteAllCommentsForPost(postId: string): Promise<void> {
        try {
            const q = query(
                collection(db, this.COMMENTS_COLLECTION),
                where('postId', '==', postId)
            );
            const querySnapshot = await getDocs(q);
            
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error deleting comments for post:', error);
            throw new Error('Failed to delete comments');
        }
    }

    // Validation helpers
    static validatePostContent(content: string): string[] {
        const errors: string[] = [];
        
        if (!content.trim()) {
            errors.push('Content is required');
        }
        
        if (content.length > 1000) {
            errors.push('Content cannot exceed 1000 characters');
        }
        
        return errors;
    }

    static validateCommentContent(content: string): string[] {
        const errors: string[] = [];
        
        if (!content.trim()) {
            errors.push('Comment is required');
        }
        
        if (content.length > 500) {
            errors.push('Comment cannot exceed 500 characters');
        }
        
        return errors;
    }
}