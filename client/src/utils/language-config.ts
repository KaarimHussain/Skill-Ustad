export interface LanguageConfig {
    code: string
    name: string
    flag: string
    speechLang: string
    ttsLang: string
    rtl: boolean
  }
  
  export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
    english: {
      code: "en",
      name: "English",
      flag: "🇺🇸",
      speechLang: "en-US",
      ttsLang: "en-US",
      rtl: false,
    },
    hindi: {
      code: "hi",
      name: "Hindi",
      flag: "🇮🇳",
      speechLang: "hi-IN",
      ttsLang: "hi-IN",
      rtl: false,
    },
    "roman-urdu": {
      code: "ur-roman",
      name: "Roman Urdu",
      flag: "🇵🇰",
      speechLang: "en-US", // Roman Urdu uses English speech recognition
      ttsLang: "ur-PK",
      rtl: false,
    },
  }
  
  export const getLanguageConfig = (language: string): LanguageConfig => {
    return SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.english
  }
  
  // UI text translations
  export const UI_TRANSLATIONS = {
    english: {
      listening: "Listening...",
      speaking: "Speaking...",
      processing: "Processing...",
      connectionError: "Connection Error",
      systemError: "System Error",
      interviewComplete: "Interview Complete",
      ready: "Ready",
      startInterview: "Start Interview",
      yourResponse: "Your Response:",
      liveTranscript: "Live Transcript:",
      transcript: "Transcript",
      you: "You",
      interviewer: "Interviewer",
      securityViolation: "Security violation detected! Please follow interview guidelines.",
      disableAudio: "Disable Audio",
      enableAudio: "Enable Audio",
      hideTranscript: "Hide Transcript",
      showTranscript: "Show Transcript",
      exitInterview: "Exit interview (progress will be lost)",
      completeInterview: "Complete interview",
      retryConnection: "Retry connection",
      stopListening: "Stop listening",
      startListening: "Start listening",
      beginInterview: "Begin interview",
      stopSpeaking: "Stop Speaking",
      endInterview: "End Interview",
      pauseDetected: "Pause detected:",
      processingIn: "processing in",
      nextPhoto: "Next Photo:",
      fullscreenActive: "Fullscreen Active",
      question: "Question",
      focusLost: "Focus Lost:",
      messages: "messages",
    },
    hindi: {
      listening: "सुन रहा है...",
      speaking: "बोल रहा है...",
      processing: "प्रोसेसिंग...",
      connectionError: "कनेक्शन एरर",
      systemError: "सिस्टम एरर",
      interviewComplete: "इंटरव्यू पूरा",
      ready: "तैयार",
      startInterview: "इंटरव्यू शुरू करें",
      yourResponse: "आपका जवाब:",
      liveTranscript: "लाइव ट्रांसक्रिप्ट:",
      transcript: "ट्रांसक्रिप्ट",
      you: "आप",
      interviewer: "इंटरव्यूअर",
      securityViolation: "सुरक्षा उल्लंघन का पता चला! कृपया इंटरव्यू दिशानिर्देशों का पालन करें।",
      disableAudio: "ऑडियो बंद करें",
      enableAudio: "ऑडियो चालू करें",
      hideTranscript: "ट्रांसक्रिप्ट छुपाएं",
      showTranscript: "ट्रांसक्रिप्ट दिखाएं",
      exitInterview: "इंटरव्यू से बाहर निकलें (प्रगति खो जाएगी)",
      completeInterview: "इंटरव्यू पूरा करें",
      retryConnection: "कनेक्शन पुनः प्रयास करें",
      stopListening: "सुनना बंद करें",
      startListening: "सुनना शुरू करें",
      beginInterview: "इंटरव्यू शुरू करें",
      stopSpeaking: "बोलना बंद करें",
      endInterview: "इंटरव्यू समाप्त करें",
      pauseDetected: "विराम का पता चला:",
      processingIn: "प्रोसेसिंग में",
      nextPhoto: "अगली फोटो:",
      fullscreenActive: "फुलस्क्रीन सक्रिय",
      question: "प्रश्न",
      focusLost: "फोकस खो गया:",
      messages: "संदेश",
    },
    "roman-urdu": {
      listening: "Sun raha hai...",
      speaking: "Bol raha hai...",
      processing: "Processing...",
      connectionError: "Connection Error",
      systemError: "System Error",
      interviewComplete: "Interview Complete",
      ready: "Tayyar",
      startInterview: "Interview Shuru Karein",
      yourResponse: "Aapka Jawab:",
      liveTranscript: "Live Transcript:",
      transcript: "Transcript",
      you: "Aap",
      interviewer: "Interviewer",
      securityViolation: "Security violation detect hua! Mehrbani kar ke interview guidelines follow karein.",
      disableAudio: "Audio Band Karein",
      enableAudio: "Audio Chalu Karein",
      hideTranscript: "Transcript Chupayein",
      showTranscript: "Transcript Dikhayein",
      exitInterview: "Interview se bahar nikalein (progress kho jayegi)",
      completeInterview: "Interview complete karein",
      retryConnection: "Connection retry karein",
      stopListening: "Sunna band karein",
      startListening: "Sunna shuru karein",
      beginInterview: "Interview shuru karein",
      stopSpeaking: "Bolna band karein",
      endInterview: "Interview khatam karein",
      pauseDetected: "Pause detect hua:",
      processingIn: "processing mein",
      nextPhoto: "Agli Photo:",
      fullscreenActive: "Fullscreen Active",
      question: "Sawal",
      focusLost: "Focus Kho Gaya:",
      messages: "messages",
    },
  }
  
  export const getUIText = (language: string, key: keyof typeof UI_TRANSLATIONS.english): string => {
    const translations = UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS] || UI_TRANSLATIONS.english
    return translations[key] || UI_TRANSLATIONS.english[key]
  }
  