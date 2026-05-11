"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  Trash2, 
  Flag, 
  CheckCircle, 
  MessageCircle, 
  Filter, 
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export default function ReviewsManagerPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  return (
    <div className="space-y-6 font-inter">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">Reviews Manager</h1>
        <p className="text-burgundy/60 italic">Monitor and moderate all vendor feedback</p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-burgundy/5 shadow-sm">
        <div className="flex items-center gap-2">
           <Filter className="w-4 h-4 text-[#C9940A]" />
           <span className="text-xs font-bold uppercase text-burgundy/40">Rating:</span>
           {[5, 4, 3, 2, 1].map(r => (
             <button 
               key={r}
               onClick={() => setFilterRating(filterRating === r ? null : r)}
               className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                 filterRating === r ? "bg-[#3D0C1A] text-white" : "bg-burgundy/5 text-burgundy/60 hover:bg-burgundy/10"
               }`}
             >
               {r} ★
             </button>
           ))}
        </div>
        <div className="ml-auto relative flex-1 max-w-sm">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy/30" />
           <input 
             type="text"
             placeholder="Search vendor or couple..."
             className="w-full pl-9 pr-4 py-2 bg-[#FFFDF5] border border-burgundy/10 rounded-xl text-sm outline-none focus:border-[#C9940A]"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-white animate-pulse rounded-2xl border border-burgundy/5" />)
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-3xl border border-burgundy/5 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex flex-col items-center justify-center font-black text-burgundy">
                        <span className="text-lg leading-none">{review.rating}</span>
                        <Star className="w-3 h-3 fill-current" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-bold text-burgundy">{review.couple?.user?.name}</h3>
                           <ArrowRight className="w-3 h-3 text-burgundy/30" />
                           <h3 className="font-black text-[#C9940A] underline underline-offset-4 decoration-1 decoration-[#C9940A]/30">
                              {review.vendor?.businessName}
                           </h3>
                        </div>
                        <p className="text-sm font-medium text-burgundy/80 leading-relaxed italic pr-12">
                           "{review.comment}"
                        </p>
                        <p className="text-[10px] font-bold text-burgundy/40 uppercase mt-2">
                           Posted {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button title="Mark as Checked" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <ShieldCheck className="w-5 h-5" />
                     </button>
                     <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-burgundy/5 flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-[#FFFDF5] border border-burgundy/10 text-burgundy/60 rounded-xl text-xs font-bold hover:bg-white hover:text-[#C9940A] hover:border-[#C9940A] transition-all">
                     <MessageCircle className="w-4 h-4" />
                     Add Platform Reply
                  </button>
                  <button className="flex items-center gap-2 px-4 py-1.5 bg-[#FFFDF5] border border-burgundy/10 text-burgundy/60 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                     <Flag className="w-4 h-4" />
                     Flag Review
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {filteredReviews.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-burgundy/20">
           <Star className="w-12 h-12 text-burgundy/10 mx-auto mb-4" />
           <p className="text-burgundy/40 font-bold uppercase tracking-widest italic">No reviews found for this selection</p>
        </div>
      )}
    </div>
  );
}
