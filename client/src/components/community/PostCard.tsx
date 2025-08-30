import { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Edit, Trash2, Play } from 'lucide-react';
import { Post } from '@/services/community.service';
import CommunityService from '@/services/community.service';
import NotificationService from '@/components/Notification';
import EditPostModal from './EditPostModal';
import CommentsSection from './CommentsSection';

interface PostCardProps {
    post: Post;
    currentUserId: string;
    currentUserName: string;
    currentUserProfilePicture?: string;
    onPostUpdated: () => void;
    onPostDeleted: () => void;
}

export default function PostCard({ 
    post, 
    currentUserId, 
    currentUserName, 
    currentUserProfilePicture, 
    onPostUpdated, 
    onPostDeleted 
}: PostCardProps) {
    const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUserId) || false);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isOwner = post.userId === currentUserId;

    const handleLike = async () => {
        try {
            await CommunityService.toggleLike(post.id!, currentUserId);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('Error toggling like:', error);
            NotificationService.error('Error', 'Failed to update like');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        setIsLoading(true);
        try {
            await CommunityService.deletePost(post.id!, currentUserId);
            NotificationService.success('Success', 'Post deleted successfully');
            onPostDeleted();
        } catch (error) {
            console.error('Error deleting post:', error);
            NotificationService.error('Error', 'Failed to delete post');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Post by ${post.userName}`,
                    text: post.content,
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                NotificationService.success('Success', 'Link copied to clipboard');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
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
        <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex-shrink-0 bg-indigo-200 flex items-center justify-center">
                                {post.userProfilePicture ? (
                                    <img 
                                        src={post.userProfilePicture} 
                                        alt={post.userName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="font-semibold text-sm">
                                        {post.userName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                                <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                            </div>
                        </div>
                        
                        {isOwner && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                        <button
                                            onClick={() => {
                                                setShowEditModal(true);
                                                setShowDropdown(false);
                                            }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete();
                                                setShowDropdown(false);
                                            }}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-3">
                    <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Media */}
                {post.imageUrl && (
                    <div className="relative">
                        <img 
                            src={post.imageUrl} 
                            alt="Post content" 
                            className="w-full h-80 object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {post.videoUrl && (
                    <div className="relative">
                        <video 
                            src={post.videoUrl} 
                            className="w-full h-80 object-cover"
                            controls
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="p-5">
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition-colors ${
                                isLiked 
                                    ? 'text-red-500' 
                                    : 'text-gray-600 hover:text-red-500'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-medium">{likesCount} Like{likesCount !== 1 ? 's' : ''}</span>
                        </button>
                        
                        <button 
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.commentsCount} Comment{post.commentsCount !== 1 ? 's' : ''}</span>
                        </button>
                        
                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <Share className="w-5 h-5" />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <CommentsSection
                        postId={post.id!}
                        currentUserId={currentUserId}
                        currentUserName={currentUserName}
                        currentUserProfilePicture={currentUserProfilePicture}
                        onCommentAdded={onPostUpdated}
                    />
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditPostModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onPostUpdated={onPostUpdated}
                    post={post}
                    userId={currentUserId}
                />
            )}

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-5" 
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </>
    );
}