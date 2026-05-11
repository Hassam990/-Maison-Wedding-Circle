"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Heart, 
  Search, 
  Calendar, 
  Mail, 
  RefreshCcw,
  User
} from "lucide-react";
import { toast } from "sonner";
import ChromaGrid from "@/components/ui/ChromaGrid";

interface Couple {
  id: string;
  eventType: string | null;
  eventDate: string | null;
  city: string | null;
  budget: number | null;
  user: {
    name: string | null;
    email: string | null;
  };
  consultations: { status: string }[];
}

export default function AdminCouplesPage() {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCouples();
  }, []);

  const fetchCouples = async () => {
    try {
      const res = await fetch("/api/admin/couples");
      if (res.ok) {
        const data = await res.json();
        setCouples(data);
      }
    } catch (error) {
       toast.error("Could not load couples");
    } finally {
      setLoading(false);
    }
  };

  const filtered = couples.filter(c => 
    c.user.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center py-20">
         <RefreshCcw className="w-10 h-10 text-[#C9940A] animate-spin mb-4" />
         <p className="text-[#8a6200] font-medium">Loading Couples List...</p>
       </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Wedding Couples</h1>
          <p className="text-[#8a6200]">Monitor wedding planning progress and consultation requests.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dbb84a]" />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2 border border-[#dbb84a] rounded-full text-sm bg-white focus:ring-2 focus:ring-[#C9940A] outline-none min-w-[300px]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>
      </div>

      <div className="relative min-h-[600px] w-full">
        {filtered.length > 0 ? (
          <ChromaGrid 
            items={filtered.map((couple) => ({
              id: couple.id,
              image: `https://i.pravatar.cc/300?u=${couple.id}`,
              title: couple.user.name || "Newly Registered",
              subtitle: couple.eventType || "Unspecified Event",
              handle: couple.user.email || "",
              location: couple.city || "Online Member",
              borderColor: "#C9940A",
              gradient: "linear-gradient(145deg, #FFFDF5, #FFF)"
            }))}
            radius={300}
            columns={3}
          />
        ) : (
          <div className="py-20 text-center bg-[#fffcf0] border-2 border-dashed border-[#dbb84a] rounded-[48px]">
             <Heart className="w-12 h-12 text-[#dbb84a] mx-auto mb-4" />
             <p className="text-[#8a6200] font-medium">No couples found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
