"use client"

import { useState, useRef, useEffect } from "react"
import Peer from "peerjs"
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Copy, User, AlertCircle } from "lucide-react"

export default function LiveSessions() {
    const [peerId, setPeerId] = useState<string>("")
    const [remotePeerId, setRemotePeerId] = useState<string>("")
    const [peer, setPeer] = useState<Peer | null>(null)
    const [isVideoEnabled, setIsVideoEnabled] = useState(true)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true)
    const [isConnected, setIsConnected] = useState(false)
    const [callStatus, setCallStatus] = useState<string>("")

    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const currentCallRef = useRef<any>(null)

    // Initialize peer connection
    useEffect(() => {
        const newPeer = new Peer()

        newPeer.on("open", (id) => {
            setPeerId(id)
            setCallStatus("Ready to connect")
        })

        newPeer.on("call", (call) => {
            setCallStatus("Incoming call...")

            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    localStreamRef.current = stream
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream
                    }

                    call.answer(stream)

                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream
                        }
                        setIsConnected(true)
                        setCallStatus("Connected")
                    })

                    currentCallRef.current = call
                })
                .catch((err) => {
                    console.error("Failed to get media:", err)
                    setCallStatus("Media access denied")
                })
        })

        setPeer(newPeer)

        return () => {
            newPeer.destroy()
        }
    }, [])

    // Start local video on mount
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStreamRef.current = stream
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream
                }
            })
            .catch((err) => {
                console.error("Failed to get local media:", err)
                setCallStatus("Camera access denied")
            })

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    const callPeer = () => {
        if (!peer || !remotePeerId || !localStreamRef.current) {
            setCallStatus("Please enter a peer ID and ensure camera is ready")
            return
        }

        setCallStatus("Calling...")
        const call = peer.call(remotePeerId, localStreamRef.current)

        call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream
            }
            setIsConnected(true)
            setCallStatus("Connected")
        })

        call.on("close", () => {
            setIsConnected(false)
            setCallStatus("Call ended")
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null
            }
        })

        currentCallRef.current = call
    }

    const endCall = () => {
        if (currentCallRef.current) {
            currentCallRef.current.close()
            currentCallRef.current = null
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null
        }

        setIsConnected(false)
        setRemotePeerId("")
        setCallStatus("Call ended")
    }

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setIsVideoEnabled(videoTrack.enabled)
            }
        }
    }

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsAudioEnabled(audioTrack.enabled)
            }
        }
    }

    const copyPeerId = () => {
        navigator.clipboard.writeText(peerId)
        setCallStatus("Peer ID copied!")
        setTimeout(() => setCallStatus(isConnected ? "Connected" : "Ready to connect"), 2000)
    }

    return (
        <div className="min-h-screen w-full relative bg-gradient-to-br from-white via-indigo-50/30 to-white px-4 sm:px-6 md:px-10 lg:px-20 py-10 md:py-20">
            <div className="max-w-6xl mx-auto pt-10">
                {/* Tools Section */}
                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-70 mb-5 bg-black/20 backdrop-blur-2xl rounded-full p-2 ">
                    <div className="flex gap-3 justify-center md:justify-start">
                        <button
                            onClick={toggleVideo}
                            className={`p-3 rounded-full transition-all duration-200 font-medium flex items-center gap-2 ${isVideoEnabled
                                ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                                : "bg-red-100 hover:bg-red-200 text-red-600"
                                }`}
                            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                        >
                            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                        </button>
                        <button
                            onClick={toggleAudio}
                            className={`p-3 rounded-full transition-all duration-200 font-medium flex items-center gap-2 ${isAudioEnabled
                                ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                                : "bg-red-100 hover:bg-red-200 text-red-600"
                                }`}
                            title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
                        >
                            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                        </button>
                        {isConnected && (
                            <button
                                onClick={endCall}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 font-medium hover:shadow-lg hover:shadow-red-200/50"
                            >
                                <PhoneOff size={20} />
                            </button>
                        )}
                    </div>
                </div>
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Video Call</h1>
                    <p className="text-gray-600 text-base md:text-lg font-light">
                        Connect with others through high-quality peer-to-peer video calls
                    </p>
                </div>

                {/* Status and ID Section */}
                <div className="bg-white/60 backdrop-blur-sm border border-gray-300 hover:border-gray-400 rounded-2xl p-6 md:p-8 mb-8 transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <User className="text-indigo-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Your Peer ID</p>
                                    <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-indigo-600 text-sm font-mono block mt-1">
                                        {peerId || "Connecting..."}
                                    </code>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}></div>
                                <span className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-yellow-600"}`}>
                                    {callStatus}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={copyPeerId}
                            disabled={!peerId}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium hover:shadow-lg hover:shadow-indigo-200/50 disabled:hover:shadow-none"
                        >
                            <Copy size={18} />
                            Copy ID
                        </button>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Local Video */}
                    <div className="relative bg-white/60 backdrop-blur-sm border border-gray-300 rounded-2xl overflow-hidden aspect-video shadow-lg hover:shadow-xl transition-all duration-200">
                        <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-gray-900 text-sm font-medium border border-gray-200">
                            You
                        </div>
                    </div>

                    {/* Remote Video */}
                    <div className="relative bg-white/60 backdrop-blur-sm border border-gray-300 rounded-2xl overflow-hidden aspect-video shadow-lg hover:shadow-xl transition-all duration-200">
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        {!isConnected && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                <User size={64} className="text-gray-300 mb-3" />
                                <p className="text-gray-500 text-sm font-medium">Waiting for connection...</p>
                            </div>
                        )}
                        {isConnected && (
                            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-gray-900 text-sm font-medium border border-gray-200">
                                Remote
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Section */}
                <div className="bg-white/60 backdrop-blur-sm border border-gray-300 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50">
                    <div className="space-y-6">
                        {/* Connection Input */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    value={remotePeerId}
                                    onChange={(e) => setRemotePeerId(e.target.value)}
                                    placeholder="Enter remote peer ID"
                                    disabled={isConnected}
                                    className="w-full px-4 py-3 bg-white/60 border border-gray-300 focus:border-indigo-500 focus:bg-white/80 rounded-xl text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            {!isConnected ? (
                                <button
                                    onClick={callPeer}
                                    disabled={!remotePeerId || !peer}
                                    className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium hover:shadow-lg hover:shadow-indigo-200/50 disabled:hover:shadow-none group"
                                >
                                    <Phone size={20} />
                                    <span className="hidden sm:inline">Call</span>
                                </button>
                            ) : (
                                <button
                                    onClick={endCall}
                                    className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 font-medium hover:shadow-lg hover:shadow-red-200/50"
                                >
                                    <PhoneOff size={20} />
                                    <span className="hidden sm:inline">End</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-indigo-50/60 backdrop-blur-sm border border-indigo-200 rounded-2xl p-6 md:p-8">
                    <div className="flex gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                            <AlertCircle className="text-indigo-600" size={20} />
                        </div>
                        <h3 className="text-indigo-900 font-semibold text-lg">How to use</h3>
                    </div>
                    <ol className="text-indigo-800 text-sm md:text-base space-y-2 list-decimal list-inside font-light">
                        <li>Copy your Peer ID and share it with the person you want to call</li>
                        <li>Get their Peer ID and enter it in the input field above</li>
                        <li>Click "Call" to initiate the video call</li>
                        <li>Use the camera and microphone buttons to control your media</li>
                        <li>Click "End" to disconnect the call</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
