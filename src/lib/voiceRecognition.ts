// Voice recognition service for MALANA

// This simulates a voice recognition service in the browser
// In a real app, this would use the Web Speech API or a third-party service

type RecognitionCallback = (text: string) => void;
type StatusCallback = (status: "listening" | "processing" | "idle") => void;

class VoiceRecognitionService {
  private isListening: boolean = false;
  private wakeWord: string = "hey malana";
  private recognitionCallback: RecognitionCallback | null = null;
  private statusCallback: StatusCallback | null = null;
  private recognition: SpeechRecognition | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    // Check if browser supports SpeechRecognition
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")
          .toLowerCase();

        // Check for wake word if not already actively listening for a command
        if (!this.isListening && transcript.includes(this.wakeWord)) {
          this.isListening = true;
          if (this.statusCallback) this.statusCallback("listening");
          // Clear previous transcript and start fresh
          this.recognition?.abort();
          this.recognition?.start();
          return;
        }

        // If we're listening for a command and have a final result
        if (
          this.isListening &&
          event.results[event.results.length - 1].isFinal
        ) {
          if (this.statusCallback) this.statusCallback("processing");
          if (this.recognitionCallback) {
            // Remove wake word from transcript if present
            const command = transcript.replace(this.wakeWord, "").trim();
            this.recognitionCallback(command);
          }
          this.isListening = false;
          setTimeout(() => {
            if (this.statusCallback) this.statusCallback("idle");
          }, 2000);
        }
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        this.isListening = false;
        if (this.statusCallback) this.statusCallback("idle");
      };

      this.recognition.onend = () => {
        // Restart recognition if it ends
        if (this.recognition) {
          this.recognition.start();
        }
      };
    } else {
      console.warn("Speech recognition not supported in this browser");
    }
  }

  public start() {
    try {
      this.recognition?.start();
    } catch (e) {
      // Recognition might already be started
      console.log("Recognition already started");
    }
  }

  public stop() {
    this.recognition?.stop();
    this.isListening = false;
    if (this.statusCallback) this.statusCallback("idle");
  }

  public setWakeWord(word: string) {
    this.wakeWord = word.toLowerCase();
  }

  public onCommand(callback: RecognitionCallback) {
    this.recognitionCallback = callback;
  }

  public onStatusChange(callback: StatusCallback) {
    this.statusCallback = callback;
  }

  public manualListenForCommand() {
    this.isListening = true;
    if (this.statusCallback) this.statusCallback("listening");
  }
}

// Create a singleton instance
const voiceRecognition = new VoiceRecognitionService();
export default voiceRecognition;

// Type definitions for browsers that don't have these types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
