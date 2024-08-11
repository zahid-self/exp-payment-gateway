import { NextResponse } from "next/server";
import { prisma } from "~/prisma/db";

export async function GET(request:Request) {
  try {
    const {userID} = await request.json();
     const user = await prisma.user.findUnique({
      where: {
        id: userID
      },
      select: {id: true, email: true}
    });
    if (!user) return NextResponse.json({ message: "Your account was not found" }, { status: 404 });

    return NextResponse.json({ message: "Subscription found", user }, { status: 404 });

  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json({ message: error?.message || error }, { status: 500 });
    }
  }
  
}