export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const vendor = await db.vendorProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
    
    if (!vendor) return new NextResponse("Not Found", { status: 404 });
    
    return NextResponse.json(vendor);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();
    const vendor = await db.vendorProfile.update({
      where: { id: params.id },
      data,
    });
    
    return NextResponse.json(vendor);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const vendor = await db.vendorProfile.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });
    
    if (vendor) {
      await db.user.delete({
        where: { id: vendor.userId }
      });
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
