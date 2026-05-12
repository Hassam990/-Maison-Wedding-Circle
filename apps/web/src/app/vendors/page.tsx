import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { db } from "@/lib/db";
import VendorGrid from "./VendorGrid";

type VendorDirectoryPageProps = {
  searchParams?: {
    search?: string | string[];
    category?: string | string[];
    city?: string | string[];
  };
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function VendorsPage({ searchParams }: VendorDirectoryPageProps) {
  const search = getValue(searchParams?.search).trim();
  const category = getValue(searchParams?.category).trim();
  const city = getValue(searchParams?.city).trim();

  const filters: any[] = [];

  if (category) {
    filters.push({
      category: {
        contains: category,
        mode: 'insensitive',
      },
    });
  }

  if (city) {
    filters.push({
      city: {
        contains: city,
        mode: 'insensitive',
      },
    });
  }

  if (search) {
    filters.push({
      OR: [
        {
          businessName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          category: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          city: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          bio: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    });
  }

  const vendors = await db.vendorProfile.findMany({
    where: filters.length > 0 ? { AND: filters } : undefined,
    orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      businessName: true,
      category: true,
      city: true,
      bio: true,
      verified: true,
      plan: true,
      rating: true,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Curated Network</p>
        <h1 className="font-serif text-4xl text-stone-900">Curated wedding professionals</h1>
        <p className="max-w-3xl text-stone-600">
          Explore our curated network of premium vendors, trusted by Maison Wedding Circle for your exclusive celebration.
        </p>
      </div>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle>Filter vendors</CardTitle>
          <CardDescription>
            Search by business name, category, city, or keywords from vendor bios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4" method="GET">
            <Input name="search" defaultValue={search} placeholder="Search vendors" />
            <Input name="category" defaultValue={category} placeholder="Category" />
            <Input name="city" defaultValue={city} placeholder="City" />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Apply filters
              </Button>
              <Link
                href="/vendors"
                className="inline-flex items-center justify-center rounded-2xl border border-stone-200 px-4 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Reset
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-stone-600">
        <p>
          Showing <span className="font-medium text-stone-900">{vendors.length}</span> vendor
          {vendors.length === 1 ? "" : "s"}
        </p>
        <p>Verified vendors are displayed first.</p>
      </div>

      {vendors.length === 0 ? (
        <Card className="border-stone-200">
          <CardContent className="px-6 py-16 text-center text-sm text-stone-600">
            No vendors matched your filters. Try broadening your search or clearing one of the
            fields above.
          </CardContent>
        </Card>
      ) : (
        <VendorGrid vendors={vendors} />
      )}
    </div>
  );
}