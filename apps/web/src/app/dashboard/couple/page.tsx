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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getCountdownLabel(eventDate: Date | null) {
  if (!eventDate) {
    return "Not set";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(eventDate);
  targetDate.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInDays = Math.ceil(
    (targetDate.getTime() - today.getTime()) / millisecondsPerDay
  );

  if (differenceInDays < 0) {
    return "Date passed";
  }

  if (differenceInDays === 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "1 day to go";
  }

  return `${differenceInDays} days to go`;
}

export default async function CoupleDashboardPage() {
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
      eventDate: true,
      eventType: true,
      city: true,
      budget: true,
      style: true,
      guestCount: true,
    },
  });

  if (!coupleProfile) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Welcome to your planning dashboard</CardTitle>
            <CardDescription>
              We could not find your planning profile yet. Start your wedding
              plan to unlock tasks, saved vendors, and inquiry tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <form action="/dashboard/couple/plan">
              <Button type="submit">Start planning</Button>
            </form>
            <form action="/vendors">
              <Button type="submit" variant="outline">
                Explore Curated Vendors
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [
    totalTasks,
    completedTasks,
    savedVendorsCount,
    planningTasks,
    savedVendors,
    recentInquiries,
  ] = await Promise.all([
    db.planningTask.count({
      where: {
        coupleId: coupleProfile.id,
      },
    }),
    db.planningTask.count({
      where: {
        coupleId: coupleProfile.id,
        completed: true,
      },
    }),
    db.savedVendor.count({
      where: {
        coupleId: coupleProfile.id,
      },
    }),
    db.planningTask.findMany({
      where: {
        coupleId: coupleProfile.id,
      },
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
      take: 8,
    }),
    db.savedVendor.findMany({
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
            plan: true,
            rating: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
    db.vendorInquiry.findMany({
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Couple Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Plan your celebration with confidence
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600">
            Keep track of your timeline, revisit the vendors you love, and stay
            on top of every inquiry from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <form action="/dashboard/couple/plan">
            <Button type="submit">Update plan</Button>
          </form>
          <form action="/vendors">
            <Button type="submit" variant="outline">
              Explore Curated Vendors
            </Button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="space-y-1 pb-3">
            <CardDescription>Event countdown</CardDescription>
            <CardTitle className="text-2xl">
              {getCountdownLabel(coupleProfile.eventDate)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600">
            {coupleProfile.eventDate
              ? `Target date: ${formatDate(coupleProfile.eventDate)}`
              : "Set your date in the planning wizard to build your timeline."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-3">
            <CardDescription>Planning progress</CardDescription>
            <CardTitle className="text-2xl">
              {completionPercentage}% complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-900 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-neutral-600">
              {completedTasks} of {totalTasks} tasks finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-3">
            <CardDescription>Estimated budget</CardDescription>
            <CardTitle className="text-2xl">
              {typeof coupleProfile.budget === "number"
                ? currencyFormatter.format(coupleProfile.budget)
                : "Not set"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600">
            {coupleProfile.city || coupleProfile.eventType || coupleProfile.style
              ? [
                  coupleProfile.eventType,
                  coupleProfile.city,
                  coupleProfile.style,
                ]
                  .filter(Boolean)
                  .join(" • ")
              : "Add your style, city, and event type to refine recommendations."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1 pb-3">
            <CardDescription>Saved vendors</CardDescription>
            <CardTitle className="text-2xl">{savedVendorsCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-neutral-600">
            {savedVendorsCount > 0
              ? "Your shortlist is ready for follow-ups and comparisons."
              : "Start saving vendors you love to build your shortlist."}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Saved vendors</CardTitle>
              <CardDescription>
                Vendors you have shortlisted for your event.
              </CardDescription>
            </div>
            <Link
              href="/vendors"
              className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
            >
              Explore more
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedVendors.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
                No saved vendors yet. Explore the marketplace and save the ones
                that fit your vision.
              </div>
            ) : (
              savedVendors.map((savedVendor) => (
                <div
                  key={savedVendor.id}
                  className="rounded-2xl border border-neutral-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <Link
                        href={`/vendors/${savedVendor.vendor.id}`}
                        className="text-lg font-semibold text-neutral-900 underline-offset-4 hover:underline"
                      >
                        {savedVendor.vendor.businessName}
                      </Link>
                      <p className="text-sm text-neutral-600">
                        {[savedVendor.vendor.category, savedVendor.vendor.city]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                      {savedVendor.vendor.bio ? (
                        <p className="line-clamp-2 text-sm leading-6 text-neutral-600">
                          {savedVendor.vendor.bio}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                        {savedVendor.vendor.plan || "Standard"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 ${
                          savedVendor.vendor.verified
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {savedVendor.vendor.verified
                          ? "Verified"
                          : "Verification pending"}
                      </span>
                      {typeof savedVendor.vendor.rating === "number" ? (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                          {savedVendor.vendor.rating.toFixed(1)} rating
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Recent inquiries</CardTitle>
              <CardDescription>
                Your latest conversations with vendors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentInquiries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
                  No inquiries yet. Reach out to vendors when you are ready.
                </div>
              ) : (
                recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="rounded-2xl border border-neutral-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-neutral-900">
                          {inquiry.vendor.businessName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Sent {formatDate(inquiry.createdAt)}
                        </p>
                      </div>
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                      {inquiry.message}
                    </p>
                    {inquiry.eventDate ? (
                      <p className="mt-3 text-xs text-neutral-500">
                        Event date shared: {formatDate(inquiry.eventDate)}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Planning tasks</CardTitle>
                <CardDescription>
                  Stay on top of the milestones that matter most.
                </CardDescription>
              </div>
              <Link
                href="/dashboard/couple/plan"
                className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                Edit plan
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {planningTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-600">
                  No planning tasks yet. Use the planning wizard to generate
                  your checklist.
                </div>
              ) : (
                planningTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{task.title}</p>
                      <p className="text-xs text-neutral-500">
                        {task.category || "General"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {task.completed ? "Complete" : "Pending"}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}