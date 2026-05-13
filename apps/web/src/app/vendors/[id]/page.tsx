
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  if (!params.id) notFound();

  let vendor;
  try {
    vendor = await db.vendorProfile.findUnique({
      where: { id: params.id },
    });
  } catch (e: any) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-xl font-bold">Database Connection Error</h1>
        <p className="text-stone-500">{e.message}</p>
        <Link href="/vendors" className="text-primary underline">Back to Directory</Link>
      </div>
    );
  }

  if (!vendor) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Link href="/vendors" className="text-sm text-stone-500 underline mb-8 block">← Back to Directory</Link>
      <h1 className="text-4xl font-serif mb-4">{vendor.businessName}</h1>
      <div className="flex gap-2 mb-8">
        <span className="bg-stone-100 px-3 py-1 rounded-full text-xs">{vendor.category}</span>
        <span className="bg-stone-100 px-3 py-1 rounded-full text-xs">{vendor.city}</span>
      </div>
      <p className="text-lg text-stone-600 leading-relaxed">
        {vendor.bio || "No bio available."}
      </p>
      <hr className="my-12 border-stone-200" />
      <div className="bg-stone-50 p-8 rounded-3xl">
        <h2 className="text-xl font-medium mb-2">Request Consultation</h2>
        <p className="text-stone-600 mb-4">Inquiry system is currently being optimized for this profile.</p>
      </div>
    </div>
  );
}