"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Heart, 
  Search, 
  Calendar, 
  Mail, 
  RefreshCcw,
  User,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
         <RefreshCcw className="w-10 h-10 text-primary animate-spin mb-4" />
         <p className="text-stone-600 font-medium">Loading Couples List...</p>
       </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-burgundy">Wedding Couples</h1>
          <p className="text-stone-600">Monitor wedding planning progress and consultation requests.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2 border border-stone-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-primary outline-none min-w-[300px]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((couple) => (
            <Card key={couple.id} className="group border-stone-200 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-32 bg-stone-100 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                   <div className="relative w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-primary font-bold text-xl">
                      {couple.user.name?.[0] || <User className="w-8 h-8" />}
                   </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 text-lg">{couple.user.name || "Newly Registered"}</h3>
                    <p className="text-sm text-stone-500 flex items-center gap-2">
                       <Mail className="w-3 h-3" /> {couple.user.email}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Event</p>
                       <p className="text-sm font-medium text-stone-700">{couple.eventType || "Unspecified"}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Location</p>
                       <p className="text-sm font-medium text-stone-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {couple.city || "Online"}
                       </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                     <span className="text-xs text-stone-400">{couple.consultations.length} Consultations</span>
                     <button className="text-primary text-sm font-bold hover:underline">Details Ã¢â€ â€™</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-stone-50 border-2 border-dashed border-stone-200 rounded-[48px]">
           <Heart className="w-12 h-12 text-stone-200 mx-auto mb-4" />
           <p className="text-stone-500 font-medium">No couples found matching your search.</p>
        </div>
      )}
    </div>
  );
}
