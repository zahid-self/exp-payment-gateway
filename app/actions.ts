'use server';
import { cookies } from "next/headers";
import { prisma } from "~/prisma/db";
import {cancelSubscription, updateSubscription} from "@lemonsqueezy/lemonsqueezy.js"
import { configureLemonSqueezy } from "~/config/lemonsqueezy";
import axios from "axios";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"
import { stackServerApp } from "~/stack";

export async function getUserSubscriptions() {

  const stackUser = await stackServerApp.getUser({or: 'redirect'});
   if (!stackUser.primaryEmail) {
    return null
  }

  const userFromDb = await prisma.user.findUnique({where: {
    email: stackUser.primaryEmail
  }});

  const userId = userFromDb?.id


  const userSubscriptions = await prisma.subscription.findFirst({
    where: {userId, OR: [
      {status: 'active'},
      {status: 'cancelled'}
    ]}
  })
  return userSubscriptions;
}

export async function cancelSub(id: string){

  configureLemonSqueezy();

  const cancelledSub = await cancelSubscription(id);

  console.log(cancelledSub.data);

  if(cancelledSub.error){
    throw new Error(cancelledSub.error.message)
  }

  try {
    await prisma.subscription.update({
      where: {subscriptionId: id},
      data: {
        status: cancelledSub.data?.data.attributes.status,
      }
    })
    console.log('first')
  } catch (error) {
     throw new Error(`Failed to cancel Subscription #${id} in the database.`)
  }

  return cancelledSub;
}

export async function getAPICredit() {

  const user = await stackServerApp.getUser();

  if (!user?.primaryEmail) {
    return null
  }

  const apiCredit = await prisma.user.findUnique({
    where: {email : user.primaryEmail},
    select: {apiCredit : true, usedCredit : true}
  })

  return apiCredit;
}

let parsedData : any = null;

export async function parseData(){
  try {
    const response = await axios.get('/api/scraper?apiKey=test&engine=true');
    let parsedData = await response.data;
    return { success: true, data: parsedData}
  } catch (error) {
    if(error instanceof Error){
       return {success: false, error: error}
    }
  }
}

export async function getParsedData(){
  return parsedData;
}

export async function renewSubscription({subscriptionId,userId}: {subscriptionId : string,userId: string}){
  const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
  
  try {
    const user = await prisma.user.findUnique({
      where: {id: userId}
    });
    const subscription = getUserSubscriptions();

    if(!user || !subscription){
      return;
    }

    const response = await axios.patch(
      `https://api.lemonsqueezy.com/v1/subscription-items/${subscriptionId}`,
      {
        data: {
          type: "subscriptions",
          id: subscriptionId,
          attributes: {
            quantity: 1
          }
        }
      },
      {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`
        }
      }
    );

    console.log(response);

    await prisma.user.update({
      where: {id: userId},
      data: {
        apiCredit: user?.apiCredit + 500
      }
    });

    await prisma.subscription.update({
      where: {subscriptionId: subscriptionId},
      data: {
        renewsAt: response.data.data.attributes.renews_at
      }
    })
    return response.data;
  } catch (error) {
    console.error('Error updating subscription item:', error);
    throw error;
  }
}

export async function pauseUserSubscription(id: string){
  configureLemonSqueezy();

  const subscription = await getUserSubscriptions();

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`)
  }

  const returnedSub = await updateSubscription(id, {
    pause: {
      mode: 'void'
    }
  });

  try {
    await prisma.subscription.update({
      where: {subscriptionId: id},
      data: {
        status: returnedSub.data?.data.attributes.status,
        currentPeriodEnd: returnedSub.data?.data.attributes.ends_at
      }
    })
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`);
  }

  revalidatePath('/');
  return returnedSub;
}

export async function unPauseUserSubscription(id: string){
  configureLemonSqueezy();

  const subscription = await getUserSubscriptions();

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`)
  }

  const returnedSub = await updateSubscription(id, {
    pause: null
  });

  try {
    await prisma.subscription.update({
      where: {subscriptionId: id},
      data: {
        status: returnedSub.data?.data.attributes.status,
        currentPeriodEnd: returnedSub.data?.data.attributes.ends_at
      }
    })
  } catch (error) {
    throw new Error(`Failed to pause Subscription #${id} in the database.`);
  }

  revalidatePath('/');
  return returnedSub;
}

export async function insertUser({ email, password }: { email : string, password : string }) {
   try {

    const prevUser = await prisma.user.findUnique({
      where: { email },
    });

    if (prevUser) return;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, apiKey: crypto.randomUUID(), apiCredit: 500 },
      select: { id: true, email: true },
    });


    return user;
  } catch (err) {
    if (err instanceof Error) {
      return err.message
    }
  }
}

