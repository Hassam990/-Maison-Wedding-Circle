export const dynamic = 'force-dynamic';
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function VendorBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "VENDOR") {
    if (session.user.role === "COUPLE") {
      redirect("/dashboard/couple");
    }

    redirect("/");
  }

  const vendorProfile = await db.vendorProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  // Get inquiries for this vendor
  const bookings = vendorProfile
    ? await db.vendorInquiry.findMany({
        where: {
          vendorId: vendorProfile.id,
        },
        include: {
          couple: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Your Inquiries
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Manage incoming inquiries
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600">
            View all the couples that have reached out to you and respond to them.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/vendor">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Your Inquiries</CardTitle>
            <CardDescription>
              All couples that have contacted you.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
              No inquiries yet. Keep your profile updated to get more bookings!
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-neutral-200 p-4 hover:border-primary transition-colors cursor-pointer"
                onClick={() => window.location.href = `/dashboard/messages/${booking.id}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-burgundy to-[#5a122a] flex items-center justify-center text-white text-xl font-bold">
                      {(booking.couple.user?.name?.split(' ')[0] || "C")[0]}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {booking.couple.user?.name || "Anonymous Couple"}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {booking.couple.user?.email || ""}
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-700">
                        {booking.message}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        Received on {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}
