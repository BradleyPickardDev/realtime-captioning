import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { generateCaption } from "../utils/loremIpsum";
import { addUsage, checkUsageLimit } from "./usage.service";

const PACKET_DURATION_MS = 100; // Each audio packet represents 100ms
const CAPTION_INTERVAL_MS = 3000; // Interval for sending captions

export default function websocketHandler(
  ws: WebSocket,
  req: IncomingMessage
): void {
  console.log("Client connected");

  let clientId: string | null = null;

  ws.on("message", async (message: string) => {
    try {
      const data = JSON.parse(message) as { clientId: string };
      if (!data.clientId) {
        ws.send(JSON.stringify({ error: "Missing clientId" }));
        return;
      }
      clientId = data.clientId;
      // Check if the client has already exceeded usage
      if (await checkUsageLimit(clientId)) {
        ws.send(JSON.stringify({ error: "Usage limit exceeded" }));
        ws.terminate();
        return;
      }
      // Increase usage per received packet
      await addUsage(clientId, PACKET_DURATION_MS);
    } catch (error) {
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });

  // Start captioning loop once for this connection
  const interval = setInterval(async () => {
    if (!clientId) return;
    if (await checkUsageLimit(clientId)) {
      ws.send(JSON.stringify({ error: "Usage limit exceeded" }));
      console.log(`Client ${clientId} disconnected due to limit`);
      clearInterval(interval);
      ws.terminate();
      return;
    }

    ws.send(JSON.stringify({ text: generateCaption() }));
  }, CAPTION_INTERVAL_MS);

  // Handle WebSocket close event
  ws.on("close", () => {
    console.log(`Client disconnected`);
    clearInterval(interval);
  });
  ws.on("error", (err) => {
    console.error(`WebSocket error for ${clientId}:`, err);
  });
}
