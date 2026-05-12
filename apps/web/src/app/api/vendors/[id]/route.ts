export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await db.vendorProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    if (!vendor) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json(vendor);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
