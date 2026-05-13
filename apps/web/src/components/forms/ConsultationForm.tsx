
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";

export default function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Consultation scheduled! We will contact you soon.");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to submit. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8 border-none hover:-translate-y-3 hover:shadow-2xl transition-all duration-500">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold mb-1.5 block text-burgundy">Name</label>
            <Input name="name" required placeholder="Full Name" className="rounded-xl border-white bg-white/70 backdrop-blur-md h-12 font-medium shadow-sm hover:bg-white/90" />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block text-burgundy">Email</label>
            <Input name="email" type="email" required placeholder="Email Address" className="rounded-xl border-white bg-white/70 backdrop-blur-md h-12 font-medium shadow-sm hover:bg-white/90" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold mb-1.5 block text-burgundy">Event Type</label>
          <select name="eventType" className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all hover:bg-white/90">
             <option>Wedding</option>
             <option>Mehndi</option>
             <option>Reception</option>
             <option>Other</option>
          </select>
        </div>
        <div>
           <label className="text-sm font-bold mb-1.5 block text-burgundy">Location</label>
           <Input name="location" placeholder="City / State" className="rounded-xl border-white bg-white/70 backdrop-blur-md h-12 font-medium shadow-sm hover:bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all" />
        </div>
        <div>
          <label className="text-sm font-bold mb-1.5 block text-burgundy">Budget Range</label>
          <select name="budget" className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-medium shadow-sm hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
             <option>$20k - $50k</option>
             <option>$50k - $100k</option>
             <option>$100k - $200k+</option>
          </select>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full mt-6 h-12 text-md font-bold transition-transform hover:scale-[1.03] shadow-lg shadow-primary/20" variant="primary">
          {isSubmitting ? "Submitting..." : "Begin Your Wedding Journey"}
        </Button>
      </form>
    </Card>
  );
}
