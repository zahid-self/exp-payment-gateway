import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "~/prisma/db";
import crypto from "node:crypto"
import { User } from "@prisma/client";

export type SignUpResponse = {
  user: {
    id: string;
    email: string;
  };
  message: string;
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const prevUser = await prisma.user.findUnique({
      where: { email },
    });

    if (prevUser) return NextResponse.json({ message: "Email already in use" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, apiKey: crypto.randomUUID(), apiCredit: 500 },
      select: { id: true, email: true },
    });

    return NextResponse.json({
      user,
      message: "Your account has been created!",
    } satisfies SignUpResponse);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
}