"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ws_1 = __importDefault(require("ws"));
const usage_routes_1 = __importDefault(require("./routes/usage.routes"));
const websocket_service_1 = __importDefault(require("./services/websocket.service"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
app.use(express_1.default.json());
app.use("/usage", usage_routes_1.default);
// Handle WebSocket connections
wss;
wss.on("connection", (ws, req) => {
    (0, websocket_service_1.default)(ws, req);
});
const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
