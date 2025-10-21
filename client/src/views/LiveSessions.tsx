import { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Copy, User } from 'lucide-react';

export default function LiveSessions() {
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [peer, setPeer] = useState<Peer | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [callStatus, setCallStatus] = useState<string>('');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const currentCallRef = useRef<any>(null);

    // Initialize peer connection
    useEffect(() => {
        const newPeer = new Peer();

        newPeer.on('open', (id) => {
            setPeerId(id);
            setCallStatus('Ready to connect');
        });

        newPeer.on('call', (call) => {
            setCallStatus('Incoming call...');

            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    localStreamRef.current = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }

                    call.answer(stream);

                    call.on('stream', (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                        setIsConnected(true);
                        setCallStatus('Connected');
                    });

                    currentCallRef.current = call;
                })
                .catch((err) => {
                    console.error('Failed to get media:', err);
                    setCallStatus('Media access denied');
                });
        });

        setPeer(newPeer);

        return () => {
            newPeer.destroy();
        };
    }, []);

    // Start local video on mount
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error('Failed to get local media:', err);
                setCallStatus('Camera access denied');
            });

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const callPeer = () => {
        if (!peer || !remotePeerId || !localStreamRef.current) {
            setCallStatus('Please enter a peer ID and ensure camera is ready');
            return;
        }

        setCallStatus('Calling...');
        const call = peer.call(remotePeerId, localStreamRef.current);

        call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setIsConnected(true);
            setCallStatus('Connected');
        });

        call.on('close', () => {
            setIsConnected(false);
            setCallStatus('Call ended');
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
        });

        currentCallRef.current = call;
    };

    const endCall = () => {
        if (currentCallRef.current) {
            currentCallRef.current.close();
            currentCallRef.current = null;
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        setIsConnected(false);
        setRemotePeerId('');
        setCallStatus('Call ended');
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    };

    const copyPeerId = () => {
        navigator.clipboard.writeText(peerId);
        setCallStatus('Peer ID copied!');
        setTimeout(() => setCallStatus(isConnected ? 'Connected' : 'Ready to connect'), 2000);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">
                    Video Call App
                </h1>

                {/* Status and ID Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <User className="text-blue-400" size={20} />
                            <span className="text-white font-medium">Your Peer ID:</span>
                            <code className="bg-black/30 px-3 py-1 rounded text-blue-300 text-sm">
                                {peerId || 'Connecting...'}
                            </code>
                        </div>
                        <button
                            onClick={copyPeerId}
                            disabled={!peerId}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition"
                        >
                            <Copy size={16} />
                            Copy
                        </button>
                    </div>
                    <div className="text-center">
                        <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                            {callStatus}
                        </span>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Local Video */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
                            You
                        </div>
                    </div>

                    {/* Remote Video */}
                    <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <User size={64} />
                            </div>
                        )}
                        {isConnected && (
                            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
                                Remote
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Connection Input */}
                        <div className="flex gap-2 flex-1 w-full md:w-auto">
                            <input
                                type="text"
                                value={remotePeerId}
                                onChange={(e) => setRemotePeerId(e.target.value)}
                                placeholder="Enter remote peer ID"
                                disabled={isConnected}
                                className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                            {!isConnected ? (
                                <button
                                    onClick={callPeer}
                                    disabled={!remotePeerId || !peer}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
                                >
                                    <Phone size={20} />
                                    Call
                                </button>
                            ) : (
                                <button
                                    onClick={endCall}
                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                                >
                                    <PhoneOff size={20} />
                                    End
                                </button>
                            )}
                        </div>

                        {/* Media Controls */}
                        <div className="flex gap-3">
                            <button
                                onClick={toggleVideo}
                                className={`p-3 rounded-full transition ${isVideoEnabled
                                    ? 'bg-slate-700 hover:bg-slate-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                {isVideoEnabled ? (
                                    <Video className="text-white" size={24} />
                                ) : (
                                    <VideoOff className="text-white" size={24} />
                                )}
                            </button>
                            <button
                                onClick={toggleAudio}
                                className={`p-3 rounded-full transition ${isAudioEnabled
                                    ? 'bg-slate-700 hover:bg-slate-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                {isAudioEnabled ? (
                                    <Mic className="text-white" size={24} />
                                ) : (
                                    <MicOff className="text-white" size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-blue-300 font-semibold mb-2">How to use:</h3>
                    <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                        <li>Copy your Peer ID and share it with the person you want to call</li>
                        <li>Get their Peer ID and enter it in the input field</li>
                        <li>Click "Call" to start the video call</li>
                        <li>Use the video and mic buttons to toggle your camera and microphone</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}