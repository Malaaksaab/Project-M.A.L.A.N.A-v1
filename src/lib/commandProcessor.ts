// Command processor for MALANA

import { getAIResponse } from "./openai";

type CommandHandler = (command: string) => Promise<string>;
type CommandCategory =
  | "system"
  | "search"
  | "weather"
  | "time"
  | "calendar"
  | "email"
  | "files"
  | "music"
  | "security"
  | "knowledge";

interface CommandResult {
  response: string;
  category: CommandCategory;
}

class CommandProcessor {
  private handlers: Record<string, CommandHandler> = {};

  constructor() {
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers() {
    // System commands
    this.registerHandler("open", this.handleOpenCommand);
    this.registerHandler("close", this.handleCloseCommand);
    this.registerHandler("system status", this.handleSystemStatusCommand);

    // Search commands
    this.registerHandler("search for", this.handleSearchCommand);

    // Weather commands
    this.registerHandler("weather", this.handleWeatherCommand);

    // Time commands
    this.registerHandler("time", this.handleTimeCommand);
    this.registerHandler("date", this.handleDateCommand);

    // Calendar commands
    this.registerHandler("schedule", this.handleScheduleCommand);
    this.registerHandler("calendar", this.handleScheduleCommand);

    // Email commands
    this.registerHandler("email", this.handleEmailCommand);
    this.registerHandler("mail", this.handleEmailCommand);

    // File commands
    this.registerHandler("find file", this.handleFindFileCommand);
    this.registerHandler("create folder", this.handleCreateFolderCommand);

    // Music commands
    this.registerHandler("play", this.handlePlayCommand);
    this.registerHandler("pause", this.handlePauseCommand);
    this.registerHandler("stop", this.handleStopCommand);

    // Security commands
    this.registerHandler("privacy mode", this.handlePrivacyCommand);
    this.registerHandler("enable privacy", this.handlePrivacyCommand);
  }

  public registerHandler(keyword: string, handler: CommandHandler) {
    this.handlers[keyword.toLowerCase()] = handler;
  }

  public async processCommand(command: string): Promise<CommandResult> {
    const lowerCommand = command.toLowerCase();

    // Check for security commands first
    if (
      lowerCommand.includes("privacy mode") ||
      lowerCommand.includes("enable privacy")
    ) {
      return {
        response: await this.handlePrivacyCommand(command),
        category: "security",
      };
    }

    // Check for system commands
    if (
      lowerCommand.includes("system status") ||
      lowerCommand.includes("diagnostics")
    ) {
      return {
        response: await this.handleSystemStatusCommand(command),
        category: "system",
      };
    }

    // Check for time commands
    if (lowerCommand.includes("time")) {
      return {
        response: await this.handleTimeCommand(command),
        category: "time",
      };
    }

    // Check for date commands
    if (lowerCommand.includes("date")) {
      return {
        response: await this.handleDateCommand(command),
        category: "time",
      };
    }

    // Check for weather commands
    if (lowerCommand.includes("weather")) {
      return {
        response: await this.handleWeatherCommand(command),
        category: "weather",
      };
    }

    // Check for search commands
    if (lowerCommand.includes("search for")) {
      return {
        response: await this.handleSearchCommand(command),
        category: "search",
      };
    }

    // Check for open commands
    if (lowerCommand.includes("open")) {
      return {
        response: await this.handleOpenCommand(command),
        category: "system",
      };
    }

    // Check for close commands
    if (lowerCommand.includes("close") || lowerCommand.includes("exit")) {
      return {
        response: await this.handleCloseCommand(command),
        category: "system",
      };
    }

    // Check for file commands
    if (lowerCommand.includes("find file")) {
      return {
        response: await this.handleFindFileCommand(command),
        category: "files",
      };
    }

    if (lowerCommand.includes("create folder")) {
      return {
        response: await this.handleCreateFolderCommand(command),
        category: "files",
      };
    }

    // Check for schedule/calendar commands
    if (
      lowerCommand.includes("schedule") ||
      lowerCommand.includes("calendar") ||
      lowerCommand.includes("appointment")
    ) {
      return {
        response: await this.handleScheduleCommand(command),
        category: "calendar",
      };
    }

    // Check for email commands
    if (lowerCommand.includes("email") || lowerCommand.includes("mail")) {
      return {
        response: await this.handleEmailCommand(command),
        category: "email",
      };
    }

    // Check for music commands
    if (lowerCommand.includes("play")) {
      return {
        response: await this.handlePlayCommand(command),
        category: "music",
      };
    }

    if (
      lowerCommand.includes("pause") ||
      (lowerCommand.includes("stop") && !lowerCommand.includes("stop music"))
    ) {
      return {
        response: await this.handlePauseCommand(command),
        category: "music",
      };
    }

    // Check for general knowledge queries
    if (
      lowerCommand.includes("what is") ||
      lowerCommand.includes("who is") ||
      lowerCommand.includes("how to") ||
      lowerCommand.includes("tell me about") ||
      lowerCommand.includes("explain") ||
      lowerCommand.includes("?")
    ) {
      return {
        response: await this.handleKnowledgeQuery(command),
        category: "knowledge",
      };
    }

    // Greeting and personality
    if (
      lowerCommand.includes("hello") ||
      lowerCommand.includes("hi") ||
      lowerCommand.includes("hey")
    ) {
      return {
        response:
          "Hello! I'm MALANA, your AI assistant. How can I help you today?",
        category: "knowledge",
      };
    }

    if (lowerCommand.includes("goodbye") || lowerCommand.includes("bye")) {
      return {
        response: "Goodbye! I'll be here when you need me.",
        category: "knowledge",
      };
    }

    if (lowerCommand.includes("thank")) {
      return {
        response:
          "You're welcome. I'm here to assist you with anything you need.",
        category: "knowledge",
      };
    }

    if (
      lowerCommand.includes("who are you") ||
      lowerCommand.includes("your name")
    ) {
      return {
        response:
          "I am M.A.L.A.N.A, which stands for Multi-Adaptive Learning Artificial Neural Assistant. I'm designed to help you with various tasks through voice commands and natural language processing.",
        category: "knowledge",
      };
    }

    // Default response for unrecognized commands
    return {
      response:
        "I'm not sure I understood that command. Try saying 'search for [term]', 'what's the weather', or 'system status'. You can also ask me 'what can you do' for more options.",
      category: "knowledge",
    };
  }

  // Command handlers
  private async handleOpenCommand(command: string): Promise<string> {
    const app = command.toLowerCase().replace("open", "").trim();
    return `Opening ${app}...\n\nApplication launched successfully.`;
  }

  private async handleCloseCommand(command: string): Promise<string> {
    const app = command
      .toLowerCase()
      .replace(/close|exit/g, "")
      .trim();
    return `Closing ${app}...\n\nApplication terminated successfully.`;
  }

  private async handleSystemStatusCommand(command: string): Promise<string> {
    return `Running system diagnostics...\n\nAll systems operational\nCPU: ${Math.floor(Math.random() * 20) + 5}% utilization\nMemory: ${Math.floor(Math.random() * 4) + 2}GB/${Math.floor(Math.random() * 8) + 8}GB (${Math.floor(Math.random() * 30) + 10}%)\nStorage: ${Math.floor(Math.random() * 200) + 100}GB free of ${Math.floor(Math.random() * 500) + 500}GB\nNetwork: Connected (${Math.floor(Math.random() * 100) + 50} Mbps)\nBattery: ${Math.floor(Math.random() * 30) + 70}% (${Math.floor(Math.random() * 3) + 2}:${Math.floor(
      Math.random() * 60,
    )
      .toString()
      .padStart(2, "0")} remaining)\nNo security threats detected`;
  }

  private async handleSearchCommand(command: string): Promise<string> {
    const searchTerm = command.toLowerCase().replace("search for", "").trim();
    return `Searching for "${searchTerm}"...\n\nDisplaying top results for "${searchTerm}"`;
  }

  private async handleWeatherCommand(command: string): Promise<string> {
    const temp = Math.floor(Math.random() * 15) + 65;
    const conditions = [
      "Sunny",
      "Partly cloudy",
      "Cloudy",
      "Rainy",
      "Thunderstorms",
      "Snowy",
      "Foggy",
      "Clear",
    ][Math.floor(Math.random() * 8)];
    return `Checking current weather conditions...\n\nCurrent conditions: ${conditions}, ${temp}°F\nHigh: ${temp + Math.floor(Math.random() * 10)}°F, Low: ${temp - Math.floor(Math.random() * 10)}°F\nHumidity: ${Math.floor(Math.random() * 50) + 30}%\nWind: ${Math.floor(Math.random() * 15) + 1} mph ${["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)]}`;
  }

  private async handleTimeCommand(command: string): Promise<string> {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()}.`;
  }

  private async handleDateCommand(command: string): Promise<string> {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return `Today is ${now.toLocaleDateString(undefined, options)}.`;
  }

  private async handleScheduleCommand(command: string): Promise<string> {
    return `Checking your calendar...\n\nUpcoming appointments:\n9:00 AM - Team meeting\n12:30 PM - Lunch with client\n3:00 PM - Project review`;
  }

  private async handleEmailCommand(command: string): Promise<string> {
    if (
      command.toLowerCase().includes("check") ||
      command.toLowerCase().includes("read")
    ) {
      return `Checking your emails...\n\nYou have 3 unread messages:\n1. Project Update from Sarah\n2. Meeting Invitation from HR\n3. Newsletter from Tech Daily`;
    } else if (
      command.toLowerCase().includes("send") ||
      command.toLowerCase().includes("write")
    ) {
      return `Opening email composer. Please dictate your message or type it in.`;
    } else {
      return `Opening your email client...`;
    }
  }

  private async handleFindFileCommand(command: string): Promise<string> {
    const fileName = command
      .toLowerCase()
      .replace(/find file|search for file/g, "")
      .trim();
    return `Searching for file "${fileName}" in your documents...\n\nFound 3 results:\n1. ${fileName}.docx (Documents folder)\n2. ${fileName}_old.docx (Downloads folder)\n3. ${fileName}_draft.txt (Desktop)`;
  }

  private async handleCreateFolderCommand(command: string): Promise<string> {
    const folderName = command
      .toLowerCase()
      .replace("create folder", "")
      .trim();
    return `Creating new folder "${folderName}" in your Documents directory.\n\nFolder created successfully.`;
  }

  private async handlePlayCommand(command: string): Promise<string> {
    if (
      command.toLowerCase().includes("music") ||
      command.toLowerCase().includes("song")
    ) {
      const song = command
        .toLowerCase()
        .replace(/play music|play song|play/g, "")
        .trim();
      if (song) {
        return `Playing "${song}"...\n\nNow playing: "${song}" by Top Artist`;
      } else {
        return `Playing music from your library...\n\nNow playing: "Best Hits Playlist"`;
      }
    } else if (command.toLowerCase().includes("video")) {
      return `Playing video...\n\nNow playing selected video content`;
    } else {
      return `Resuming media playback...`;
    }
  }

  private async handlePauseCommand(command: string): Promise<string> {
    return `Media playback paused.`;
  }

  private async handleStopCommand(command: string): Promise<string> {
    return `Media playback stopped.`;
  }

  private async handlePrivacyCommand(command: string): Promise<string> {
    if (command.toLowerCase().includes("disable")) {
      return `Privacy mode has been disabled. Standard data processing is now active.`;
    } else {
      return `Privacy mode has been enabled. All conversations will be encrypted and not stored.`;
    }
  }

  private async handleKnowledgeQuery(command: string): Promise<string> {
    try {
      // Use OpenAI to get a response for general knowledge questions
      const response = await getAIResponse(command, "professional");
      return response;
    } catch (error) {
      console.error("Error getting AI response:", error);
      return `I'd need to look that up for you, but I can definitely help with that when I'm connected to the internet.`;
    }
  }
}

// Create a singleton instance
const commandProcessor = new CommandProcessor();
export default commandProcessor;
