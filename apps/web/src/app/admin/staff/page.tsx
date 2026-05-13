"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  MoreHorizontal, 
  History, 
  Trash2, 
  Settings,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function StaffManagementPage() {

  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "MaisonStaff2026!",
    role: "STAFF_ADMIN"
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Staff member added successfully");
        setIsAdding(false);
        setFormData({ name: "", email: "", password: "MaisonStaff2026!", role: "STAFF_ADMIN" });
        fetchStaff();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to add staff");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-inter">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Staff Management</h1>
          <p className="text-burgundy/60 italic">Manage internal team access and permissions</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2 bg-[#C9940A] text-white rounded-full font-black text-sm hover:bg-[#a57808] transition-all shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          Add Internal Staff
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-burgundy/5">
                <div className="w-8 h-8 border-4 border-[#C9940A] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-burgundy/60 font-bold uppercase text-[10px] tracking-widest">Loading Team Members...</p>
             </div>
           ) : (
             <div className="bg-white rounded-[40px] border border-burgundy/5 shadow-sm overflow-hidden">
              <div className="divide-y divide-burgundy/5">
                 {staff.map((member: any) => (
                   <div key={member.id} className="p-8 flex items-center justify-between hover:bg-burgundy/[0.01] transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
                            member.role === "SUPER_ADMIN" ? "bg-[#3D0C1A] text-white" : "bg-burgundy/5 text-burgundy"
                         }`}>
                           {member.name.charAt(0)}
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="font-black text-burgundy">{member.name}</h4>
                               {member.role === "SUPER_ADMIN" && <ShieldCheck className="w-4 h-4 text-[#C9940A]" />}
                            </div>
                            <p className="text-xs text-burgundy/50">{member.email}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-12">
                         <div className="hidden md:block">
                            <p className="text-[10px] font-black uppercase text-burgundy/30 tracking-widest mb-1">Permissions</p>
                            <div className="flex gap-2">
                               {member.permissions.map((p: string) => (
                                 <span key={p} className="px-2 py-0.5 bg-[#FFFDF5] border border-burgundy/5 rounded text-[10px] font-bold text-burgundy/60 uppercase">
                                    {p}
                                 </span>
                               ))}
                            </div>
                         </div>
                         <div className="hidden md:block text-right">
                            <p className="text-[10px] font-black uppercase text-burgundy/30 tracking-widest mb-1">Last Action</p>
                            <p className="text-xs font-bold text-burgundy/80">{member.lastLogin}</p>
                         </div>
                         <button className="p-2 text-burgundy/20 hover:text-burgundy transition-colors">
                            <Settings className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm">
              <h3 className="text-lg font-playfair font-black text-burgundy mb-6 flex items-center gap-2">
                 <History className="w-5 h-5 text-[#C9940A]" />
                 Recent Team Activity
              </h3>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-burgundy/5">
                 {[
                   { user: "Lister", action: "Updated Homepage CMS", time: "Just now" },
                   { user: "Dawood Staff 2", action: "Approved Vendor 'Noor Studios'", time: "4h ago" },
                   { user: "Huma Mea Staff 2", action: "Responded to Consultation", time: "1d ago" },
                   { user: "Lister", action: "Exported Vendor List", time: "2d ago" },
                 ].map((log, i) => (
                   <div key={i} className="relative pl-8">
                      <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-white border border-burgundy/5 p-1 flex items-center justify-center">
                         <div className="w-full h-full rounded-full bg-burgundy/20" />
                      </div>
                      <p className="text-xs font-black text-burgundy leading-none mb-1">{log.user}</p>
                      <p className="text-xs text-burgundy/60 mb-0.5">{log.action}</p>
                      <p className="text-[10px] font-bold text-burgundy/30 uppercase">{log.time}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-amber-50 rounded-[40px] border border-[#C9940A]/20">
              <div className="flex gap-4">
                 <Lock className="w-6 h-6 text-[#C9940A] flex-shrink-0" />
                 <div>
                    <h4 className="text-sm font-black text-burgundy mb-1">Security Enforcement</h4>
                    <p className="text-xs text-burgundy/60 leading-relaxed font-medium">
                       Passwords must be rotated every 90 days. All staff logins are logged and IP-tracked for platform security.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-[#C9940A]/20 p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-playfair font-bold text-burgundy text-center">Add Internal Staff</h2>
              <p className="text-xs text-burgundy/60 italic text-center">Create a new administrative account</p>
            </div>
            
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-burgundy/40 uppercase tracking-widest px-2">Full Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-2xl text-sm font-bold outline-none focus:border-[#C9940A]"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-burgundy/40 uppercase tracking-widest px-2">Email Address</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-2xl text-sm font-bold outline-none focus:border-[#C9940A]"
                  placeholder="staff@maisoncircle.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-burgundy/40 uppercase tracking-widest px-2">Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-2xl text-sm font-bold outline-none focus:border-[#C9940A]"
                >
                  <option value="STAFF_ADMIN">Staff Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                 <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 bg-burgundy/5 text-burgundy font-black text-xs rounded-full hover:bg-burgundy/10 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#C9940A] text-white font-black text-xs rounded-full hover:bg-[#a57808] transition-all shadow-lg disabled:opacity-50"
                 >
                   {isSubmitting ? "Creating..." : "Create Account"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
