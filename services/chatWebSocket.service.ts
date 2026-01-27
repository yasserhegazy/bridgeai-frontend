/**
 * Chat WebSocket Service
 * Handles WebSocket connection lifecycle and message routing
 */

export class ChatWebSocketError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = "ChatWebSocketError";
  }
}

export interface WebSocketConfig {
  url: string;
  sessionId: number;
  token: string;
  onMessage: (data: any) => void;
  onError: (error: string) => void;
  onConnectionChange: (state: "connecting" | "open" | "closed" | "error") => void;
}

export class ChatWebSocketService {
  private socket: WebSocket | null = null;
  private didOpenRef = false;
  private config: WebSocketConfig | null = null;

  connect(config: WebSocketConfig): void {
    console.log("[ChatWebSocketService] connect() called with:", {
      url: config.url.replace(/token=.*/, "token=***"),
      sessionId: config.sessionId,
    });

    if (this.socket?.readyState === WebSocket.OPEN) {
      console.warn("[ChatWebSocketService] Already connected, readyState:", this.socket.readyState);
      return;
    }

    this.config = config;
    this.didOpenRef = false;

    console.log("[ChatWebSocketService] Creating new WebSocket...");
    const ws = new WebSocket(config.url);
    this.socket = ws;

    console.log("[ChatWebSocketService] WebSocket created, readyState:", ws.readyState);
    config.onConnectionChange("connecting");

    ws.onopen = () => {
      console.log("[ChatWebSocketService] WebSocket connected");
      config.onConnectionChange("open");
      this.didOpenRef = true;
    };

    ws.onerror = () => {
      config.onConnectionChange("error");
      config.onError("WebSocket connection error. Please refresh to retry.");
    };

    ws.onclose = (event) => {
      config.onConnectionChange("closed");
      // In dev, React Strict Mode mounts/unmounts effects twice; ignore pre-open closes
      if (this.didOpenRef) {
        const codeInfo = event.code ? ` (code ${event.code})` : "";
        config.onError(event.reason || `Connection closed${codeInfo}`);
        console.warn("[ChatWebSocketService] WebSocket closed", {
          code: event.code,
          reason: event.reason,
        });
      }
    };

    ws.onmessage = (event) => {
      console.log("[ChatWebSocketService] Message received:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("[ChatWebSocketService] Parsed data:", data);
        config.onMessage(data);
      } catch (err) {
        console.error("[ChatWebSocketService] Failed to parse message", err);
      }
    };
  }

  send(message: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new ChatWebSocketError("Not connected. Please wait for the chat to reconnect.");
    }

    try {
      console.log("[ChatWebSocketService] Sending message:", message);
      this.socket.send(JSON.stringify(message));
      console.log("[ChatWebSocketService] Message sent successfully");
    } catch (err) {
      throw new ChatWebSocketError("Failed to send message. Please try again.");
    }
  }

  disconnect(): void {
    // Avoid closing a socket that never opened (dev double-mount)
    if (this.socket && this.didOpenRef && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    this.socket = null;
    this.didOpenRef = false;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  getState(): number | undefined {
    return this.socket?.readyState;
  }
}

// Singleton instance
export const chatWebSocketService = new ChatWebSocketService();
