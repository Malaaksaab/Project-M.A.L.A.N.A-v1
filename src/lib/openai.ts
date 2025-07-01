import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "dummy-key-for-development",
  dangerouslyAllowBrowser: true,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getAIResponse(
  prompt: string,
  mood: "casual" | "formal" | "professional" = "professional",
) {
  try {
    // Create system message based on mood
    let systemMessage = "";

    switch (mood) {
      case "casual":
        systemMessage =
          "You are MALANA, a friendly and casual AI assistant. Use informal language, contractions, and be conversational.";
        break;
      case "formal":
        systemMessage =
          "You are MALANA, a formal AI assistant. Use proper language, avoid contractions, and maintain a respectful tone.";
        break;
      case "professional":
        systemMessage =
          "You are MALANA, a professional AI assistant. Provide concise, accurate information with a balanced tone.";
        break;
    }

    const messages: ChatMessage[] = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt },
    ];

    // In development mode, return mock responses if no API key
    if (import.meta.env.DEV && !import.meta.env.VITE_OPENAI_API_KEY) {
      return getMockResponse(prompt, mood);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: mood === "casual" ? 0.8 : mood === "formal" ? 0.3 : 0.5,
    });

    return (
      response.choices[0]?.message?.content ||
      "I apologize, but I was unable to process your request."
    );
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
}

// Mock responses for development without API key
function getMockResponse(
  prompt: string,
  mood: "casual" | "formal" | "professional",
): string {
  const promptLower = prompt.toLowerCase();

  // Weather related
  if (promptLower.includes("weather")) {
    if (mood === "casual")
      return "It's looking pretty nice today! Sunny with some clouds, around 72°F.";
    if (mood === "formal")
      return "The current weather conditions are favorable. It is partly cloudy with a temperature of 72 degrees Fahrenheit.";
    return "Current weather: Partly cloudy, 72°F, with light winds from the northwest at 5mph.";
  }

  // Time related
  if (promptLower.includes("time")) {
    const now = new Date();
    if (mood === "casual")
      return `It's about ${now.toLocaleTimeString()} right now!`;
    if (mood === "formal")
      return `The current time is ${now.toLocaleTimeString()}.`;
    return `Current time: ${now.toLocaleTimeString()}`;
  }

  // General knowledge
  if (
    promptLower.includes("what is") ||
    promptLower.includes("who is") ||
    promptLower.includes("how to")
  ) {
    if (mood === "casual")
      return "That's a great question! I'd need to look that up for you, but I can definitely help with that when I'm connected to the internet.";
    if (mood === "formal")
      return "That is an excellent inquiry. I would require internet connectivity to provide you with accurate information on this subject.";
    return "I would need to access up-to-date information to answer this question accurately. Please ensure I have internet connectivity.";
  }

  // Greeting
  if (
    promptLower.includes("hello") ||
    promptLower.includes("hi") ||
    promptLower.includes("hey")
  ) {
    if (mood === "casual")
      return "Hey there! How's it going? What can I help you with today?";
    if (mood === "formal")
      return "Hello. It is a pleasure to assist you today. How may I be of service?";
    return "Hello. I'm MALANA, your AI assistant. How can I help you today?";
  }

  // Default response
  if (mood === "casual")
    return "I'm not sure what you're asking, but I'm happy to help! Could you give me a bit more info?";
  if (mood === "formal")
    return "I apologize, but I am uncertain about your request. Would you kindly provide additional details?";
  return "I need more information to process your request effectively. Could you please clarify?";
}
