import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function VendorDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-ivory/50">
      <div className="container mx-auto px-4 lg:px-8 py-12 flex gap-8">
        
        {/* SIDEBAR */}
        <div className="w-64 hidden lg:block space-y-2">
          <Button variant="ghost" className="w-full justify-start font-bold bg-primary/10">Overview</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">Leads (3 New)</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">Profile Editor</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">Reviews</Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-primary hover:bg-primary/5">Subscription</Button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-8">
          <h1 className="font-serif text-4xl font-bold text-burgundy">Vendor Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Profile Views (30d)</p>
                <p className="text-3xl font-bold text-primary">1,204</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">New Inquiries</p>
                <p className="text-3xl font-bold text-primary">4</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm text-foreground/60 font-semibold mb-2">Current Plan</p>
                <p className="text-xl font-bold text-primary mt-2">Professional <span className="text-xs font-normal text-burgundy underline cursor-pointer ml-2">Upgrade</span></p>
              </CardContent>
            </Card>
          </div>

          <h2 className="font-serif text-2xl font-bold text-burgundy mt-8">Recent Leads</h2>
          <div className="bg-white rounded-xl shadow-sm border border-primary/20 overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-ivory text-foreground/70 border-b border-primary/20">
                   <tr>
                     <th className="p-4 font-semibold">Couple</th>
                     <th className="p-4 font-semibold">Event Date</th>
                     <th className="p-4 font-semibold">Message Preview</th>
                     <th className="p-4 font-semibold">Status</th>
                     <th className="p-4 font-semibold">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                   {[
                     {name: "Aman & Sana", date: "Oct 12, 2024", msg: "We love your photography style...", status: "New"},
                     {name: "Rahul & Priya", date: "Nov 5, 2024", msg: "Are you available for a 3-day...", status: "Replied"}
                   ].map(l => (
                     <tr key={l.name} className="hover:bg-primary/5 transition-colors">
                       <td className="p-4 font-medium text-burgundy">{l.name}</td>
                       <td className="p-4 text-foreground/80">{l.date}</td>
                       <td className="p-4 text-foreground/70 truncate max-w-[200px]">{l.msg}</td>
                       <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${l.status === 'New' ? 'bg-primary/20 text-primary-dark' : 'bg-gray-100 text-gray-600'}`}>{l.status}</span>
                       </td>
                       <td className="p-4"><Button variant="outline" className="h-8 text-xs">View</Button></td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}
