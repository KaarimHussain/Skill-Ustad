export default function MentorBlog() {
    return (
        <>
            <div className="min-h-screen w-full bg-white py-5">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>
                    <div className="relative px-4 sm:px-6 lg:px-8 pt-30 pb-20">
                        <div className="max-w-7xl mx-auto text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                                Blogs
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                                Ready to teach students something new?
                            </p>
                        </div>
                    </div>
                </div>
                {/* Grid Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                    </div>
                </div>
            </div>
        </>
    )
}