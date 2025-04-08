"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = websocketHandler;
const loremIpsum_1 = require("../utils/loremIpsum");
const usage_service_1 = require("./usage.service");
const PACKET_DURATION_MS = 100; // Each audio packet represents 100ms
const CAPTION_INTERVAL_MS = 3000; // Interval for sending captions
function sendError(ws, msg) {
    ws.send(JSON.stringify({ error: msg }));
}
function startCaptionLoop(ws, getClientId) {
    const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        const clientId = getClientId();
        if (!clientId)
            return;
        if (yield (0, usage_service_1.checkUsageLimit)(clientId)) {
            sendError(ws, "Usage limit exceeded");
            console.log(`Client ${clientId} disconnected due to limit`);
            clearInterval(interval);
            ws.terminate();
            return;
        }
        ws.send(JSON.stringify({ text: (0, loremIpsum_1.generateCaption)() }));
    }), CAPTION_INTERVAL_MS);
    return interval;
}
function websocketHandler(ws, req) {
    console.log("Client connected");
    let clientId = null;
    ws.on("message", (message) => __awaiter(this, void 0, void 0, function* () { return handleMessage(ws, message); }));
    const interval = startCaptionLoop(ws, () => clientId);
    ws.on("close", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
    ws.on("error", (err) => {
        console.log(`Websocket error for ${clientId !== null && clientId !== void 0 ? clientId : "unknown client"}`, err);
    });
    function handleMessage(ws, message) {
        try {
            const data = JSON.parse(message);
            if (!data.clientId) {
                return sendError(ws, "Missing clientId");
            }
            clientId = data.clientId;
            return (0, usage_service_1.checkUsageLimit)(clientId).then((limitExceeded) => {
                if (limitExceeded) {
                    sendError(ws, "Usage limit exceeded");
                    ws.terminate();
                    return;
                }
                return (0, usage_service_1.addUsage)(clientId, PACKET_DURATION_MS);
            });
        }
        catch (_a) {
            sendError(ws, "Invalid message format");
        }
    }
}
