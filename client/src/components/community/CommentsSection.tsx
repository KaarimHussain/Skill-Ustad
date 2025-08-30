import { useState, useEffect } from 'react';
import { Send, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import CommunityService, { Comment } from '@/services/community.service';
import NotificationService from '@/components/Notification';

interface CommentsSectionProps {
    postId: string;
    currentUserId: string;
    currentUserName: string;
    currentUserProfilePicture?: string;
    onCommentAdded: () => void;
}

export default function CommentsSection({ 
    postId, 
    currentUserId, 
    currentUserName, 
    currentUserProfilePicture, 
    onCommentAdded 
}: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [showDropdown, setShowDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await CommunityService.getCommentsForPost(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error loading comments:', error);
            NotificationService.error('Error', 'Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const errors = CommunityService.validateCommentContent(newComment);
        if (errors.length > 0) {
            NotificationService.error('Validation Error', errors[0]);
            return;
        }

        setIsSubmitting(true);
        try {
            await CommunityService.createComment(
                postId,
                { content: newComment.trim() },
                currentUserId,
                currentUserName,
                currentUserProfilePicture
            );
            
            setNewComment('');
            await loadComments();
            onCommentAdded();
            NotificationService.success('Success', 'Comment added successfully!');
        } catch (error) {
            console.error('Error creating comment:', error);
            NotificationService.error('Error', 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = async (commentId: string) => {
        const errors = CommunityService.validateCommentContent(editingContent);
        if (errors.length > 0) {
            NotificationService.error('Validation Error', errors[0]);
            return;
        }

        try {
            await CommunityService.updateComment(commentId, editingContent.trim(), currentUserId);
            setEditingCommentId(null);
            setEditingContent('');
            await loadComments();
            NotificationService.success('Success', 'Comment updated successfully!');
        } catch (error) {
            console.error('Error updating comment:', error);
            NotificationService.error('Error', 'Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await CommunityService.deleteComment(commentId, currentUserId);
            await loadComments();
            onCommentAdded();
            NotificationService.success('Success', 'Comment deleted successfully!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            NotificationService.error('Error', 'Failed to delete comment');
        }
    };

    const startEditing = (comment: Comment) => {
        setEditingCommentId(comment.id!);
        setEditingContent(comment.content);
        setShowDropdown(null);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="border-t border-gray-100 bg-gray-50">
            {/* Add Comment Form */}
            <div className="p-4">
                <form onSubmit={handleSubmitComment} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-indigo-200 flex items-center justify-center">
                        {currentUserProfilePicture ? (
                            <img 
                                src={currentUserProfilePicture} 
                                alt={currentUserName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="font-semibold text-xs">
                                {currentUserName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            maxLength={500}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="px-4 pb-4 space-y-3">
                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-indigo-200 flex items-center justify-center">
                                {comment.userProfilePicture ? (
                                    <img 
                                        src={comment.userProfilePicture} 
                                        alt={comment.userName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="font-semibold text-xs">
                                        {comment.userName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="bg-white rounded-lg px-3 py-2 relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm text-gray-900">
                                            {comment.userName}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                            {comment.userId === currentUserId && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowDropdown(
                                                            showDropdown === comment.id ? null : comment.id!
                                                        )}
                                                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                    >
                                                        <MoreHorizontal className="w-3 h-3" />
                                                    </button>
                                                    
                                                    {showDropdown === comment.id && (
                                                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                                                            <button
                                                                onClick={() => startEditing(comment)}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteComment(comment.id!);
                                                                    setShowDropdown(null);
                                                                }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {editingCommentId === comment.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editingContent}
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                                rows={2}
                                                maxLength={500}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={cancelEditing}
                                                    className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleEditComment(comment.id!)}
                                                    className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-5" 
                    onClick={() => setShowDropdown(null)}
                />
            )}
        </div>
    );
}