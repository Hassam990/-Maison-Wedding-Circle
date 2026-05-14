export const dynamic = 'force-dynamic';
import bcryptjs from "bcryptjs";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type Role = "GUEST" | "COUPLE" | "VENDOR" | "ADMIN";

const PUBLIC_REGISTRATION_ROLES = new Set(["COUPLE", "VENDOR"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;

class RegistrationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "RegistrationError";
    this.status = status;
  }
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getPasswordValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const name = getStringValue(body.name);
    const email = getStringValue(body.email).toLowerCase();
    const password = getPasswordValue(body.password);
    const rawRole = getStringValue(body.role).toUpperCase();

    if (!name || !email || !password || !rawRole) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (name.length < MIN_NAME_LENGTH) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (!PUBLIC_REGISTRATION_ROLES.has(rawRole)) {
      return NextResponse.json(
        { message: "Public registration is only available for couples and vendors" },
        { status: 400 }
      );
    }

    const role = rawRole as Role;
    const passwordHash = await bcryptjs.hash(password, 10);

    const user = await db.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser) {
        throw new RegistrationError("An account with this email already exists", 409);
      }

      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (role === "VENDOR") {
        await tx.vendorProfile.create({
          data: {
            userId: createdUser.id,
          },
        });
      }

      if (role === "COUPLE") {
        await tx.coupleProfile.create({
          data: {
            userId: createdUser.id,
          },
        });
      }

      return createdUser;
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof RegistrationError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Unable to create account right now. Please try again." },
      { status: 500 }
    );
  }
}