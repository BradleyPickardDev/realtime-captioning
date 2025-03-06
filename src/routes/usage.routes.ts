import express from "express";
import { getUsageController } from "../controllers/usage.controller";

const router = express.Router();

router.get("/:clientId", getUsageController);

export default router;
