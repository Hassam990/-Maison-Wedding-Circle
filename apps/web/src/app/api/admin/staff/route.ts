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
