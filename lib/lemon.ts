import { LemonsqueezyClient } from "lemonsqueezy.ts";

const apiKey = process.env.LEMONSQUEEZY_API_KEY;

if (!apiKey) {
  throw new Error("LEMONSQUEEZY_API_KEY is not set in the environment variables.");
}

export const client = new LemonsqueezyClient(apiKey);