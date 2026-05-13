import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Plane, Mail, MessageCircle, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { logBooking } from "@/lib/bookingLog";
import { toast } from "sonner";

const FlightsPage = () => {
  const [form, setForm] = useState({ name: "", from: "", to: "", date: "", passengers: "1" });

  const handleSubmit = async (method: "whatsapp" | "email" | "form") => {
    if (!form.name.trim()) { toast.error("Please enter your name"); return; }
    const itemName = `Flight ${form.from || "?"} → ${form.to || "?"} (${form.date || "TBD"})`;
    const notes = `Passengers: ${form.passengers}${form.date ? ` · Date: ${form.date}` : ""}`;
    await logBooking({
      itemType: "flight",
      itemName,
      customerName: form.name,
      channel: method,
      notes,
    });
    const msg = `Flight Request:\nName: ${form.name}\nFrom: ${form.from}\nTo: ${form.to}\nDate: ${form.date}\nPassengers: ${form.passengers}`;
    if (method === "whatsapp") {
      window.open(`https://wa.me/250782995950?text=${encodeURIComponent(msg)}`, "_blank");
    } else if (method === "email") {
      window.location.href = `mailto:Mazimpakastrong@gmail.com?subject=${encodeURIComponent("Flight Booking Request")}&body=${encodeURIComponent(msg)}`;
    } else {
      toast.success("Flight request sent! We'll contact you shortly.");
      setForm({ name: "", from: "", to: "", date: "", passengers: "1" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-24 pb-20 bg-background">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plane className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Book Your Flight</h1>
            <p className="text-muted-foreground">Fill out the form and we'll find the best flight options for you.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Departure City</Label>
                  <Input placeholder="e.g. Nairobi" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
                </div>
                <div>
                  <Label>Destination</Label>
                  <Input placeholder="e.g. Kigali" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Travel Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <Label>Passengers</Label>
                  <Input type="number" min="1" value={form.passengers} onChange={(e) => setForm({ ...form, passengers: e.target.value })} />
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Book</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book Your Flight</DialogTitle>
                    <DialogDescription className="text-xs">Choose how you'd like to book.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Button onClick={() => handleSubmit("form")} className="w-full justify-start gap-3 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Send className="w-4 h-4" /> Book Here
                    </Button>
                    <Button onClick={() => handleSubmit("email")} variant="outline" className="w-full justify-start gap-3">
                      <Mail className="w-4 h-4" /> Book by Email
                    </Button>
                    <Button onClick={() => handleSubmit("whatsapp")} className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90">
                      <MessageCircle className="w-4 h-4" /> Book by WhatsApp
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FlightsPage;
