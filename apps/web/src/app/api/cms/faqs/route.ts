export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const faqs = await db.faqItem.findMany({
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' }
      ],
    });
    return NextResponse.json(faqs);
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
    const faq = await db.faqItem.create({
      data: {
        ...data,
        sortOrder: Number(data.sortOrder || 0),
      },
    });
    return NextResponse.json(faq);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}