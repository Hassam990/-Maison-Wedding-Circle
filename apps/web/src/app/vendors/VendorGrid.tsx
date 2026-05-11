"use client";

import ChromaGrid from "@/components/ui/ChromaGrid";

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
  const chromaItems = vendors.map((v, i) => ({
    id: v.id,
    image: `https://images.unsplash.com/photo-${[
        "1519741497674-611481863552",
        "1511795409834-ef04bbd61622",
        "1464366400600-7168b8af9bc3",
        "1520854221256-17451cc331bf",
        "1523438885200-e635ba2c371e",
        "1519225421980-715cb0215aed"
    ][i % 6]}?auto=format&fit=crop&q=80`,
    title: v.businessName || "Untitled Vendor",
    subtitle: v.category || "Professional Vendor",
    handle: v.verified ? "VERIFIED" : "",
    location: v.city || "Multiple Locations",
    url: `/vendors/${v.id}`,
    borderColor: v.verified ? "#C9940A" : "#3D0C1A",
    gradient: v.verified ? "linear-gradient(165deg, #FFFDF5, #FFF)" : "linear-gradient(135deg, #FFFFFF, #F5F5F5)"
  }));

  return (
    <div className="relative min-h-[600px] w-full">
      <ChromaGrid 
        items={chromaItems}
        radius={350}
        damping={0.4}
        fadeOut={0.5}
        columns={3}
      />
    </div>
  );
}
