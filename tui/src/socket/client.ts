const AGENT_URL = "ws://127.0.0.1:8000/ws";

export class ForgeSocket {
  private ws: WebSocket | null = null;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  connect(onEvent: (event: any) => void) {
    this.ws = new WebSocket(`${AGENT_URL}/${this.sessionId}`);

    this.ws.onopen = () => {
      console.log("Connected to Forge agent");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onEvent(data);
    };

    this.ws.onclose = () => {
      console.log("Disconnected — reconnecting in 2s...");
      setTimeout(() => this.connect(onEvent), 2000);
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  send(task: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ task }));
    }
  }

  disconnect() {
    this.ws?.close();
  }
}
