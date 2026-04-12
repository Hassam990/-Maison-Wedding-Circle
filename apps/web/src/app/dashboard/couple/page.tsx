import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CoupleDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-ivory/50">
      <div className="container mx-auto px-4 lg:px-8 py-12 flex gap-8">
        
        {/* SIDEBAR */}
        <div className="w-64 hidden lg:block space-y-2">
          <Button variant="ghost" className="w-full justify-start font-bold bg-primary/10">Overview</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">My Vendors</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">Planning Checklist</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">Budget Tracker</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">Messages</Button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-8">
          <h1 className="font-serif text-4xl font-bold text-burgundy">Welcome, Zara & Zayn!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Days Until Wedding</p>
                <p className="text-3xl font-bold text-primary">145</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Planning Complete</p>
                <p className="text-3xl font-bold text-primary">45%</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Budget Spent</p>
                <p className="text-3xl font-bold text-primary">$24,500 <span className="text-sm text-foreground/50 font-normal">/ $80,000</span></p>
              </CardContent>
            </Card>
          </div>

          <h2 className="font-serif text-2xl font-bold text-burgundy mt-8">My Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-white border-primary/20 flex flex-col justify-center p-6 border-dashed border-2 text-center text-foreground/60 hover:border-primary/50 cursor-pointer transition-colors shadow-none text-sm font-semibold h-full min-h-[140px]">
                + Browse & Assign Vendors
             </Card>
             <Card className="bg-white border-primary/20 p-4 flex gap-4 items-center">
               <div className="w-16 h-16 bg-primary/10 rounded-lg shrink-0"></div>
               <div>
                 <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">Booked</span>
                 <h4 className="font-serif font-bold text-burgundy mt-1">Taj Authentic Catering</h4>
                 <p className="text-xs text-foreground/70">Next payment: $2,500 due in 30 days</p>
               </div>
             </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
