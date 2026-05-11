"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "lucide-react";

interface Vendor {
  id: string;
  businessName: string | null;
  category: string | null;
  city: string | null;
  bio: string | null;
  verified: boolean;
  plan: string;
  rating: number | null;
}

export default function VendorGrid({ vendors }: { vendors: Vendor[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {vendors.map((v, i) => (
        <Link 
          key={v.id} 
          href={`/vendors/${v.id}`}
          className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-stone-100"
        >
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={`https://images.unsplash.com/photo-${[
                "1519741497674-611481863552",
                "1511795409834-ef04bbd61622",
                "1464366400600-7168b8af9bc3",
                "1520854221256-17451cc331bf",
                "1523438885200-e635ba2c371e",
                "1519225421980-715cb0215aed"
              ][i % 6]}?auto=format&fit=crop&q=80`}
              alt={v.businessName || "Vendor"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {v.verified && (
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                VERIFIED
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-primary tracking-wider uppercase">{v.category || "Professional"}</p>
                <div className="flex text-amber-400 text-xs">
                    {"★".repeat(Math.round(v.rating || 5))}
                </div>
            </div>
            <h3 className="text-xl font-bold text-burgundy group-hover:text-primary transition-colors">{v.businessName || "Untitled Vendor"}</h3>
            <div className="flex items-center gap-2 text-stone-500 text-sm">
                <span>📍</span>
                <span>{v.city || "USA"}</span>
            </div>
            <p className="text-sm text-stone-600 line-clamp-2 pt-2 leading-relaxed italic">
              {v.bio || "Luxury South Asian wedding services tailored to your unique vision and tradition."}
            </p>
            
            <div className="pt-4 flex items-center justify-between border-t border-stone-50 mt-4">
                <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">{v.plan} Network</span>
                <span className="text-primary font-bold text-sm flex items-center gap-1">
                    View Profile <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
