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
exports.getUsageController = getUsageController;
const usage_service_1 = require("../services/usage.service");
function getUsageController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clientId } = req.params;
            const usageMs = yield (0, usage_service_1.getUsage)(clientId);
            res.json({ clientId, usageMs });
        }
        catch (error) {
            console.error("Error fetching usage:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
