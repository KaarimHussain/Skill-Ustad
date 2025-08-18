/**
 * Core interfaces for all interview simulator services and hooks
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface SecurityEvent {
  type: 'tab_blur' | 'window_blur' | 'fullscreen_exit' | 'prohibited_key' | 'right_click' | 'identity_check';
  timestamp: Date;
  duration?: number;
  details?: string;
}

export interface IdentityPhoto {
  id: string;
  dataUrl: string;
  timestamp: Date;
  verified: boolean;
}

export interface InterviewReport {
  candidate: {
    technology: string;
    experienceLevel: string;
    interviewDuration: number;
    totalQuestions: number;
    totalResponses: number;
  };
  performance: {
    strengths: string[];
    weaknesses: string[];
    technicalKnowledge: number;
    communicationSkills: number;
    problemSolvingAbility: number;
    overallScore: number;
    grade: string;
  };
  security: {
    securityScore: number;
    violations: SecurityEvent[];
    identityVerifications: number;
    trustworthiness: string;
  };
  recommendations: string[];
  summary: string;
  timestamp: Date;
}

export interface InterviewData {
  chatHistory: ChatMessage[];
  securityEvents: SecurityEvent[];
  identityPhotos: IdentityPhoto[];
  startTime: Date;
  endTime: Date;
  questionCount: number;
}

// ============================================================================
// AUDIO SERVICE INTERFACES
// ============================================================================

export interface AudioConfig {
  baseUrl: string;
  voiceType: string;
  language: string;
  maxRetries: number;
}

export interface AudioQueueItem {
  id: string;
  text: string;
  priority: 'high' | 'normal' | 'low';
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface AudioState {
  isPlaying: boolean;
  isProcessing: boolean;
  queueLength: number;
  currentText: string | null;
  error: string | null;
}

export interface AudioActions {
  speak: (text: string, priority?: 'high' | 'normal' | 'low') => Promise<void>;
  stop: () => void;
  clearQueue: () => void;
  toggleEnabled: () => void;
}

export interface IAudioService {
  speak(text: string, priority?: 'high' | 'normal' | 'low'): Promise<void>;
  stop(): void;
  clearQueue(): void;
  getQueueStatus(): { length: number; isProcessing: boolean };
}

// ============================================================================
// IDENTITY VERIFICATION INTERFACES
// ============================================================================

export interface IdentityConfig {
  enabled: boolean;
  photoCount: number;
  intervalRange: [number, number]; // min, max seconds
}

export interface IdentityState {
  photos: IdentityPhoto[];
  isEnabled: boolean;
  nextCaptureIn: number | null;
  permissionGranted: boolean;
  error: string | null;
}

export interface IdentityActions {
  capturePhoto: () => Promise<IdentityPhoto | null>;
  enable: () => void;
  disable: () => void;
}

export interface IIdentityService {
  capturePhoto(): Promise<IdentityPhoto>;
  scheduleRandomCapture(): void;
  getPhotos(): IdentityPhoto[];
  cleanup(): void;
}

// ============================================================================
// SPEECH RECOGNITION INTERFACES
// ============================================================================

export interface SpeechConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  silenceTimeout: number;
}

export interface TranscriptResult {
  text: string;
  isFinal: boolean;
  confidence: number;
}

export interface SpeechState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
}

export interface SpeechActions {
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
}

export interface ISpeechService {
  start(): void;
  stop(): void;
  isSupported(): boolean;
  onResult(callback: (result: TranscriptResult) => void): void;
  onError(callback: (error: string) => void): void;
}

// ============================================================================
// SECURITY MONITORING INTERFACES
// ============================================================================

export interface SecurityConfig {
  enableFullscreen: boolean;
  enableKeyboardBlocking: boolean;
  enableContextMenuBlocking: boolean;
  scoreDeductions: Record<SecurityEvent['type'], number>;
}

export interface SecurityState {
  score: number;
  events: SecurityEvent[];
  isFullscreen: boolean;
  showWarning: boolean;
}

export interface SecurityActions {
  enterFullscreen: () => void;
  logEvent: (event: SecurityEvent) => void;
  dismissWarning: () => void;
}

export interface ISecurityService {
  startMonitoring(): void;
  stopMonitoring(): void;
  logEvent(event: SecurityEvent): void;
  getScore(): number;
  getEvents(): SecurityEvent[];
}

// ============================================================================
// INTERVIEW STATE INTERFACES
// ============================================================================

export interface InterviewConfig {
  technology: string;
  experienceLevel: string;
  maxQuestions: number;
  completionKeywords: string[];
}

export interface InterviewState {
  status: 'idle' | 'starting' | 'active' | 'completing' | 'completed' | 'error';
  startTime: Date | null;
  questionCount: number;
  chatHistory: ChatMessage[];
}

export interface InterviewStateHook {
  state: InterviewState;
  actions: {
    start: () => void;
    complete: () => void;
    addMessage: (message: ChatMessage) => void;
    reset: () => void;
  };
}

export interface IInterviewService {
  start(): void;
  complete(): void;
  addMessage(message: ChatMessage): void;
  shouldComplete(): boolean;
  getDuration(): number;
}

// ============================================================================
// AI INTEGRATION INTERFACES
// ============================================================================

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface AIState {
  isProcessing: boolean;
  error: string | null;
  usage: { promptTokens: number; completionTokens: number } | null;
}

export interface AIActions {
  processMessage: (messages: ChatMessage[]) => Promise<string>;
  generateReport: (data: InterviewData) => Promise<InterviewReport>;
}

export interface IAIService {
  processMessage(messages: ChatMessage[]): Promise<AIResponse>;
  generateReport(data: InterviewData): Promise<InterviewReport>;
}

// ============================================================================
// HOOK INTERFACES
// ============================================================================

export type UseAudioManager = (config: AudioConfig) => [AudioState, AudioActions];
export type UseIdentityVerification = (config: IdentityConfig) => [IdentityState, IdentityActions];
export type UseSpeechRecognition = (config: SpeechConfig) => [SpeechState, SpeechActions];
export type UseSecurityMonitoring = (config: SecurityConfig) => [SecurityState, SecurityActions];
export type UseInterviewState = (config: InterviewConfig) => InterviewStateHook;
export type UseAIIntegration = (config: AIConfig) => [AIState, AIActions];

// ============================================================================
// SERVICE FACTORY INTERFACES
// ============================================================================

export interface ServiceDependencies {
  audioService?: IAudioService;
  identityService?: IIdentityService;
  speechService?: ISpeechService;
  securityService?: ISecurityService;
  interviewService?: IInterviewService;
  aiService?: IAIService;
}

export interface ServiceFactoryConfig {
  audio?: AudioConfig;
  identity?: IdentityConfig;
  speech?: SpeechConfig;
  security?: SecurityConfig;
  interview?: InterviewConfig;
  ai?: AIConfig;
}

export interface IServiceFactory {
  createAudioService(config?: AudioConfig): IAudioService;
  createIdentityService(config?: IdentityConfig): IIdentityService;
  createSpeechService(config?: SpeechConfig): ISpeechService;
  createSecurityService(config?: SecurityConfig): ISecurityService;
  createInterviewService(config?: InterviewConfig): IInterviewService;
  createAIService(config?: AIConfig): IAIService;
  createAllServices(config?: ServiceFactoryConfig): ServiceDependencies;
  destroyAllServices(): Promise<void>;
}