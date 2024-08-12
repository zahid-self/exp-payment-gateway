import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { NextResponse } from "next/server";
import { client } from "~/lib/lemon";
import { prisma } from "~/prisma/db";

export type CreateCheckoutResponse = {
  checkoutURL: string
};

export async function POST(request:Request) {
  try {
    const {email, productId, userId} = await request.json();
    let apiCredit = 0;
    if(productId === "319427"){
      apiCredit = 10000
    }else if(productId === "319428"){
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

    const variants = (await client.listAllVariants({productId: productId})).data;
    const variant = variants.filter((prod) => prod.attributes.product_id === parseInt(productId))[0];

    console.log({variants});
    console.log({variant});
    console.log(process.env.LEMONSQUEEZY_API_KEY);

    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      variant.id,
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
          enabledVariants: [parseInt(variant.id)],
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