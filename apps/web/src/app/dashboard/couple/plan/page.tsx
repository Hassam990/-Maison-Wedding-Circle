"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function PlanMyWeddingWizard() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex flex-col min-h-screen bg-ivory/50">
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 flex flex-col justify-center">
        
        <div className="bg-white rounded-2xl shadow-sm border border-primary/20 p-8 md:p-12 relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step/5)*100}%` }}></div>
          </div>
          
          <div className="mb-8">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Step {step} of 5</span>
            <h1 className="font-serif text-3xl font-bold text-burgundy mt-2">
              {step === 1 && "Event Details"}
              {step === 2 && "Budget Allocation"}
              {step === 3 && "Style Preferences"}
              {step === 4 && "Services Required"}
              {step === 5 && "Review & Submit"}
            </h1>
          </div>

          <div className="min-h-[300px]">
             {step === 1 && (
               <div className="space-y-4">
                 <div>
                   <label className="text-sm font-semibold block mb-1">Event Type</label>
                   <select className="w-full h-12 rounded-md border border-neutral-300 px-4 focus:ring-1 focus:ring-primary focus:outline-none">
                     <option>Wedding</option>
                     <option>Mehndi</option>
                     <option>Reception</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-sm font-semibold block mb-1">Event Date</label>
                   <Input type="date" />
                 </div>
                 <div>
                   <label className="text-sm font-semibold block mb-1">City / State</label>
                   <Input placeholder="Atlanta, GA" />
                 </div>
                 <div>
                   <label className="text-sm font-semibold block mb-1">Estimated Guest Count</label>
                   <Input type="number" placeholder="250" />
                 </div>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-6">
                 <div>
                   <label className="text-sm font-semibold block mb-1">Total Target Budget</label>
                   <Input type="number" placeholder="$50,000" />
                 </div>
                 <div className="h-px bg-neutral-200"></div>
                 <div className="space-y-4">
                   <p className="text-sm font-medium text-foreground/80">Roughly allocate budget to main categories (we&apos;ll help refine this later)</p>
                   <div>
                     <label className="text-xs flex justify-between"><span>Catering</span> <span>$15,000</span></label>
                     <input type="range" className="w-full accent-primary" />
                   </div>
                   <div>
                     <label className="text-xs flex justify-between"><span>Decor</span> <span>$10,000</span></label>
                     <input type="range" className="w-full accent-primary" />
                   </div>
                   <div>
                     <label className="text-xs flex justify-between"><span>Photography/Video</span> <span>$8,000</span></label>
                     <input type="range" className="w-full accent-primary" />
                   </div>
                 </div>
               </div>
             )}

             {step === 3 && (
               <div className="space-y-4">
                 <p className="text-sm text-foreground/80">Select the mood that best fits your vision:</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-primary rounded-xl overflow-hidden relative h-32 cursor-pointer">
                      <Image 
                        src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80" 
                        fill 
                        className="object-cover" 
                        alt="Traditional"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold font-serif text-xl z-10">Traditional</div>
                    </div>
                    <div className="border border-neutral-200 hover:border-primary rounded-xl overflow-hidden relative h-32 cursor-pointer">
                      <Image 
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
                        fill 
                        className="object-cover" 
                        alt="Modern"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold font-serif text-xl z-10">Modern Chic</div>
                    </div>
                 </div>
               </div>
             )}

             {step === 4 && (
               <div className="space-y-4">
                 <p className="text-sm text-foreground/80">What vendors do you still need to book?</p>
                 <div className="grid grid-cols-2 gap-4">
                   {["Full Planner", "Day-Of Coordinator", "Caterer", "Venue", "Decorator", "Photographer", "Videographer", "Hair & Makeup", "DJ / Band", "Priest / Officiant"].map(s => (
                     <label key={s} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                       <input type="checkbox" className="w-4 h-4 accent-primary" />
                       <span className="text-sm font-medium">{s}</span>
                     </label>
                   ))}
                 </div>
               </div>
             )}

             {step === 5 && (
               <div className="space-y-6">
                 <p className="text-foreground/80">You&apos;re all set! Review your information and submit to unlock your dashboard and begin getting matched.</p>
                 <div className="bg-ivory p-6 rounded-xl space-y-2 border border-primary/20">
                   <p className="text-sm"><span className="font-semibold text-burgundy">Event:</span> Wedding / Atlanta, GA</p>
                   <p className="text-sm"><span className="font-semibold text-burgundy">Budget:</span> $50,000 Target</p>
                   <p className="text-sm"><span className="font-semibold text-burgundy">Style:</span> Traditional</p>
                   <p className="text-sm"><span className="font-semibold text-burgundy">Services:</span> 5 needed</p>
                 </div>
               </div>
             )}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={step === 1}>Back</Button>
            {step < 5 ? (
              <Button variant="primary" onClick={nextStep}>Next Step</Button>
            ) : (
              <Button variant="primary" onClick={() => window.location.href = '/dashboard/couple'}>Submit & Go to Dashboard</Button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
