import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForVendorsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <section className="bg-burgundy py-24 text-ivory">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">For Wedding Professionals</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Grow Your Wedding Business.<br/>No Commissions.</h1>
          <p className="text-lg text-ivory/80 mb-10 max-w-2xl mx-auto">Join the most exclusive network of South Asian wedding vendors. Get high-quality leads directly to your inbox without paying middleman fees.</p>
          <div className="flex justify-center gap-4">
            <Button variant="primary">Apply to Join</Button>
            <Button variant="outline" className="border-ivory text-ivory hover:bg-ivory/10">View Pricing</Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-4xl text-burgundy font-bold text-center mb-16">Why Join Maison Wedding circle?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div>
               <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">🎯</div>
               <h3 className="font-serif text-xl text-burgundy font-semibold mb-2">Quality Leads</h3>
               <p className="text-foreground/70">Connect with couples actively planning their South Asian weddings with realistic budgets.</p>
             </div>
             <div>
               <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">0%</div>
               <h3 className="font-serif text-xl text-burgundy font-semibold mb-2">Zero Commissions</h3>
               <p className="text-foreground/70">You keep 100% of your booking amount. We only charge a flat monthly subscription.</p>
             </div>
             <div>
               <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
               <h3 className="font-serif text-xl text-burgundy font-semibold mb-2">Verified Badge</h3>
               <p className="text-foreground/70">Build trust instantly. Our verification process shows couples you are reliable and experienced.</p>
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-4xl text-burgundy font-bold text-center mb-16">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tiers */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/20 flex flex-col">
              <h3 className="font-serif text-2xl text-burgundy font-semibold">Free</h3>
              <div className="my-4"><span className="text-4xl font-bold text-burgundy">$0</span><span className="text-foreground/60">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-2 text-sm text-foreground/80"><span className="text-primary">✓</span> Basic Profile Listing</li>
                <li className="flex gap-2 text-sm text-foreground/80"><span className="text-primary">✓</span> Maximum 3 Gallery Images</li>
                <li className="flex gap-2 text-sm text-foreground/80"><span className="text-primary">✓</span> Receive General Inquiries</li>
              </ul>
              <Button variant="outline" className="w-full">Sign Up Free</Button>
            </div>
            
            <div className="bg-burgundy p-8 rounded-2xl shadow-xl border-2 border-primary flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
              <h3 className="font-serif text-2xl text-ivory font-semibold">Professional</h3>
              <div className="my-4"><span className="text-4xl font-bold text-ivory">$49</span><span className="text-ivory/60">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-2 text-sm text-ivory/80"><span className="text-primary">✓</span> Everything in Free</li>
                <li className="flex gap-2 text-sm text-ivory/80"><span className="text-primary">✓</span> Unlimited Gallery Images</li>
                <li className="flex gap-2 text-sm text-ivory/80"><span className="text-primary">✓</span> Priority Search Ranking</li>
                <li className="flex gap-2 text-sm text-ivory/80"><span className="text-primary">✓</span> Receive Direct Messages</li>
              </ul>
              <Button variant="primary" className="w-full text-burgundy bg-ivory hover:bg-ivory/90">Get Started</Button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/20 flex flex-col">
              <h3 className="font-serif text-2xl text-burgundy font-semibold">Premium</h3>
              <div className="my-4"><span className="text-4xl font-bold text-burgundy">$99</span><span className="text-foreground/60">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-2 text-sm text-foreground/80"><span className="text-primary">✓</span> Everything in Pro</li>
                <li className="flex gap-2 text-sm text-foreground/80"><span className="text-primary">✓</span> Homepage Featured Spot</li>
                <li className="flex gap-2 text-sm text-foreground/80"><span className="text-primary">✓</span> &quot;Verified&quot; Gold Badge</li>
                <li className="flex gap-2 text-sm text-foreground/80"><span className="text-primary">✓</span> Receive Auto-Matched Leads</li>
              </ul>
              <Button variant="outline" className="w-full">Get Premium</Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
           <h2 className="font-serif text-4xl text-burgundy font-bold text-center mb-8">Vendor Application</h2>
           <form className="bg-ivory p-8 rounded-2xl shadow-sm border border-primary/20 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block text-burgundy">Business Name</label>
                  <Input placeholder="Your Business" className="bg-white border-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-burgundy">Owner Name</label>
                  <Input placeholder="John Doe" className="bg-white border-primary/20" />
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block text-burgundy">Category</label>
                  <select className="flex h-12 w-full rounded-md border border-primary/20 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Catering</option>
                    <option>Decor</option>
                    <option>Photography & Video</option>
                    <option>Makeup & Hair</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-burgundy">Primary City</label>
                  <Input placeholder="Atlanta, GA" className="bg-white border-primary/20" />
                </div>
             </div>
             <div>
                <label className="text-sm font-semibold mb-1 block text-burgundy">Website or Instagram URL</label>
                <Input placeholder="https://" className="bg-white border-primary/20" />
             </div>
             <div>
                <label className="text-sm font-semibold mb-1 block text-burgundy">Brief Bio</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-primary/20 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Tell us about your experience in South Asian weddings..."
                ></textarea>
             </div>
             <Button className="w-full h-12" variant="primary">Submit Application</Button>
             <p className="text-xs text-center text-foreground/60 mt-4">By submitting, you agree to our Terms of Service. Approvals typically take 48 hours.</p>
           </form>
        </div>
      </section>
    </div>
  );
}
