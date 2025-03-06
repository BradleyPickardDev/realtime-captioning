# Realtime Captioning Service (TypeScript + WebSockets + Redis)

## 📌 Overview

This is a real-time captioning backend service built using Node.js, TypeScript, WebSockets (ws), and Redis. The service:

- Accepts real-time audio packets via WebSocket.
- Simulates captioning by returning random text with a 500ms delay.
- Tracks total captioning usage (milliseconds) per client.
- Enforces a usage limit (e.g., 60 seconds per client).
- Uses Redis (running in Docker) for efficient usage tracking instead of in-memory storage.

## 📂 Project Structure

```
realtime-captioning-service/
│── src/
│ ├── routes/
│ │ ├── usage.routes.ts # REST API for tracking usage
│ ├── controllers/
│ │ ├── usage.controller.ts # Handles API logic for usage tracking
│ ├── services/
│ │ ├── websocket.service.ts # Handles WebSocket connections
│ │ ├── captioning.service.ts # Manages captioning logic
│ │ ├── redis.service.ts # Redis connection and helper functions
│ │ ├── usage.service.ts # Handles usage tracking
│ ├── utils/
│ │ ├── loremIpsum.ts # Generates random captions
│ ├── config/
│ ├── index.ts # Entry point - initializes server
│── tsconfig.json
│── package.json
│── README.md
```

## ⚙️ Implementation Choices

### Tech Stack:

- ✅ **Node.js + TypeScript** for type safety & maintainability.
- ✅ **WebSockets (ws)** for real-time communication.
- ✅ **Redis (running in Docker)** for tracking usage efficiently across multiple clients.
- ✅ **Express.js** for handling API routes.
- ✅ **Modular architecture** with controllers & services.

## 🚀 How to Run the Service

### 1️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣ Start Redis in Docker
If you haven't already, start Redis using Docker:
```sh
docker run --name redis-container -p 6379:6379 -d redis
```
Or, if you have a `docker-compose.yml`:
```sh
docker-compose up -d
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory:
```sh
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default # (Optional, based on Redis setup)
REDIS_PASSWORD= # Leave empty if no password
```

### 4️⃣ Start the Server
```sh
npm run dev # Runs with nodemon (if set up)
npm run build && npm start # For production
```

## 🛠️ How to Test the Endpoints

### 1️⃣ Test WebSocket Connection

#### Using Postman (WebSocket Request)
- Open Postman → New Request → WebSocket Request
- Connect to:
```sh
ws://localhost:3000
```
- Send:
```json
{ "clientId": "user123" }
```
- Expected Response:
```json
{ "text": "Lorem ipsum dolor sit amet" }
```

#### Using a Simple Node.js WebSocket Client
Create `test_client.ts`:
```typescript
import WebSocket from "ws";
const ws = new WebSocket("ws://localhost:3000");

ws.on("open", () => {
  console.log("Connected to server");
  ws.send(JSON.stringify({ clientId: "user123" }));
});

ws.on("message", (data) => {
  console.log("Received:", data.toString());
});
```
Run:
```sh
npx ts-node test_client.ts
```

### 2️⃣ Test API Usage Endpoint

#### Check Captioning Usage for a Client
```sh
curl http://localhost:3000/usage/user123
```
Expected response:
```json
{ "clientId": "user123", "usageMs": 5000 }
```
