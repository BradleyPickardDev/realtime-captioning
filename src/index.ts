import express, { Application } from "express";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import WebSocket, { WebSocketServer } from "ws";
import usageRoutes from "./routes/usage.routes";
import websocketHandler from "./services/websocket.service";

const app: Application = express();
const server: http.Server = http.createServer(app);
const wss: WebSocketServer = new WebSocket.Server({ server });

app.use(express.json());
app.use("/usage", usageRoutes);

// Handle WebSocket connections
// wss
wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
  websocketHandler(ws, req);
});

const PORT: number = Number(process.env.PORT) || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
