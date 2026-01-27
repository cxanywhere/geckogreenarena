import { getVapiRoleplayConfig, buildVapiAssistantConfig, convertRoleplayToVapiConfig, type VapiRoleplayConfig, type DatabaseRoleplay } from "./vapi-config";

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = "https://api.vapi.ai";

interface VapiCallResponse {
  id: string;
  orgId: string;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  status: string;
  type: string;
  webCallUrl?: string;
  transcript?: string;
  recordingUrl?: string;
  summary?: string;
  costBreakdown?: {
    total?: number;
    transport?: number;
    stt?: number;
    llm?: number;
    tts?: number;
    vapi?: number;
  };
  messages?: Array<{
    role: string;
    message: string;
    time: number;
    secondsFromStart: number;
  }>;
}

interface VapiWebCallResponse {
  callId: string;
  webCallUrl: string;
  status: string;
}

export class VapiService {
  private apiKey: string;

  constructor() {
    if (!VAPI_API_KEY) {
      throw new Error("VAPI_API_KEY is not configured");
    }
    this.apiKey = VAPI_API_KEY;
  }

  private async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${VAPI_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    return response;
  }

  async startWebCall(roleplayId: string): Promise<{ callId: string; config: VapiRoleplayConfig }> {
    const roleplayConfig = getVapiRoleplayConfig(roleplayId);
    if (!roleplayConfig) {
      throw new Error(`Roleplay configuration not found for ID: ${roleplayId}`);
    }

    const assistantConfig = buildVapiAssistantConfig(roleplayConfig);

    const response = await this.fetch("/call/web", {
      method: "POST",
      body: JSON.stringify({
        assistant: assistantConfig,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("VAPI start call error:", error);
      throw new Error(`Failed to start VAPI web call: ${error}`);
    }

    const data = await response.json() as VapiCallResponse;
    
    return {
      callId: data.id,
      config: roleplayConfig,
    };
  }

  async startWebCallWithDbRoleplay(roleplay: DatabaseRoleplay): Promise<{ callId: string; config: VapiRoleplayConfig }> {
    const roleplayConfig = convertRoleplayToVapiConfig(roleplay);
    const assistantConfig = buildVapiAssistantConfig(roleplayConfig);

    const response = await this.fetch("/call/web", {
      method: "POST",
      body: JSON.stringify({
        assistant: assistantConfig,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("VAPI start call error:", error);
      throw new Error(`Failed to start VAPI web call: ${error}`);
    }

    const data = await response.json() as VapiCallResponse;
    
    return {
      callId: data.id,
      config: roleplayConfig,
    };
  }

  async getCallDetails(callId: string): Promise<VapiCallResponse> {
    const response = await this.fetch(`/call/${callId}`);

    if (!response.ok) {
      const error = await response.text();
      console.error("VAPI get call error:", error);
      throw new Error(`Failed to get VAPI call details: ${error}`);
    }

    return await response.json() as VapiCallResponse;
  }

  async getCallTranscript(callId: string, maxRetries: number = 5): Promise<{ 
    transcript: string; 
    messages: Array<{ role: string; content: string }>;
    recordingUrl?: string;
  }> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const callDetails = await this.getCallDetails(callId);
        console.log(`VAPI call ${callId} attempt ${attempt + 1}: status=${callDetails.status}, messages=${callDetails.messages?.length || 0}, transcript length=${callDetails.transcript?.length || 0}`);
        
        // Check if call has ended and has transcript data
        if (callDetails.status === "ended" && (callDetails.messages?.length || callDetails.transcript)) {
          const messages = (callDetails.messages || []).map(msg => ({
            // VAPI uses "bot" or "assistant" for AI, "user" for human
            role: (msg.role === "assistant" || msg.role === "bot") ? "model" : "user",
            content: msg.message,
          }));

          return {
            transcript: callDetails.transcript || "",
            messages,
            recordingUrl: callDetails.recordingUrl,
          };
        }
        
        // If still processing, wait and retry
        if (attempt < maxRetries - 1) {
          console.log(`VAPI call ${callId} still processing, waiting 3s before retry...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (err: any) {
        lastError = err;
        console.error(`VAPI getCallTranscript attempt ${attempt + 1} failed:`, err.message);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Return empty if we couldn't get transcript after retries
    console.warn(`Could not get transcript for call ${callId} after ${maxRetries} attempts`);
    return {
      transcript: "",
      messages: [],
      recordingUrl: undefined,
    };
  }

  async endCall(callId: string): Promise<void> {
    const response = await this.fetch(`/call/${callId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("VAPI end call error:", error);
    }
  }

  async getCallDuration(callId: string): Promise<{ durationSeconds: number; status: string; startedAt?: string; endedAt?: string } | null> {
    try {
      const callDetails = await this.getCallDetails(callId);
      
      if (callDetails.startedAt && callDetails.endedAt) {
        const startTime = new Date(callDetails.startedAt).getTime();
        const endTime = new Date(callDetails.endedAt).getTime();
        const durationSeconds = Math.floor((endTime - startTime) / 1000);
        
        return {
          durationSeconds,
          status: callDetails.status,
          startedAt: callDetails.startedAt,
          endedAt: callDetails.endedAt,
        };
      }
      
      // If no endedAt, calculate from last message timestamp if available
      if (callDetails.startedAt && callDetails.messages?.length) {
        const lastMessage = callDetails.messages[callDetails.messages.length - 1];
        const durationSeconds = Math.ceil(lastMessage.secondsFromStart);
        
        return {
          durationSeconds,
          status: callDetails.status,
          startedAt: callDetails.startedAt,
        };
      }
      
      return {
        durationSeconds: 0,
        status: callDetails.status,
        startedAt: callDetails.startedAt,
      };
    } catch (error) {
      console.error(`Failed to get call duration for ${callId}:`, error);
      return null;
    }
  }

  getRoleplayConfig(roleplayId: string): VapiRoleplayConfig | undefined {
    return getVapiRoleplayConfig(roleplayId);
  }
}

export const vapiService = new VapiService();
