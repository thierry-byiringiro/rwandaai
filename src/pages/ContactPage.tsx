import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { logInquiry } from "@/lib/bookingLog";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.message) {
      toast.error("Name and message are required");
      return;
    }
    setBusy(true);
    const { error } = await logInquiry(form);
    setBusy(false);
    if (error) {
      toast.error("Could not save your message: " + error.message);
      return;
    }
    toast.success("Message received! We'll get back to you shortly.");
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:Mazimpakastrong@gmail.com?subject=${encodeURIComponent(form.subject || "Website Inquiry")}&body=${encodeURIComponent(body)}`;
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-24 pb-20 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Contact Us</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">We'd love to hear from you. Reach out anytime!</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <a href="tel:+250782995950" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">+250 782 995 950</p>
                    </div>
                  </a>
                  <a href="mailto:Mazimpakastrong@gmail.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">Mazimpakastrong@gmail.com</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">Kanombe, Kigali, Rwanda</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-2xl overflow-hidden border border-border h-64">
                <iframe
                  title="Strong Peak Adventures Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15949.5!2d30.13!3d-1.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7f0bb30d0e1%3A0x52c4e2f8b3c4c9f9!2sKanombe%2C%20Kigali!5e0!3m2!1sen!2srw!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Send a Message</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input placeholder="What is this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea placeholder="Tell us how we can help…" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <Button onClick={handleSubmit} disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {busy ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
