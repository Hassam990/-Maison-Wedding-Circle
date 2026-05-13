export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const staff = await db.user.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "STAFF_ADMIN", "ADMIN"] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Transform to match frontend expectations if needed
    const transformedStaff = staff.map(member => ({
      ...member,
      permissions: member.role === "SUPER_ADMIN" ? ["All"] : ["Limited"],
      active: true,
      lastLogin: "Recent"
    }));

    return NextResponse.json(transformedStaff);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, email, password, role } = await req.json();
    
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const bcrypt = await import("bcrypt");
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || "STAFF_ADMIN",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Staff creation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}