import { WSContext } from "hono/ws";

class PubSub {
  private clients: Set<WSContext<WebSocket>>;

  constructor() {
    this.clients = new Set();
  }

  getCount() {
    return this.clients.size;
  }

  subscribe(ws: WSContext<WebSocket>) {
    this.clients.add(ws);
  }

  unsubscribe(ws: WSContext<WebSocket>) {
    this.clients.delete(ws);
  }

  publish(message: string | number) {
    for (const client of this.clients) {
      client.send(String(message));
    }
  }
}

export const pubsub = new PubSub();
