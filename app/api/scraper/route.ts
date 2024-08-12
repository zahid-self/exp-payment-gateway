import { PrismaClient, User } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

function calculateAPICost(engine: string) {
  let initialCost = 1;

  if (engine === 'true') {
    initialCost = 10;
  }
  return initialCost;
}

const deductApiCreditFromDB = async (user: User | null, creditCount: number) => {
  console.log('deducting api credit', creditCount);
  return await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      usedCredit: {
        increment: creditCount
      },
    },
  });
}

const reversApiCreditTorDB = async (user: User | null, creditCount: number) => {
  console.log('reverting api credit', creditCount);
  return await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      usedCredit: {
        decrement: creditCount
      },
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const apiKey = searchParams.get('apiKey');
  const engine = searchParams.get('engine');

  let user: User | null = await prisma.user.findFirst({
    where: { apiKey: apiKey },
  });

  console.log({searchParams})

  if (!user) {
    return NextResponse.json(
      { message: 'User not found.' },
      { status: 404 }
    );
  }

  const apiCost = calculateAPICost(engine as string);
  // Deduct API credits from the system
  user = await deductApiCreditFromDB(user, apiCost);
  const remainingCredits = user?.apiCredit - user?.usedCredit;

  if (remainingCredits < 0) {
    // If the balance is negative, revert action, refund credits, throw an error
    await reversApiCreditTorDB(user, apiCost);
    return NextResponse.json(
      { message: 'Insufficient credits to make the request.' },
      { status: 402 }
    );
  }

  try {
    // Request scraper engine
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1');
    const posts = await response.json();
    console.log({posts})
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    await reversApiCreditTorDB(user, apiCost);
    return NextResponse.json(
      { error: 'An error occurred while fetching users.' },
      { status: 500 }
    );
  }
}