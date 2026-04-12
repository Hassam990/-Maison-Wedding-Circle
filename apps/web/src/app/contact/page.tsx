import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20 pb-24 bg-ivory text-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-serif text-5xl font-bold text-burgundy mb-4">Get In Touch</h1>
        <p className="text-foreground/80 mb-12 max-w-xl">Whether you&apos;re looking to plan the perfect wedding, or you&apos;re a vendor looking to join our network, we&apos;d love to hear from you.</p>
        
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-8">
             <div>
               <h4 className="font-serif text-xl font-semibold text-burgundy mb-2">Contact Information</h4>
               <p className="text-foreground/80 flex items-center gap-2"><span className="text-primary">📞</span> (470) 835-2007</p>
               <p className="text-foreground/80 flex items-center gap-2"><span className="text-primary">✉️</span> info@maisonweddingcircle.com</p>
             </div>
             <div>
               <h4 className="font-serif text-xl font-semibold text-burgundy mb-2">Cities Served</h4>
               <p className="text-foreground/80">Atlanta, New York, New Jersey, DC & Metro Areas</p>
             </div>
             
             <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden border border-primary/20">
               {/* Map Placeholder */}
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212270.74113215568!2d-84.56068864708708!3d33.76763384284196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
               />
             </div>
          </div>
          
          <div className="flex-1">
             <form className="bg-white p-8 rounded-2xl shadow-sm border border-primary/20 space-y-4">
               <div>
                 <label className="text-sm font-semibold mb-1 block text-burgundy">Your Name</label>
                 <Input placeholder="Jane Doe" className="border-primary/20 focus:border-primary" />
               </div>
               <div>
                 <label className="text-sm font-semibold mb-1 block text-burgundy">Email Address</label>
                 <Input type="email" placeholder="jane@example.com" className="border-primary/20 focus:border-primary" />
               </div>
               <div>
                 <label className="text-sm font-semibold mb-1 block text-burgundy">Phone Number</label>
                 <Input placeholder="(555) 123-4567" className="border-primary/20 focus:border-primary"/>
               </div>
               <div>
                 <label className="text-sm font-semibold mb-1 block text-burgundy">I am a...</label>
                 <select className="flex h-12 w-full rounded-md border border-primary/20 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Couple Planning a Wedding</option>
                    <option>Vendor looking to Join</option>
                    <option>Other</option>
                 </select>
               </div>
               <div>
                  <label className="text-sm font-semibold mb-1 block text-burgundy">Message</label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-primary/20 bg-transparent px-4 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="How can we help you?"
                  ></textarea>
               </div>
               <Button className="w-full mt-4 h-12" variant="primary">Send Message</Button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
