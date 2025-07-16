// Camera Service - Handles camera and identity verification
export interface CapturedImage {
  id: string
  dataUrl: string
  timestamp: Date
  verified: boolean
}

export class CameraService {
  private cameraStream: MediaStream | null = null
  private videoRef: React.RefObject<HTMLVideoElement>
  private canvasRef: React.RefObject<HTMLCanvasElement>
  private capturedImages: CapturedImage[] = []
  private cameraPermissionGranted = false
  private identityVerificationEnabled = true

  constructor(
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    private onSecurityEvent: (event: any) => void
  ) {
    this.videoRef = videoRef
    this.canvasRef = canvasRef
  }

  async initializeCamera(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      this.cameraStream = stream
      this.cameraPermissionGranted = true

      if (this.videoRef.current) {
        this.videoRef.current.srcObject = stream
        try {
          await this.videoRef.current.play()
        } catch (playError) {
          console.log("Video play was interrupted or failed:", playError)
          // This is normal for camera video, continue anyway
        }
      }

      console.log("Camera initialized successfully")
      return true
    } catch (error) {
      console.error("Camera initialization failed:", error)
      this.cameraPermissionGranted = false
      this.identityVerificationEnabled = false
      return false
    }
  }

  captureIdentityPhoto(): CapturedImage | null {
    if (!this.cameraStream || !this.videoRef.current || !this.canvasRef.current) {
      console.log("Camera not ready for capture")
      return null
    }

    const video = this.videoRef.current
    const canvas = this.canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return null

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8)

    const capturedImage: CapturedImage = {
      id: `identity_${Date.now()}`,
      dataUrl,
      timestamp: new Date(),
      verified: true,
    }

    this.capturedImages.push(capturedImage)

    this.onSecurityEvent({
      type: "identity_check",
      timestamp: new Date(),
      details: "Identity verification photo captured",
    })

    console.log("Identity verification photo captured")
    return capturedImage
  }

  // Take initial photo when interview starts
  takeInitialPhoto(): CapturedImage | null {
    console.log("Taking initial identity photo...")
    return this.captureIdentityPhoto()
  }

  // Take photo when user's turn begins (after AI finishes speaking)
  takeUserTurnPhoto(): CapturedImage | null {
    console.log("Taking user turn identity photo...")
    return this.captureIdentityPhoto()
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop())
      this.cameraStream = null
    }
  }

  getCapturedImages(): CapturedImage[] {
    return this.capturedImages
  }

  isCameraReady(): boolean {
    return this.cameraPermissionGranted && this.cameraStream !== null
  }

  isIdentityVerificationEnabled(): boolean {
    return this.identityVerificationEnabled
  }

  getCameraPermissionStatus(): boolean {
    return this.cameraPermissionGranted
  }
}