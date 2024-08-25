import { Buffer } from 'buffer';
import { NextResponse } from 'next/server';
import { getSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import crypto from 'node:crypto';
import { configureLemonSqueezy } from '~/config/lemonsqueezy';
import { prisma } from "~/prisma/db";

export async function POST(request: Request) {
  try {
    configureLemonSqueezy();
    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      return new Response('Lemon Squeezy Webhook Secret not set in .env', {
        status: 500,
      });
    }

    // First, make sure the request is from Lemon Squeezy.
    const rawBody = await request.text();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(
      request.headers.get('X-Signature') ?? '',
      'utf8',
    );

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response('Invalid signature', { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const userId = body.meta.custom_data.user_id;
    const eventype = body.meta.event_name;
    let subscribedId = null;
    if (eventype === 'subscription_payment_success') {
      subscribedId = body.data.attributes.subscription_id;
    } else {
      subscribedId = body.data.id;
    }
    const subscription = await getSubscription(subscribedId);
    if (subscription.error) {
      throw new Error(subscription.error.message);
    }

    console.log(body.data, 'body attributes');


    const subscriptionFromDb = await prisma.subscription.findUnique({
      where: { subscriptionId: String(subscribedId) },
    });

    console.log(eventype);

    switch (eventype) {
      case 'subscription_created':
        {
          const user = await prisma.user.findUnique({
            where: { id: userId },
          });
          if (!user) {
            return NextResponse.json(
              { message: 'User not found' },
              { status: 404 },
            );
          }
          try {
            await prisma.subscription.create({
              data: {
                userId: userId,
                planId: String(body.data.attributes.product_id),
                status: body.data.attributes.status,
                userEmail: body.data.attributes.user_email,
                userName: body.data.attributes.user_name,
                statusFormatted: body.data.attributes.status_formatted,
                subscriptionId: `${subscription.data.data.id}`,
                customerId: `${body.data.attributes.customer_id}`,
                variantId: subscription.data.data.attributes.variant_id,
                currentPeriodEnd: subscription.data.data.attributes.renews_at,
                renewsAt: subscription.data.data.attributes.renews_at,
              },
            });

            await prisma.user.update({
              where: { id: userId },
              data: {
                apiCredit:
                  user?.apiCredit + parseInt(body.meta.custom_data.api_credit),
              },
            });
          } catch (error) {
            console.log(error);
          }
        }
        break;
      case 'subscription_payment_success':
        if (!subscriptionFromDb || !subscriptionFromDb.subscriptionId){
          return NextResponse.json(
            { message: 'Subscription not found' },
            { status: 404 },
          );
        };
        if (body.data.attributes.billing_reason === 'renewal' && body.data.attributes.status === "paid") {
          await prisma.$transaction([
            prisma.subscription.update({
              where: { subscriptionId: subscriptionFromDb.subscriptionId },
              data: {
                paymentStatus: body.data.attributes.status,
                billingReason: body.data.attributes.billing_reason,
              },
            }),
            prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                apiCredit: parseInt(body.meta.custom_data.api_credit),
              },
            }),
          ]);
          break;
        }
        await prisma.subscription.update({
          where: { subscriptionId: subscriptionFromDb.subscriptionId },
          data: {
            paymentStatus: body.data.attributes.status,
            billingReason: body.data.attributes.billing_reason,
          },
        });
        break;
      case 'subscription_payment_failed':
        if (!subscriptionFromDb || !subscriptionFromDb.subscriptionId){
          return NextResponse.json(
            { message: 'Subscription not found' },
            { status: 404 },
          );
        };

        await prisma.subscription.update({
          where: { subscriptionId: subscriptionFromDb.subscriptionId },
          data: {
            paymentStatus: body.data.attributes.status,
            billingReason: body.data.attributes.billing_reason,
          },
        });
        break;
      case 'subscription_updated':
        if (!subscriptionFromDb || !subscriptionFromDb.subscriptionId){
          return NextResponse.json(
            { message: 'Subscription not found' },
            { status: 404 },
          );
        };

        await prisma.subscription.update({
          where: { subscriptionId: subscriptionFromDb.subscriptionId },
          data: {
            variantId: subscription.data.data.attributes.variant_id,
            renewsAt: subscription.data.data.attributes.renews_at,
          },
        });
        break;
      case 'subscription_cancelled':
        if (!subscriptionFromDb || !subscriptionFromDb.subscriptionId){
          return NextResponse.json(
            { message: 'Subscription not found' },
            { status: 404 },
          );
        };
        await prisma.subscription.update({
          where: { subscriptionId: subscriptionFromDb.subscriptionId },
          data: {
            variantId: subscription.data.data.attributes.variant_id,
            currentPeriodEnd: subscription.data.data.attributes.ends_at,
            renewsAt: subscription.data.data.attributes.renews_at,
            statusFormatted: subscription.data.data.attributes.status_formatted,
          },
        });
        break;
      case 'subscription_expired': {
        if (!subscriptionFromDb || !subscriptionFromDb.subscriptionId) return;
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          break;
        }

        await prisma.subscription.update({
          where: { subscriptionId: subscriptionFromDb.subscriptionId },
          data: {
            status: body.data.attributes.status,
            statusFormatted: subscription.data.data.attributes.status_formatted,
            endsAt: subscription.data.data.attributes.ends_at,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            apiCredit: 0,
          },
        });
        break;
      }
      default:
        break;
    }
    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return NextResponse.json(
        { message: 'Error processing webhook' },
        { status: 500 },
      );
    }
  }
}
