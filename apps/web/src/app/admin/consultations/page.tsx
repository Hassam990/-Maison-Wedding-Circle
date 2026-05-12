"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Trash2,
  X,
  Download
} from "lucide-react";
import { toast } from "sonner";

const COLUMNS = [
  { id: "New", label: "New Requests", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: "In Progress", label: "In Progress", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { id: "Matched", label: "Matched", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: "Completed", label: "Completed", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
];

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [couples, setCouples] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConsultations = async () => {
    try {
      const res = await fetch("/api/admin/consultations");
      if (res.ok) {
        const data = await res.json();
        setConsultations(data);
      }
    } catch (error) {
      toast.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  const fetchCouples = async () => {
    try {
      const res = await fetch("/api/admin/couples");
      if (res.ok) {
        const data = await res.json();
        setCouples(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchConsultations();
    fetchCouples();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Moved to ${newStatus}`);
        fetchConsultations();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation?")) return;
    try {
      const res = await fetch(`/api/admin/consultations?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Consultation deleted");
        fetchConsultations();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/admin/consultations", {
        method: selectedItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedItem ? { ...data, id: selectedItem.id } : data),
      });

      if (res.ok) {
        toast.success(selectedItem ? "Updated successfully" : "Added successfully");
        fetchConsultations();
        setIsModalOpen(false);
        setIsAdding(false);
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Couple", "Email", "Status", "Assigned To", "Follow Up", "Created At"];
    const rows = consultations.map(c => [
      c.id,
      c.couple?.user?.name || "N/A",
      c.couple?.user?.email || "N/A",
      c.status,
      c.assignedTo || "Unassigned",
      c.followUpDate ? new Date(c.followUpDate).toLocaleDateString() : "None",
      new Date(c.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "consultations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredConsultations = consultations.filter(c => 
    c.couple?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.couple?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Consultations Hub</h1>
          <p className="text-burgundy/60 italic">Manage your couple leads and matching pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9940A] text-[#C9940A] rounded-full font-bold text-sm hover:bg-[#FFFDF5] transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={() => { setIsAdding(true); setSelectedItem(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-2 bg-[#C9940A] text-white rounded-full font-bold text-sm hover:bg-[#a57808] transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Manually
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-burgundy/40" />
        <input 
          type="text"
          placeholder="Search by name, email or assigned staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#C9940A]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9940A]/50 transition-all font-inter"
        />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px] overflow-x-auto pb-8">
        {COLUMNS.map((column) => (
          <div key={column.id} className="flex flex-col gap-4 min-w-[280px]">
            <div className={`p-3 rounded-xl border ${column.color} flex items-center justify-between`}>
              <span className="font-bold text-sm uppercase tracking-widest">{column.label}</span>
              <span className="bg-white/50 px-2 py-0.5 rounded-md text-xs font-black">
                {filteredConsultations.filter(c => c.status === column.id).length}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col gap-4 p-2 bg-burgundy/[0.02] rounded-2xl border border-burgundy/[0.05]">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-32 bg-white/50 animate-pulse rounded-xl" />
                ))
              ) : (
                filteredConsultations
                  .filter(c => c.status === column.id)
                  .map((item) => (
                    <motion.div
                      layoutId={item.id}
                      key={item.id}
                      onClick={() => { setSelectedItem(item); setIsAdding(false); setIsModalOpen(true); }}
                      className="group bg-white p-4 rounded-xl border border-burgundy/10 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#C9940A]" />
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-playfair font-bold text-burgundy group-hover:text-[#C9940A] transition-colors line-clamp-1">
                            {item.couple?.user?.name || "Anonymous Couple"}
                          </h4>
                          <p className="text-[10px] text-burgundy/50 font-bold uppercase tracking-tighter">
                            Requested {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {item.assignedTo && (
                          <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center text-[8px] font-black" title={`Assigned to ${item.assignedTo}`}>
                            {item.assignedTo.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-burgundy/70">
                          <MapPin className="w-3 h-3 text-[#C9940A]" />
                          {item.couple?.city || "TBD"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-burgundy/70 font-semibold italic">
                          <CheckCircle2 className="w-3 h-3 text-[#C9940A]" />
                          {item.couple?.eventType || "Event TBD"}
                        </div>
                        {item.followUpDate && (
                          <div className="flex items-center gap-2 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md self-start w-fit mt-1">
                            <Clock className="w-2.5 h-2.5" />
                            Next: {new Date(item.followUpDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-burgundy/5">
                        <div className="flex -space-x-1">
                           <div className="w-5 h-5 rounded-full bg-[#fde9b2] border border-white" />
                        </div>
                        <button className="text-[10px] font-bold text-[#C9940A] opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details &rarr;
                        </button>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#C9940A]/20"
            >
              <div className="p-6 bg-[#3D0C1A] text-white flex justify-between items-center bg-gradient-to-r from-[#3D0C1A] to-[#5a1428]">
                <div>
                  <h2 className="text-xl font-playfair font-bold">
                    {isAdding ? "New Consultation" : "Consultation Details"}
                  </h2>
                  <p className="text-white/60 text-xs italic tracking-wide">
                    {isAdding ? "Initialize a new couple intake" : `ID: ${selectedItem?.id}`}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto font-inter">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isAdding ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8a6200] uppercase tracking-widest">Select Couple</label>
                      <select name="coupleId" required className="w-full p-3 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm font-semibold outline-none focus:border-[#C9940A]">
                        <option value="">-- Select a couple --</option>
                        {couples.map(c => (
                          <option key={c.id} value={c.id}>{c.user?.name} ({c.user?.email})</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8a6200] uppercase tracking-widest">Couple Info</label>
                      <div className="p-3 bg-[#FFFDF5] rounded-xl border border-burgundy/5">
                        <p className="text-sm font-bold text-burgundy">{selectedItem?.couple?.user?.name}</p>
                        <p className="text-[10px] text-burgundy/60">{selectedItem?.couple?.user?.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8a6200] uppercase tracking-widest">Pipeline Status</label>
                    <select 
                      name="status" 
                      required 
                      defaultValue={selectedItem?.status || "New"}
                      className="w-full p-3 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm font-semibold outline-none focus:border-[#C9940A]"
                    >
                      {COLUMNS.map(col => <option key={col.id} value={col.id}>{col.label}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8a6200] uppercase tracking-widest">Assigned Staff</label>
                    <input 
                      name="assignedTo"
                      defaultValue={selectedItem?.assignedTo || ""}
                      placeholder="e.g. Aisha Mirza"
                      className="w-full p-3 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm outline-none focus:border-[#C9940A]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8a6200] uppercase tracking-widest">Follow Up Date</label>
                    <input 
                      name="followUpDate"
                      type="date"
                      defaultValue={selectedItem?.followUpDate ? new Date(selectedItem.followUpDate).toISOString().split('T')[0] : ""}
                      className="w-full p-3 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm outline-none focus:border-[#C9940A]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#8a6200] uppercase tracking-widest">Consultation Notes</label>
                  <textarea 
                    name="notes"
                    rows={5}
                    defaultValue={selectedItem?.notes || ""}
                    placeholder="Enter detailed notes from your calls or meetings..."
                    className="w-full p-4 bg-[#FFFDF5] border border-burgundy/10 rounded-2xl text-sm outline-none focus:border-[#C9940A] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-burgundy/5">
                  {!isAdding && (
                    <button 
                      type="button"
                      onClick={() => handleDelete(selectedItem.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold text-xs hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                  <div className="flex gap-3 ml-auto">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-[#3D0C1A] font-bold text-sm bg-burgundy/5 hover:bg-burgundy/10 transition-all border border-burgundy/10"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-2 rounded-xl bg-[#C9940A] text-white font-bold text-sm hover:bg-[#a57808] transition-all shadow-md active:scale-95"
                    >
                      {selectedItem ? "Update Records" : "Create Consultation"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
