import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Heart,
  CalendarCheck,
  Megaphone,
  LayoutTemplate,
  Star,
  MessageSquare,
  Shield,
  BarChart,
  LogOut,
} from "lucide-react";
import { Toaster } from "sonner";

import { authOptions } from "@/lib/auth";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vendors", label: "Vendors", icon: Users },
  { href: "/admin/couples", label: "Couples", icon: Heart },
  { href: "/admin/consultations", label: "Consultations", icon: CalendarCheck },
  { href: "/admin/boosts", label: "Advertising & Boosts", icon: Megaphone },
  { href: "/admin/content", label: "Content Manager (CMS)", icon: LayoutTemplate },
  { href: "/admin/reviews", label: "Reviews Manager", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/staff", label: "Staff Management", icon: Shield },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Need to ensure role is SUPER_ADMIN or STAFF_ADMIN
  // Assuming the DB has SUPER_ADMIN or STAFF_ADMIN per new requirements
  // Previously we used "ADMIN", keeping it backwards-compatible for now if SUPER_ADMIN isn't set
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN" && session.user.role !== "STAFF_ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDF5] font-inter">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#3D0C1A] text-[#FFFDF5] flex flex-col">
        <div className="p-6 border-b border-[#C9940A]/30">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#C9940A] flex items-center justify-center font-bold text-[#C9940A] text-xl font-playfair bg-[#3D0C1A]">
              M
            </div>
            <div>
              <h2 className="font-playfair font-bold tracking-wide text-lg text-white">Maison Circle</h2>
              <p className="text-xs text-[#d4a843] uppercase tracking-wider font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#fde9b2] hover:bg-[#5a1428] hover:text-white transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-[#C9940A] group-hover:text-white transition-colors" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#C9940A]/30">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#fde9b2] flex flex-shrink-0 items-center justify-center text-[#3D0C1A] font-bold">
              {session.user.name?.[0] || session.user.email?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{session.user.name || "Admin User"}</p>
              <p className="text-xs text-[#d4a843] truncate">{session.user.email}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-950/50 hover:text-red-200 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden max-h-screen">
        <div className="flex-1 overflow-y-auto">
          <Toaster position="top-right" richColors />
          <div className="p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
