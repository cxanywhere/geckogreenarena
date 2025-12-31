import { getVapiRoleplayConfig, buildVapiAssistantConfig, type VapiRoleplayConfig } from "./vapi-config";

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = "https://api.vapi.ai";

interface VapiCallResponse {
  id: string;
  orgId: string;
  createdAt: string;
  status: string;
  type: string;
  webCallUrl?: string;
  transcript?: string;
  recordingUrl?: string;
  summary?: string;
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

  async getCallDetails(callId: string): Promise<VapiCallResponse> {
    const response = await this.fetch(`/call/${callId}`);

    if (!response.ok) {
      const error = await response.text();
      console.error("VAPI get call error:", error);
      throw new Error(`Failed to get VAPI call details: ${error}`);
    }

    return await response.json() as VapiCallResponse;
  }

  async getCallTranscript(callId: string): Promise<{ 
    transcript: string; 
    messages: Array<{ role: string; content: string }>;
    recordingUrl?: string;
  }> {
    const callDetails = await this.getCallDetails(callId);
    
    const messages = (callDetails.messages || []).map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      content: msg.message,
    }));

    return {
      transcript: callDetails.transcript || "",
      messages,
      recordingUrl: callDetails.recordingUrl,
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

  getRoleplayConfig(roleplayId: string): VapiRoleplayConfig | undefined {
    return getVapiRoleplayConfig(roleplayId);
  }
}

export const vapiService = new VapiService();
