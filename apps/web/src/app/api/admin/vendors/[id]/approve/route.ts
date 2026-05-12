export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const vendor = await db.vendorProfile.update({
      where: { id: params.id },
      data: { verified: true },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error approving vendor:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
