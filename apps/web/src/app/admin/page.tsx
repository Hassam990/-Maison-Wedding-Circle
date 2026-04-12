import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-foreground w-full absolute top-0 left-0 z-[100] h-screen overflow-hidden">
      <header className="bg-burgundy text-white h-16 shrink-0 flex items-center px-6">
         <h1 className="font-serif text-xl font-bold">MWC Admin Console</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <div className="w-64 bg-white border-r border-neutral-200 p-4 space-y-1 shrink-0 overflow-y-auto">
          <Button variant="ghost" className="w-full justify-start font-bold bg-neutral-100 text-burgundy">Dashboard</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/70">Vendors</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/70">Couples</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/70">Consultations</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/70">Messages</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/70">Settings</Button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-burgundy font-serif">Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Total Vendors</p>
                <p className="text-3xl font-bold text-burgundy">42</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Total Couples</p>
                <p className="text-3xl font-bold text-burgundy">108</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Pending Consultations</p>
                <p className="text-3xl font-bold text-red-600">12</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Monthly MRR</p>
                <p className="text-3xl font-bold text-green-600">$4,250</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
               <h3 className="font-bold text-lg mb-4 text-burgundy font-serif">Recent Consultations</h3>
               <div className="text-sm text-foreground/60 py-12 text-center border-2 border-dashed border-neutral-200 rounded-lg">No new consultations.</div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
               <h3 className="font-bold text-lg mb-4 text-burgundy font-serif">Pending Vendor Approvals</h3>
               <div className="text-sm text-foreground/60 py-12 text-center border-2 border-dashed border-neutral-200 rounded-lg">No pending approvals.</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
