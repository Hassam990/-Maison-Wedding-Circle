export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, eventType, location, budget } = body;

    if (!email || !name) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    // In a real app, we might create a lead or a guest user
    // For now, let's try to find if a user exists, or just log it
    console.log("New Consultation Request:", { name, email, eventType, location, budget });

    // Option: Create a 'GUEST' user and a 'Consultation' record if we have a coupleId
    // But since Consultation requires CoupleProfile which requires User, 
    // it's better to just acknowledge for now or create a placeholder.

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}