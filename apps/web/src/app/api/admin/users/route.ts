export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/users (Focusing on Staff/Admins)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await db.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN", "STAFF_ADMIN"] }
      },
      select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          image: true
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// POST /api/admin/users (Create Staff)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, email, password, role } = body;
        
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) return NextResponse.json({ message: "Email taken" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: role || "STAFF_ADMIN"
            }
        });

        const { passwordHash: _, ...userWithoutPassword } = user as any;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({ message: "Error creating staff" }, { status: 500 });
    }
}