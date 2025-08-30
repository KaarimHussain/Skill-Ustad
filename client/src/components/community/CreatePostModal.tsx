import { useState } from 'react';
import { X, ImageIcon, Paperclip } from 'lucide-react';
import CommunityService, { CreatePostData } from '@/services/community.service';
import NotificationService from '@/components/Notification';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
    userId: string;
    userName: string;
    userProfilePicture?: string;
}

export default function CreatePostModal({ 
    isOpen, 
    onClose, 
    onPostCreated, 
    userId, 
    userName, 
    userProfilePicture 
}: CreatePostModalProps) {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const errors = CommunityService.validatePostContent(content);
        if (errors.length > 0) {
            NotificationService.error('Validation Error', errors[0]);
            return;
        }

        setIsLoading(true);
        try {
            const postData: CreatePostData = {
                content: content.trim(),
                imageUrl: imageUrl.trim() || undefined,
                videoUrl: videoUrl.trim() || undefined
            };

            await CommunityService.createPost(postData, userId, userName, userProfilePicture);
            
            NotificationService.success('Success', 'Post created successfully!');
            setContent('');
            setImageUrl('');
            setVideoUrl('');
            onClose();
            onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
            NotificationService.error('Error', 'Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Create Post</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-indigo-200 flex items-center justify-center">
                            {userProfilePicture ? (
                                <img 
                                    src={userProfilePicture} 
                                    alt={userName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="font-semibold text-sm">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{userName}</p>
                        </div>
                    </div>

                    <div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={4}
                            maxLength={1000}
                            required
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {content.length}/1000
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <ImageIcon className="w-4 h-4" />
                                Image URL (optional)
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Paperclip className="w-4 h-4" />
                                Video URL (optional)
                            </label>
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://example.com/video.mp4"
                                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !content.trim()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}