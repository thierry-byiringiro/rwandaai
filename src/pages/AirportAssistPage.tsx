import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, ShieldCheck, Car, UserCheck, Clock } from "lucide-react";
import BookDialog from "@/components/BookDialog";
import { logBooking } from "@/lib/bookingLog";
import airportImg from "@/assets/airport-assist.jpg";

const FEATURES = [
  { icon: UserCheck, title: "Meet & Greet", desc: "Our staff welcomes you at arrivals with your name card." },
  { icon: ShieldCheck, title: "Fast-Track Immigration", desc: "Skip the queues with our VIP immigration assistance." },
  { icon: Car, title: "Private Transfers", desc: "Luxury vehicle from the airport to your hotel or destination." },
  { icon: Clock, title: "24/7 Availability", desc: "Available for all flights, any time of day or night." },
];

const AirportAssistPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-24 pb-20 bg-background">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Airport Assistance</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Arrive and depart in style with our premium airport services at Kigali International Airport.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <img src={airportImg} alt="Airport assistance service" className="w-full h-64 md:h-96 object-cover rounded-2xl" loading="lazy" width={800} height={600} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground mb-14"
        >
          <Phone className="w-10 h-10 mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Need Immediate Assistance?</h2>
          <p className="text-primary-foreground/70 mb-6 text-lg">Call us now for instant airport help</p>
          <p className="text-3xl md:text-4xl font-bold mb-6">+250 782 995 950</p>
          <div className="flex flex-wrap justify-center gap-3">
            <BookDialog
              itemType="airport_assist"
              itemName="Airport Assistance"
              trigger={
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8">
                  Book
                </Button>
              }
            />
            <a href="tel:+250782995950" onClick={() => logBooking({ itemType: "airport_assist", itemName: "Airport Assistance", customerName: "Anonymous", channel: "phone" })}>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 gap-2">
                <Phone className="w-4 h-4" /> Call Now
              </Button>
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default AirportAssistPage;
