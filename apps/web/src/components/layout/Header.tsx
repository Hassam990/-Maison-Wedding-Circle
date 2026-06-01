"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/for-couples", label: "For Couples" },
    { href: "/vendors", label: "Vendors" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header className="z-50 w-full flex justify-center px-4 mt-4 mb-4">
      <div className="w-full max-w-6xl flex h-16 items-center justify-between px-6 lg:px-8 rounded-full border border-white/40 bg-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full border border-burgundy/10 bg-white/50 text-burgundy hover:bg-white transition-all"
          onClick={() => setShowDrawer(!showDrawer)}
        >
          {showDrawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex flex-1 items-center justify-start lg:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary bg-white/50">
              <span className="font-serif text-lg">M</span>
            </div>
            <span className="font-serif text-base font-bold tracking-wide uppercase text-burgundy hidden sm:block">Maison Wedding Circle</span>
          </Link>
        </div>
        
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-burgundy/90 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse bg-burgundy/10 rounded-full" />
          ) : session ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 h-11 p-1 pr-4 rounded-full border border-burgundy/10 bg-white/50 text-burgundy hover:bg-white transition-all shadow-sm"
              >
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    className="w-9 h-9 rounded-full object-cover border border-primary/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-burgundy flex items-center justify-center text-xs text-white font-bold border border-primary/20">
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col items-start pr-2">
                  <span className="text-[10px] font-bold text-primary leading-none uppercase tracking-widest mb-0.5">Welcome</span>
                  <span className="text-xs font-serif font-black text-burgundy truncate max-w-[80px] leading-none">
                    {session.user.name?.split(' ')[0] || "User"}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl border border-primary/20 rounded-[24px] shadow-2xl p-2 z-50 overflow-hidden ring-1 ring-black/5"
                    >
                      <div className="px-4 py-3 border-b border-burgundy/5 mb-2">
                        <p className="text-xs font-bold text-[#8a6200] uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-xs font-serif font-black text-burgundy truncate">{session.user.email}</p>
                      </div>

                      <Link 
                        href={session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "/admin" : (session.user.role === "VENDOR" ? "/dashboard/vendor" : "/dashboard/couple")}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 text-sm font-bold text-burgundy/80 hover:bg-[#fef3d6] rounded-xl transition-all group"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        Dashboard
                      </Link>

                      <Link 
                        href={session.user.role === "VENDOR" ? "/dashboard/vendor/bookings" : "/dashboard/couple/bookings"}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 text-sm font-bold text-burgundy/80 hover:bg-[#fef3d6] rounded-xl transition-all group"
                      >
                        <span className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex items-center justify-center">📅</span>
                        View Bookings
                      </Link>

                      {session.user.role === "VENDOR" && (
                        <Link 
                          href="/dashboard/vendor/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 p-3 text-sm font-bold text-burgundy/80 hover:bg-[#fef3d6] rounded-xl transition-all group"
                        >
                          <User className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                          Edit Profile
                        </Link>
                      )}

                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all mt-4 border-t border-burgundy/5 group"
                      >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" className="h-10 px-6 rounded-full shadow-lg shadow-primary/30 transition-transform hover:scale-105">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" 
              onClick={() => setShowDrawer(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl border-r border-primary/20 shadow-2xl z-[60] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-burgundy/10">
                <Link href="/" onClick={() => setShowDrawer(false)} className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary bg-white/50">
                    <span className="font-serif text-xl">M</span>
                  </div>
                  <span className="font-serif text-lg font-bold tracking-wide uppercase text-burgundy">Maison Wedding Circle</span>
                </Link>
              </div>
              
              <nav className="flex-1 p-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowDrawer(false)}
                    className="flex items-center gap-3 p-3 text-lg font-serif font-bold text-burgundy hover:bg-[#fef3d6] rounded-xl transition-all group"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {session && (
                <div className="p-6 border-t border-burgundy/10">
                  <Link 
                    href={session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "/admin" : (session.user.role === "VENDOR" ? "/dashboard/vendor" : "/dashboard/couple")}
                    onClick={() => setShowDrawer(false)}
                    className="flex items-center gap-3 p-3 text-lg font-serif font-bold text-burgundy hover:bg-[#fef3d6] rounded-xl transition-all group mb-3"
                  >
                    <LayoutDashboard className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    Dashboard
                  </Link>
                  
                  <button 
                    onClick={() => { signOut(); setShowDrawer(false); }}
                    className="w-full flex items-center gap-3 p-3 text-lg font-serif font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
