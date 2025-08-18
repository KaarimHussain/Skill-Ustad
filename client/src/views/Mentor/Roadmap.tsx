import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Eye, EyeClosed, GitBranch, MapPin, Pen, Plus, RefreshCcw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoadmapService from "@/services/roadmap.service";
import type { DisplayRoadmapData } from "@/types/roadmap";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import GetRoadmapDifficulty from "@/components/GetRoadmapDifficulty";
import GetRoadmapIcon from "@/components/GetRoadmapColor";
import FormatDate from "@/components/FormatDate";
import getRoadmapColorScheme from "@/components/GetRoadmapColorScheme";
import GetDifficultyColor from "@/components/GetDifficultyColor";

export default function MentorRoadmap() {

    const [roadmapData, setRoadmapData] = useState<DisplayRoadmapData[]>([]);
    const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)


    const fetchRoadmapData = async () => {
        setIsLoadingRoadmaps(true);
        try {
            const data = await RoadmapService.getCurrentUserRoadmapData();
            console.log("Service Data:", data);

            setRoadmapData(data as DisplayRoadmapData[]);

        } catch (error) {
            console.error("Error fetching roadmap data:", error);
        } finally {
            setIsLoadingRoadmaps(false)
            console.log("Setted Roadmap DATA:", roadmapData);
        }
    };

    const deleteRoadmap = async (id: string) => {
        setIsDeleting(true)
        try {
            await RoadmapService.deleteRoadmap(id);
            fetchRoadmapData();
        } catch (error: any) {
            console.log("Error Deleting Roadmap:", error);

        } finally {
            setIsDeleting(false)
        }
    }
    useEffect(() => {
        fetchRoadmapData();
    }, []);
    return (
        <>
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/40 via-indigo-900/10 to-indigo-500/10"></div>
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900/40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>
                    <div className="relative px-4 sm:px-6 lg:px-8 pb-20 pt-35 h-full flex items-center">
                        <div className="max-w-7xl mx-auto text-center">
                            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                                Roadmaps
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                                View, Create, Edit or Delete your roadmaps
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Roadmaps</h2>
                            <p className="text-gray-600 mt-1">View, Edit or Delete your Roadmaps</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to={"/mentor/create-roadmap"}>
                                <Button className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer">
                                    Create an Roadmap <Plus />
                                </Button>
                            </Link>
                            <Button onClick={() => fetchRoadmapData()} variant="outline" className="bg-white hover:bg-white/70 text-black cursor-pointer">
                                <RefreshCcw />
                            </Button>
                        </div>
                    </div>
                    <div>
                        {isLoadingRoadmaps ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-10 bg-gray-200 rounded"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : roadmapData.length === 0 ? (
                            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300">
                                <CardContent className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmaps yet</h3>
                                    <p className="text-gray-600 mb-6">Create your first learning roadmap to get started on your journey!</p>
                                    <Link to="/mentor/create-roadmap">
                                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Roadmap
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <Carousel className="w-full">
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {roadmapData.map((roadmap, index) => {
                                        const difficulty = GetRoadmapDifficulty(roadmap)
                                        const RoadmapIcon = GetRoadmapIcon(roadmap.title)
                                        const colorScheme = getRoadmapColorScheme(index)
                                        return (
                                            <CarouselItem key={roadmap.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                                <Card
                                                    className={`select-none bg-white/90 backdrop-blur-sm border border-white/60 ${colorScheme.borderColor} transition-all duration-300 group hover:transform hover:-translate-y-3 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 h-full`}
                                                >
                                                    {/* Background Gradient */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.color} opacity-60`}></div>

                                                    <CardContent className="p-6 relative z-10 h-full flex flex-col">
                                                        {/* Header */}
                                                        <div className="flex items-start gap-4 mb-4">
                                                            <div className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                                <RoadmapIcon className={`w-6 h-6 ${colorScheme.iconColor}`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors truncate">
                                                                    {roadmap.title}
                                                                </h3>
                                                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>Created {FormatDate(roadmap.createdAt)}</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <div className={`w-min border text-xs px-3 rounded-full ${GetDifficultyColor(difficulty)}`}>{difficulty}</div>
                                                                    <div className="w-min border text-xs px-3 rounded-full flex items-center gap-2 bg-zinc-400/20 border-zinc-500">
                                                                        {roadmap.visibility == "public" ? (
                                                                            <>
                                                                                <Eye className="text-xs" fontSize={10} size={10} />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <EyeClosed className="text-xs" fontSize={10} size={10} />
                                                                            </>
                                                                        )}
                                                                        {roadmap.visibility.charAt(0).toUpperCase() + roadmap.visibility.slice(1)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Stats */}
                                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                                            <div className="bg-white/50 rounded-lg p-2 text-center">
                                                                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                                                                    <GitBranch className="w-3 h-3" />
                                                                    Nodes
                                                                </div>
                                                                <div className="font-semibold text-gray-900">{roadmap.nodes?.length || 0}</div>
                                                            </div>
                                                            <div className="bg-white/50 rounded-lg p-2 text-center">
                                                                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    Edges
                                                                </div>
                                                                <div className="font-semibold text-gray-900">{roadmap.edges?.length || 0}</div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2 mt-auto">
                                                            <Link className="flex-1" to={`/user/roadmap/${roadmap.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full cursor-pointer bg-white/80 hover:bg-white"
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                className="flex-1"
                                                                to="/mentor/create-roadmap"
                                                                state={{
                                                                    roadmapData: {
                                                                        id: roadmap.id,
                                                                        title: roadmap.title,
                                                                        nodes: roadmap.nodes,
                                                                        edges: roadmap.edges,
                                                                        difficulty: roadmap.difficulty,
                                                                        userId: roadmap.userId,
                                                                        visibility: roadmap.visibility
                                                                    }
                                                                }}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full cursor-pointer bg-white/80 hover:bg-white"
                                                                >
                                                                    <Pen className="w-4 h-4 mr-2" />
                                                                    Edit
                                                                </Button>
                                                            </Link>
                                                            {/* Delete Button */}
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="text-white hover:text-white bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer"
                                                                    >
                                                                        <Trash className="w-4 h-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>

                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently delete your roadmap
                                                                            and remove all associated data from our servers.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>

                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => { deleteRoadmap(roadmap.id) }}
                                                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                                        >
                                                                            {isDeleting ? "Deleting..." : "Delete"}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        )
                                    })}
                                </CarouselContent>
                                <CarouselPrevious className="hidden md:flex" />
                                <CarouselNext className="hidden md:flex" />
                            </Carousel>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}