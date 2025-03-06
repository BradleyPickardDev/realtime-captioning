import redisClient from "./redis.service";
const MAX_USAGE_MS = 3000; // 60 seconds

export async function addUsage(
  clientId: string,
  duration: number
): Promise<void> {
  const currentUsage =
    Number(await redisClient.getKey(`usage:${clientId}`)) || 0;
  await redisClient.setKey(
    `usage:${clientId}`,
    String(currentUsage + duration)
  );
}

export async function getUsage(clientId: string): Promise<number> {
  return Number(await redisClient.getKey(`usage:${clientId}`)) || 0;
}

export async function checkUsageLimit(clientId: string): Promise<boolean> {
  return (await getUsage(clientId)) >= MAX_USAGE_MS;
}
