"use client";

import { useState, useEffect } from "react";
import { 
  Users,
  User,
  Plus, 
  Trash2, 
  Edit2, 
  MoveVertical, 
  Camera, 
  Link2, 
  Globe,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function TeamManagerPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/cms/team");
      if (res.ok) setMembers(await res.json());
    } catch (error) {
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    try {
      const res = await fetch(`/api/cms/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Member removed");
        fetchData();
      }
    } catch (error) {}
  };

  return (
    <div className="space-y-8 font-inter">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Team Members</h1>
          <p className="text-burgundy/60 italic">Manage the faces behind Maison Wedding Circle</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2 bg-[#C9940A] text-white rounded-full font-black text-sm hover:bg-[#a57808] transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-white animate-pulse rounded-3xl" />)
        ) : (
          members.map((member) => (
            <div key={member.id} className="bg-white rounded-[32px] border border-burgundy/5 overflow-hidden shadow-sm group hover:shadow-xl transition-all">
               <div className="aspect-square bg-burgundy/5 relative overflow-hidden">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-burgundy/10">
                       <User size={64} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 bg-white rounded-full text-burgundy shadow-lg hover:bg-[#C9940A] hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => handleDelete(member.id)}
                       className="p-2 bg-white rounded-full text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               <div className="p-6">
                  <h3 className="font-playfair font-black text-xl text-burgundy">{member.name}</h3>
                  <p className="text-[10px] font-black text-[#C9940A] uppercase tracking-widest mb-3">{member.role}</p>
                  <p className="text-xs text-burgundy/60 leading-relaxed line-clamp-3 italic mb-4">
                     "{member.bio}"
                  </p>
                  <div className="flex gap-3 pt-4 border-t border-burgundy/5">
                     {member.instagram && <Globe className="w-4 h-4 text-burgundy/30 hover:text-[#C9940A] transition-colors cursor-pointer" />}
                     {member.linkedin && <Link2 className="w-4 h-4 text-burgundy/30 hover:text-[#C9940A] transition-colors cursor-pointer" />}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {members.length === 0 && !loading && (
        <div className="py-20 text-center border-2 border-dashed border-burgundy/10 rounded-[40px]">
           <Users className="w-12 h-12 text-burgundy/10 mx-auto mb-4" />
           <p className="text-burgundy/40 font-bold uppercase">No team members added yet</p>
        </div>
      )}
    </div>
  );
}
