"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { 
  Mail, 
  Send, 
  Users, 
  User, 
  Search, 
  Filter, 
  MessageSquare, 
  AlertCircle,
  Megaphone,
  History,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("broadcast");
  const [broadcastTarget, setBroadcastTarget] = useState("all-couples");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Broadcast sent to ${broadcastTarget.replace('-', ' ')}!`);
    setBroadcastMessage("");
  };

  const threads = [
    { id: 1, c: "Ali & Sara Malik", v: "Noor Studios", last: "Looking forward to our shoot!", time: "2h ago", status: "Active" },
    { id: 2, c: "Omar & Fatima", v: "Dream Decor", last: "Can we add more gold accents?", time: "5h ago", status: "Active" },
    { id: 3, c: "Hassan Baig", v: "Bushra's Kitchen", last: "Tasting menu confirmed for Friday.", time: "1d ago", status: "Read" },
  ];

  return (
    <div className="space-y-8 font-inter">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Messaging & Moderation</h1>
        <p className="text-burgundy/60 italic">Monitor platform communications and send system-wide broadcasts</p>
      </div>

      <div className="flex gap-1 p-1 bg-white border border-burgundy/5 rounded-2xl w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab("broadcast")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "broadcast" ? "bg-[#3D0C1A] text-white" : "text-burgundy/60 hover:bg-burgundy/5"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Broadcast System
        </button>
        <button 
          onClick={() => setActiveTab("moderation")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "moderation" ? "bg-[#3D0C1A] text-white" : "text-burgundy/60 hover:bg-burgundy/5"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Active Threads
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "history" ? "bg-[#3D0C1A] text-white" : "text-burgundy/60 hover:bg-burgundy/5"
          }`}
        >
          <History className="w-4 h-4" />
          Sent History
        </button>
      </div>

      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <form onSubmit={handleBroadcast} className="bg-white p-8 rounded-[40px] border border-burgundy/5 shadow-sm space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-[#8a6200] uppercase tracking-widest">Recipients</label>
                       <select 
                          value={broadcastTarget}
                          onChange={(e) => setBroadcastTarget(e.target.value)}
                          className="w-full p-3 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm font-bold outline-none focus:border-[#C9940A]"
                       >
                          <option value="all-couples">All Registered Couples</option>
                          <option value="all-vendors">All Registered Vendors</option>
                          <option value="premium-vendors">Premium Vendors Only</option>
                          <option value="photography-vendors">Photography Category</option>
                          <option value="catering-vendors">Catering Category</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-[#8a6200] uppercase tracking-widest">Subject Line</label>
                       <input 
                          placeholder="e.g. Important Platform Update"
                          className="w-full p-3 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm outline-none focus:border-[#C9940A]"
                       />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#8a6200] uppercase tracking-widest">Message Content</label>
                    <textarea 
                       rows={10}
                       value={broadcastMessage}
                       onChange={(e) => setBroadcastMessage(e.target.value)}
                       placeholder="Compose your message here. Avoid using code or HTML tags..."
                       className="w-full p-6 bg-[#FFFDF5] border border-burgundy/10 rounded-3xl text-sm outline-none focus:border-[#C9940A] resize-none"
                    />
                 </div>

                 <div className="flex items-center justify-between pt-4">
                    <p className="text-[10px] text-burgundy/40 max-w-sm italic">
                       * This will be sent as both an in-app notification and an email via Resend to approximately 242 users.
                    </p>
                    <button className="flex items-center gap-3 px-10 py-3 bg-[#C9940A] text-white rounded-2xl font-black text-sm hover:bg-[#a57808] transition-all shadow-lg active:scale-95">
                       <Send className="w-5 h-5" />
                       Send Broadcast Now
                    </button>
                 </div>
              </form>
           </div>
           
           <div className="space-y-6">
              <div className="bg-[#3D0C1A] p-8 rounded-[40px] text-white">
                 <h3 className="text-lg font-playfair font-black mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#C9940A]" />
                    Messaging Policies
                 </h3>
                 <ul className="space-y-3 text-xs text-white/70 leading-relaxed font-medium">
                    <li className="flex gap-2">
                       <span className="text-[#C9940A]">Ã¢â‚¬Â¢</span>
                       Only SUPER_ADMIN can send broadcasts to all vendors.
                    </li>
                    <li className="flex gap-2">
                       <span className="text-[#C9940A]">Ã¢â‚¬Â¢</span>
                       Moderation of threads is restricted to STAFF_ADMIN.
                    </li>
                    <li className="flex gap-2">
                       <span className="text-[#C9940A]">Ã¢â‚¬Â¢</span>
                       Broadcasts are capped at 3 per week to prevent spam.
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      )}

      {activeTab === "moderation" && (
        <div className="bg-white rounded-[40px] border border-burgundy/5 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-burgundy/5 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy/30" />
                 <input 
                    placeholder="Search threads..."
                    className="w-full pl-10 pr-4 py-2 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm outline-none"
                 />
              </div>
              <button className="p-2 text-burgundy/40 hover:text-burgundy">
                 <Filter className="w-5 h-5" />
              </button>
           </div>
           <div className="divide-y divide-burgundy/5">
              {threads.map(t => (
                <div key={t.id} className="p-6 flex items-center justify-between hover:bg-burgundy/[0.01] transition-colors group">
                   <div className="flex items-center gap-6">
                      <div className="flex -space-x-4">
                         <div className="w-10 h-10 rounded-full bg-burgundy/5 border-2 border-white flex items-center justify-center font-bold text-burgundy text-xs">C</div>
                         <div className="w-10 h-10 rounded-full bg-[#fde9b2] border-2 border-white flex items-center justify-center font-bold text-[#3D0C1A] text-xs">V</div>
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-burgundy">
                            {t.c} <span className="mx-2 text-burgundy/20">/</span> <span className="text-[#C9940A]">{t.v}</span>
                         </h4>
                         <p className="text-xs text-burgundy/60 italic mt-0.5">"{t.last}"</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <span className="text-[10px] font-black text-burgundy/30 uppercase">{t.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        t.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-burgundy/5 text-burgundy/40"
                      }`}>{t.status}</span>
                      <button className="p-2 text-burgundy/20 group-hover:text-burgundy transition-colors">
                         <Search className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
