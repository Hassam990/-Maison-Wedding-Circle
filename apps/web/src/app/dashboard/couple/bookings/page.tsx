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

export default async function CoupleBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "COUPLE") {
    if (session.user.role === "VENDOR") {
      redirect("/dashboard/vendor");
    }

    redirect("/");
  }

  const coupleProfile = await db.coupleProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  // Get inquiries (treat them as bookings)
  const bookings = coupleProfile
    ? await db.vendorInquiry.findMany({
        where: {
          coupleId: coupleProfile.id,
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              category: true,
              city: true,
              verified: true,
              logoUrl: true,
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
            Your Bookings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Manage your vendor inquiries & bookings
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600">
            Keep track of all your inquiries, see which vendors you've contacted,
            and manage your bookings in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/couple">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <form action="/vendors">
            <Button type="submit">Find Vendors</Button>
          </form>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Your Inquiries & Bookings</CardTitle>
            <CardDescription>
              All the vendors you've contacted so far.
            </CardDescription>
          </div>
          <Link
            href="/vendors"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            Add new
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
              No bookings or inquiries yet. Start exploring vendors to find the perfect match for your event!
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
                    {booking.vendor.logoUrl ? (
                      <img
                        src={booking.vendor.logoUrl}
                        alt={booking.vendor.businessName || "Vendor"}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9940A] to-[#8a6200] flex items-center justify-center text-white text-xl font-bold">
                        {(booking.vendor.businessName || "V")[0]}
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {booking.vendor.businessName}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {[booking.vendor.category, booking.vendor.city].filter(Boolean).join(" • ")}
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-700">
                        {booking.message}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        Sent on {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.vendor.verified
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {booking.vendor.verified ? "Verified" : "Verification pending"}
                    </span>
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
