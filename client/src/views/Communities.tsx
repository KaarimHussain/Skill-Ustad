import CommunityNavbar from "@/components/CommunityNavbar";
import NotificationService from "@/components/Notification";
import { useAuth } from "@/context/AuthContext";
import AuthService from "@/services/auth.service";
import CommunityService, { type Post } from "@/services/community.service";
import CreatePostModal from "@/components/community/CreatePostModal";
import PostCard from "@/components/community/PostCard";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Community() {
    // On Mount State
    const navigate = useNavigate();
    const [username, setUsername] = useState("User");
    const [userId, setUserId] = useState("");
    const [userProfilePicture, setUserProfilePicture] = useState<string | undefined>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { isAuthenticated } = useAuth();

    const setUserData = () => {
        if (!isAuthenticated) {
            NotificationService.info("Login Required", "You need to login first in order to view this page!");
            navigate("/login")
            return;
        }
        const data = AuthService.getAuthenticatedUserData();
        console.log(data);

        setUsername(data.name);
        setUserId(data.UserId);
        setUserProfilePicture(data.ProfilePicture);
    }

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const fetchedPosts = await CommunityService.getAllPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
            NotificationService.error('Error', 'Failed to load posts');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostCreated = () => {
        loadPosts();
    };

    const handlePostUpdated = () => {
        loadPosts();
    };

    const handlePostDeleted = () => {
        loadPosts();
    };

    useEffect(() => {
        setUserData();
    }, []);

    useEffect(() => {
        if (userId) {
            loadPosts();
        }
    }, [userId]);

    return (
        <>
            <div className="min-h-screen w-full bg-gray-50 relative">
                {/* Navbar */}
                <CommunityNavbar />

                {/* Main Section */}
                <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Welcome & Post Creation Section */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                            {/* Welcome Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">👋</span>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                            Welcome Back, {username}
                                        </h2>
                                        <p className="text-sm text-gray-500">Share what's on your mind with the community</p>
                                    </div>
                                </div>
                                <button
                                    onClick={loadPosts}
                                    disabled={isLoading}
                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50"
                                    title="Refresh posts"
                                >
                                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {/* Post Creation Trigger */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 bg-indigo-200 flex items-center justify-center">
                                        {userProfilePicture ? (
                                            <img
                                                src={userProfilePicture}
                                                alt={username}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-semibold text-sm">
                                                {username.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-left text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        What's on your mind?
                                    </button>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                                        title="Create new post"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Posts Feed */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                                    <p className="text-gray-500">Loading posts...</p>
                                </div>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Create First Post
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        currentUserId={userId}
                                        currentUserName={username}
                                        currentUserProfilePicture={userProfilePicture}
                                        onPostUpdated={handlePostUpdated}
                                        onPostDeleted={handlePostDeleted}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Create Post Modal */}
                <CreatePostModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={handlePostCreated}
                    userId={userId}
                    userName={username}
                    userProfilePicture={userProfilePicture}
                />
            </div>
        </>
    )
}