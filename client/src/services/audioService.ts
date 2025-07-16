// Audio Service - Handles all audio-related functionality
export class AudioService {
  private currentAudioRef: HTMLAudioElement | null = null
  private audioQueue: string[] = []
  private isProcessingAudio = false
  private isAudioEnabled = true

  constructor(
    private onStateChange: (state: string) => void,
    private onAudioQueueChange: (queue: string[]) => void
  ) {}

  setAudioEnabled(enabled: boolean) {
    this.isAudioEnabled = enabled
    if (!enabled && this.currentAudioRef) {
      this.stopCurrentAudio()
    }
  }

  stopCurrentAudio() {
    if (this.currentAudioRef) {
      this.currentAudioRef.pause()
      this.currentAudioRef.currentTime = 0
      this.currentAudioRef.removeEventListener("ended", () => {})
      this.currentAudioRef.removeEventListener("error", () => {})
      this.currentAudioRef = null
    }
    this.audioQueue = []
    this.onAudioQueueChange([])
    this.isProcessingAudio = false
  }

  async speakWithEdgeTTS(
    text: string, 
    lang: "en" | "ur" = "en", 
    skipQueue = false,
    onComplete?: () => void
  ): Promise<void> {
    if (!this.isAudioEnabled) return

    if (!skipQueue) {
      this.audioQueue.push(text)
      this.onAudioQueueChange([...this.audioQueue])
      this.processAudioQueue(onComplete)
      return
    }

    try {
      this.stopCurrentAudio()
      this.onStateChange("speaking")

      const response = await fetch("http://127.0.0.1:8000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang,
          voice_type: "andrew",
        }),
      })

      if (!response.ok) {
        throw new Error(`Edge TTS failed: ${response.status}`)
      }

      const blob = await response.blob()
      if (blob.size === 0) {
        throw new Error("Received empty audio blob")
      }

      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)

      if (this.currentAudioRef) {
        this.currentAudioRef.pause()
        this.currentAudioRef = null
      }

      this.currentAudioRef = audio

      const playPromise = new Promise<void>((resolve, reject) => {
        const handleEnded = () => {
          this.onStateChange("idle")
          URL.revokeObjectURL(audioUrl)
          if (this.currentAudioRef === audio) {
            this.currentAudioRef = null
          }
          if (onComplete) onComplete()
          resolve()
        }

        const handleError = (error: any) => {
          console.error("Audio playback error:", error)
          URL.revokeObjectURL(audioUrl)
          if (this.currentAudioRef === audio) {
            this.currentAudioRef = null
          }
          reject(new Error("Audio playback failed"))
        }

        audio.addEventListener("ended", handleEnded, { once: true })
        audio.addEventListener("error", handleError, { once: true })
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      try {
        await audio.play()
        await playPromise
      } catch (playError) {
        if (playError instanceof Error && playError.name === 'AbortError') {
          console.log("Audio play was aborted, likely due to new audio starting")
          URL.revokeObjectURL(audioUrl)
          return
        }
        throw playError
      }

    } catch (error) {
      console.error("Edge TTS failed:", error)
      this.onStateChange("error")
    }
  }

  private async processAudioQueue(onComplete?: () => void) {
    if (this.isProcessingAudio || this.audioQueue.length === 0) return

    this.isProcessingAudio = true
    const nextAudio = this.audioQueue.shift()

    if (nextAudio) {
      await this.speakWithEdgeTTS(nextAudio, "en", true, onComplete)
    }

    this.isProcessingAudio = false
    this.onAudioQueueChange([...this.audioQueue])

    if (this.audioQueue.length > 0) {
      setTimeout(() => this.processAudioQueue(onComplete), 100)
    }
  }

  getAudioQueue() {
    return this.audioQueue
  }

  isCurrentlyPlaying() {
    return this.currentAudioRef !== null
  }
}