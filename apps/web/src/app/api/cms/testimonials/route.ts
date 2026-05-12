export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(testimonials);
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
    const data = await req.json();
    const testimonial = await db.testimonial.create({
      data: {
        ...data,
        rating: Number(data.rating),
        sortOrder: Number(data.sortOrder || 0),
      },
    });
    return NextResponse.json(testimonial);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}