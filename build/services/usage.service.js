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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUsage = addUsage;
exports.getUsage = getUsage;
exports.checkUsageLimit = checkUsageLimit;
const redis_service_1 = __importDefault(require("./redis.service"));
const MAX_USAGE_MS = 3000; // 60 seconds
function addUsage(clientId, duration) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentUsage = Number(yield redis_service_1.default.getKey(`usage:${clientId}`)) || 0;
        yield redis_service_1.default.setKey(`usage:${clientId}`, String(currentUsage + duration));
    });
}
function getUsage(clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        return Number(yield redis_service_1.default.getKey(`usage:${clientId}`)) || 0;
    });
}
function checkUsageLimit(clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getUsage(clientId)) >= MAX_USAGE_MS;
    });
}
