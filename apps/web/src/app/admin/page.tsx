import { Card, CardContent } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { Users, Heart, CalendarCheck, CheckCircle, AlertTriangle } from "lucide-react";

export default async function AdminDashboardPage() {
  let stats = {
    totalVendors: 0,
    totalCouples: 0,
    pendingConsultations: 0,
    verifiedVendors: 0,
  };
  let error: string | null = null;
  
  try {
    const [
      totalVendors,
      totalCouples,
      pendingConsultations,
      verifiedVendors,
    ] = await Promise.all([
      db.vendorProfile.count(),
      db.coupleProfile.count(),
      db.consultation.count({ where: { status: "New" } }),
      db.vendorProfile.count({ where: { verified: true } }),
    ]);
    stats = { totalVendors, totalCouples, pendingConsultations, verifiedVendors };
  } catch (err: any) {
    error = err.message || "Could not connect to the database.";
  }

  const metricCards = [
    {
      label: "Total Vendors",
      value: stats.totalVendors,
      description: "Registered businesses",
      icon: Users,
    },
    {
      label: "Total Couples",
      value: stats.totalCouples,
      description: "Active planning accounts",
      icon: Heart,
    },
    {
      label: "Pending Consultations",
      value: stats.pendingConsultations,
      description: 'Marked as "New"',
      icon: CalendarCheck,
    },
    {
      label: "Verified Vendors",
      value: stats.verifiedVendors,
      description: "Approved profiles",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">
          Dashboard Overview
        </h1>
        <p className="text-[#8a6200] max-w-3xl">
          Welcome to the Maison Wedding Circle admin panel. View KPIs and manage the entire platform.
        </p>
      </div>

      {error && (
        <div className="bg-[#fff8e8] border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Database Connection Error</h3>
              <p className="text-sm text-red-700 mt-1">
                Unable to load platform data. Please ensure the Supabase database is active and reachable.
              </p>
              <p className="text-xs text-red-600 mt-2 font-mono">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="border border-[#dbb84a] bg-[#fffcf0] shadow-sm flex flex-col"
            >
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#5a3e00]">{card.label}</p>
                  <div className="p-2 bg-[#fef3d6] rounded-full">
                    <Icon className="w-4 h-4 text-[#C9940A]" />
                  </div>
                </div>
                <div className="mt-auto">
                  <p className="text-3xl font-bold text-[#3D0C1A]">{card.value}</p>
                  <p className="text-xs text-[#8a6200] mt-1">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-white border border-[#dbb84a] rounded-xl overflow-hidden shadow-sm shadow-[#fef3d6]/50">
        <div className="border-b border-[#dbb84a] px-6 py-5 bg-[#faf8f0]">
          <h2 className="text-lg font-playfair font-bold text-[#3D0C1A]">Recent Activity</h2>
          <p className="text-sm text-[#8a6200]">Data is currently unavailable.</p>
        </div>
        <div className="p-6">
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-[#fef3d6] flex items-center justify-center text-[#C9940A]">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <p className="text-[#5a3e00] font-medium">No recent activity detected.</p>
            <p className="text-sm text-[#8a6200] mt-1">Wait for couples and vendors to perform actions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}