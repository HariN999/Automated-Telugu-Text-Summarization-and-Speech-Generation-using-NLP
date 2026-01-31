// Consolidated API Service for Telugu AI Application

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}

class APIService {
  /**
   * Handle API response
   * @private
   */
  static async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.detail || errorData.message || "API request failed",
        response.status,
        errorData
      );
    }
    return await response.json();
  }

  /**
   * Handle API errors
   * @private
   */
  static handleError(error) {
    console.error("API Error:", error);
    
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
        status: error.status,
        details: error.details,
      };
    }
    
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Unable to connect to the server. Please check if the backend is running.",
        status: 0,
      };
    }
    
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
      status: 500,
    };
  }

  /**
   * Summarize Telugu text
   * @param {string} text - Telugu text to summarize
   * @param {string} method - Summarization method ("tfidf" or "indicbart")
   * @returns {Promise<Object>} - Response with summary and audio path
   */
  static async summarizeText(text, method = "tfidf") {
    try {
      if (!text || !text.trim()) {
        throw new Error("Text cannot be empty");
      }

      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          method,
        }),
      });

      const data = await this.handleResponse(response);
      return {
        success: true,
        summary: data.summary,
        audioPath: data.audio_path,
        method: data.method,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Process URL to extract and summarize news
   * @param {string} url - News article URL
   * @param {string} method - Summarization method
   * @returns {Promise<Object>} - Response with summary and audio
   */
  static async processUrl(url, method = "tfidf") {
    try {
      if (!url || !url.trim()) {
        throw new Error("URL cannot be empty");
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        throw new Error("Invalid URL format");
      }

      const response = await fetch(`${API_BASE_URL}/process-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          method,
        }),
      });

      const data = await this.handleResponse(response);
      return {
        success: true,
        title: data.title,
        summary: data.summary,
        audioPath: data.audio_path,
        originalUrl: data.original_url,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Process audio from speech recognition
   * @param {Blob} audioBlob - Recorded audio blob
   * @param {string} language - Language code ("en" or "te")
   * @param {string} mode - Processing mode ("radio", "brief", or "analysis")
   * @returns {Promise<Object>} - Response with transcription and summary
   */
  static async processSpeech(audioBlob, language = "en", mode = "brief") {
    try {
      if (!audioBlob) {
        throw new Error("Audio data is required");
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);
      formData.append("mode", mode);

      const response = await fetch(`${API_BASE_URL}/process-speech`, {
        method: "POST",
        body: formData,
      });

      const data = await this.handleResponse(response);
      return {
        success: true,
        transcription: data.transcription,
        summary: data.summary,
        audioPath: data.audio_path,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get audio file URL
   * @param {string} filename - Name of the audio file
   * @returns {string} - Full URL to the audio file
   */
  static getAudioUrl(filename) {
    if (!filename) return "";
    
    // Handle both full paths and just filenames
    const audioFilename = filename.includes("/") 
      ? filename.split("/").pop() 
      : filename;
      
    return `${API_BASE_URL}/audio/${audioFilename}`;
  }

  /**
   * Check API health
   * @returns {Promise<Object>} - API health status
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Health check failed");
      }

      const data = await response.json();
      return {
        success: true,
        status: data.status,
        timestamp: data.timestamp,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get API base URL
   * @returns {string} - API base URL
   */
  static getBaseUrl() {
    return API_BASE_URL;
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} - Whether API is reachable
   */
  static async testConnection() {
    try {
      const result = await this.checkHealth();
      return result.success;
    } catch {
      return false;
    }
  }
}

export default APIService;
export { APIError };