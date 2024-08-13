import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { prisma } from "~/prisma/db";
import {getSubscription} from "@lemonsqueezy/lemonsqueezy.js"
import { configureLemonSqueezy } from "~/config/lemonsqueezy";


export async function POST(request:Request) {
  try {
    const crypto = typeof window === "undefined" ? require("crypto"): null;
    if(!crypto){
      throw new Error("crypto is required");
    }

    //catch the event type
    const clonedReq = request.clone();
    const eventType = request.headers.get("X-Event-Name");
    const body = await request.json();

    // check signature 
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if(!secret){
      throw new Error("Webhook signature secret is not defined.");
    }
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(await clonedReq.text()).digest("hex"), "utf-8");
    const signature = Buffer.from(request.headers.get("X-Signature") || "", "utf8");

    if(!crypto.timingSafeEqual(digest,signature)){
      throw new Error("Invalid signature.");
    }

    configureLemonSqueezy()

    const userId = body.meta.custom_data.user_id;
    const subscription = await getSubscription(body.data.id) as any;
    if (!subscription || !subscription.data) {
      console.error("Subscription or subscription data is null");
      return;
    }
    
    switch (eventType) {
      case "subscription_created": {
        const user = await prisma.user.findUnique({
          where: {id: userId}
        })
        if(!user){
          break;
        }

        await prisma.subscription.create({
          data: {
            userId: userId,
            planId: String(body.data.attributes.product_id),
            status: body.data.attributes.status,
            subscriptionId: `${subscription.data.id}`,
            customerId: `${body.data.attributes.customer_id}`,
            variantId: subscription.data.attributes.variant_id,
            currentPeriodEnd: subscription.data.attributes.renews_at,
            renewsAt: subscription.data.attributes.renews_at,
          }
        });

        await prisma.user.update({
          where: {id: userId},
          data: {
            apiCredit: user?.apiCredit + parseInt(body.meta.custom_data.api_credit)
          }
        });
      }
      case "subscription_updated": {

        const subscriptionFromDb = await prisma.subscription.findUnique({
          where: {subscriptionId: String(subscription.data.id)}
        })

        if (!subscriptionFromDb || !subscriptionFromDb.subscriptionId) return;

        await prisma.subscription.update({
          where: { subscriptionId: subscriptionFromDb.subscriptionId },
          data: {
            variantId: subscription.data.attributes.variant_id,
            renewsAt: subscription.data.attributes.renews_at,
          },
        });
      }
      case "subscription_cancelled":{
        const subscriptionFromDb = await prisma.subscription.findUnique({
          where: {subscriptionId: subscription.data.id}
        })

        if (!subscriptionFromDb || !subscriptionFromDb.subscriptionId) return;

        await prisma.subscription.update({
          where: { subscriptionId: subscriptionFromDb.subscriptionId },
          data: {
            variantId: subscription.data.attributes.variant_id,
            currentPeriodEnd: subscription.data.attributes.ends_at,
            renewsAt: subscription.data.attributes.renews_at,
          },
        });
        break;
      }
    }
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.log(error)
  }
}