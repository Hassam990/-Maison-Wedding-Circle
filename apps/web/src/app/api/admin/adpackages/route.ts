import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/adpackages
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const packages = await db.adPackage.findMany({
      include: {
        _count: {
          select: { boosts: true, waitlist: true }
        }
      },
      orderBy: { price: "asc" }
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// POST /api/admin/adpackages
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const pkg = await db.adPackage.create({
      data: {
        name: body.name,
        description: body.description,
        boostType: body.boostType,
        placement: body.placement,
        durationDays: parseInt(body.durationDays),
        price: parseFloat(body.price),
        maxSlots: parseInt(body.maxSlots || "3"),
        isActive: body.isActive !== undefined ? body.isActive : true,
      }
    });
    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json({ message: "Error Creating Package" }, { status: 500 });
  }
}
