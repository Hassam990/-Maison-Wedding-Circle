export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const inquiry = await db.inquiry.create({
      data: {
        vendorId: params.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
      },
    });
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Inquiry error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
