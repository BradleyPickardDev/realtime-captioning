import { Request, Response } from "express";
import { getUsage } from "../services/usage.service";

export default async function getUsageController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { clientId } = req.params;
    const usageMs = await getUsage(clientId);
    res.json({ clientId, usageMs });
  } catch (error) {
    console.error("Error fetching usage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
