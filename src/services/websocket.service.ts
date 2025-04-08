import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { generateCaption } from "../utils/loremIpsum";
import { addUsage, checkUsageLimit } from "./usage.service";

const PACKET_DURATION_MS = 100; // Each audio packet represents 100ms
const CAPTION_INTERVAL_MS = 3000; // Interval for sending captions

function sendError (ws: WebSocket, msg: string) {
  ws.send(JSON.stringify({error: msg}));
}

function startCaptionLoop (ws: WebSocket,
  getClientId: () => string | null
): NodeJS.Timeout {
  const interval: ReturnType<typeof setInterval> = setInterval(async () => {
    const clientId = getClientId();

    if (!clientId) return;

    if (await checkUsageLimit(clientId)) {
      sendError(ws, "Usage limit exceeded");
      console.log(`Client ${clientId} disconnected due to limit`);
      clearInterval(interval);
      ws.terminate();
      return;
    }
    ws.send(JSON.stringify({ text: generateCaption() }));
  }, CAPTION_INTERVAL_MS);
  return interval;
}

export default function websocketHandler(
  ws: WebSocket,
  req: IncomingMessage
): void {
  console.log("Client connected");
  
  let clientId: string | null = null;

  ws.on("message", async (message: string) => handleMessage(ws, message));
  const interval = startCaptionLoop(ws, () => clientId);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  ws.on("error", (err) => {
    console.log(`Websocket error for ${clientId ?? "unknown client"}`, err);
  });

  function handleMessage(ws: WebSocket, message: string) {
    try{
      const data = JSON.parse(message) //as {clientId: string};
      if (data.key !== clientId) {
        return sendError(ws, "Missing clientId");
      }
      
      if (!data.clientId) {
        return sendError(ws, "Missing clientId");
      }

      clientId = data.clientId;

      return checkUsageLimit(clientId).then((limitExceeded) => {
        if (limitExceeded) {
          sendError(ws, "Usage limit exceeded");
          ws.terminate();
          return;
        }

        return addUsage(clientId!, PACKET_DURATION_MS);
      });
    } catch {
      sendError(ws, "Invalid message format");
    }
  }
}