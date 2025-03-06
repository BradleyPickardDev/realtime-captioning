import Redis from "ioredis";

class RedisClient {
  private static instance: RedisClient;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME as string,
      password: process.env.REDIS_PASSWORD as string,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on("connect", () => console.log("Connected to Redis"));
    this.client.on("error", (err) => console.error("Redis Error:", err));
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  //Set a key-value pair
  public async setKey(
    key: string,
    value: string,
    expirySeconds?: number
  ): Promise<void> {
    try {
      if (expirySeconds) {
        await this.client.set(key, value, "EX", expirySeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Redis SET Error: ${error}`);
    }
  }

  // Get a value by key
  public async getKey(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Redis GET Error: ${error}`);
      return null;
    }
  }

  // Increment a value
  public async incrementKey(key: string, amount: number = 1): Promise<number> {
    try {
      return await this.client.incrby(key, amount);
    } catch (error) {
      console.error(`Redis INCR Error: ${error}`);
      return 0;
    }
  }

  // Delete a key
  public async deleteKey(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Redis DEL Error: ${error}`);
    }
  }
}

// Export an instance instead of the class itself
export default RedisClient.getInstance();
