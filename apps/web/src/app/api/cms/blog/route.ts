export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
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
    const post = await db.blogPost.create({
      data: {
        ...data,
        authorId: session.user.id,
        isPublished: Boolean(data.isPublished),
        publishedAt: data.isPublished ? new Date() : null,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog Post Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}