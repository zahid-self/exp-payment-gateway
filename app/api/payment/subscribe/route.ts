import { createCheckout, getVariant, listVariants } from "@lemonsqueezy/lemonsqueezy.js";
import { NextResponse } from "next/server";
import { configureLemonSqueezy } from "~/config/lemonsqueezy";
import { prisma } from "~/prisma/db";

export type CreateCheckoutResponse = {
  checkoutURL: string
};

export async function POST(request:Request) {
  try {
    const {email, variantId} = await request.json();
    let apiCredit = 0;
    if(variantId === "464431"){
      apiCredit = 10000
    }else if(variantId === "464432"){
      apiCredit = 20000
    }else {
      apiCredit = 30000
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      select: {id: true, email: true}
    });

    if (!user) return NextResponse.json({ message: "Your account was not found" }, { status: 404 });

    configureLemonSqueezy();
    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      variantId,
      {
        checkoutOptions: {
          embed: false,
          media: false,
          logo: true,
        },
        checkoutData: {
          email: user.email,
          custom: {
            user_id: user.id,
            api_credit: String(apiCredit),
          },
        },
        productOptions: {
          enabledVariants: [parseInt(variantId)],
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
          receiptButtonText: 'Go to Dashboard',
          receiptThankYouNote: 'Thank you for signing up!',
        },
      }
    )
    console.log(checkout);
    return NextResponse.json({ checkoutURL: checkout.data?.data.attributes.url }, { status: 201 });
  } catch (err) {
   if(err instanceof Error){
     return NextResponse.json({ message: err?.message || err }, { status: 500 });
   }
  }
}