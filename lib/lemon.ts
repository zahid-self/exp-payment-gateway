import { LemonsqueezyClient } from "lemonsqueezy.ts";

class LemonSqueezyClientSingleton {
  private static instance: LemonsqueezyClient | null = null;

  private constructor() {}

  public static getInstance(): LemonsqueezyClient {
    if (!LemonSqueezyClientSingleton.instance) {
      const apiKey = process.env.LEMONSQUEEZY_API_KEY;
      if (!apiKey) {
        throw new Error("LEMONSQUEEZY_API_KEY is not set in the environment variables.");
      }
      LemonSqueezyClientSingleton.instance = new LemonsqueezyClient(apiKey);
    }
    return LemonSqueezyClientSingleton.instance;
  }
}

export const client = LemonSqueezyClientSingleton.getInstance();