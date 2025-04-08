"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usage_controller_1 = require("../controllers/usage.controller");
const router = express_1.default.Router();
router.get("/:clientId", usage_controller_1.getUsageController);
exports.default = router;
