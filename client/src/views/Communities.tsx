import CommunityNavbar from "@/components/CommunityNavbar";
import AuthService from "@/services/auth.service";
import { Heart, ImageIcon, MessageCircle, MoreHorizontal, Paperclip, Play, Share, Smile } from "lucide-react";
import { useEffect, useState } from "react";

export default function Community() {
    // On Mount State
    const [username, setUsername] = useState("User");
    const setUserData = () => {
        const data = AuthService.getAuthenticatedUserData();
        setUsername(data.name);
    }
    useEffect(() => {
        setUserData();
    }, [])

    return (
        <>
            <div className="min-h-screen w-full bg-white relative">
                {/* Navbar */}
                <CommunityNavbar />
                {/* Main Section */}
                <main className="pt-42 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Welcome & Post Creation Section */}
                        <div className="bg-white rounded-xl p-4 sm:p-4 border border-gray-200">
                            {/* Welcome Header */}
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">👋</span>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Welcome Back, {username}</h2>
                                </div>
                            </div>
                            {/* Post Creation */}
                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 bg-indigo-200 flex items-center justify-center">
                                        <p className="font-semibold">
                                            {username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="bg-gray-50 rounded-full px-3 sm:px-4 py-2 sm:py-3 mb-4 cursor-pointer hover:bg-gray-100 transition-colors">
                                            <p className="text-sm sm:text-base text-gray-500">What's on your mind?</p>
                                        </div>

                                        {/* Action Buttons - Responsive Layout */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4">
                                                <button className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-indigo-600 transition-colors p-2 sm:p-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent">
                                                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm font-medium">Photo</span>
                                                </button>
                                                <button className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-indigo-600 transition-colors p-2 sm:p-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent">
                                                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm font-medium">Attach</span>
                                                </button>
                                                <button className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-indigo-600 transition-colors p-2 sm:p-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent">
                                                    <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm font-medium">Feeling</span>
                                                </button>
                                            </div>
                                            {/* Post Buttons */}
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                    Draft
                                                </button>
                                                <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sample Post */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/woman-profile.png" alt="Kina Rally" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Kina Rally</h3>
                                            <p className="text-sm text-gray-500">03 June at 08:02 AM</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <img src="/person-working-by-ocean-view.png" alt="Working by the ocean" className="w-full h-80 object-cover" />
                                <div className="absolute inset-0 bg-black/20"></div>
                                <button className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                        <Play className="w-6 h-6 text-gray-900 ml-1" />
                                    </div>
                                </button>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black/50 rounded-lg px-3 py-2 text-white text-sm">00:49</div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg">👍</span>
                                    <p className="text-gray-900">
                                        Hello from Bali! I'm a traveling content creator and I'm very excited to join the community!
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <button className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                        <span className="text-sm font-medium">Like</span>
                                    </button>
                                    <button className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">Comment</span>
                                    </button>
                                    <button className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                        <Share className="w-5 h-5" />
                                        <span className="text-sm font-medium">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}