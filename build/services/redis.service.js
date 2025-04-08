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
const ioredis_1 = __importDefault(require("ioredis"));
class RedisClient {
    constructor() {
        this.client = new ioredis_1.default({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });
        this.client.on("connect", () => console.log("Connected to Redis"));
        this.client.on("error", (err) => console.error("Redis Error:", err));
    }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }
    //Set a key-value pair
    setKey(key, value, expirySeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (expirySeconds) {
                    yield this.client.set(key, value, "EX", expirySeconds);
                }
                else {
                    yield this.client.set(key, value);
                }
            }
            catch (error) {
                console.error(`Redis SET Error: ${error}`);
            }
        });
    }
    // Get a value by key
    getKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.get(key);
            }
            catch (error) {
                console.error(`Redis GET Error: ${error}`);
                return null;
            }
        });
    }
    // Increment a value
    incrementKey(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, amount = 1) {
            try {
                return yield this.client.incrby(key, amount);
            }
            catch (error) {
                console.error(`Redis INCR Error: ${error}`);
                return 0;
            }
        });
    }
    // Delete a key
    deleteKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.del(key);
            }
            catch (error) {
                console.error(`Redis DEL Error: ${error}`);
            }
        });
    }
}
// Export an instance instead of the class itself
exports.default = RedisClient.getInstance();
