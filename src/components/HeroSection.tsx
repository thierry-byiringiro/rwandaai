import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, Hotel, Plane, Mountain, ShieldCheck, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import heroImg from "@/assets/hero-rwanda.jpg";

const SERVICES = [
  { label: "Hotel Bookings", icon: Hotel, to: "/hotels", desc: "Find & book luxury to budget stays" },
  { label: "Travel & Air Tickets", icon: Plane, to: "/flights", desc: "Domestic & international flights" },
  { label: "All Activities-Based Tourism in Rwanda", icon: Mountain, to: "/activities", desc: "Gorilla trekking, safaris & more" },
  { label: "Airport Assistance", icon: ShieldCheck, to: "/airport-assist", desc: "VIP meet & greet, transfers" },
];

const HeroSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center">
      <img
        src={heroImg}
        alt="Rwanda volcanic mountains at sunrise"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />

      <div className="container relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block bg-secondary/90 text-secondary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            Land of a Thousand Hills
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-background leading-tight mb-6">
            Strong Peak <br />
            <span className="text-secondary">Adventures</span>
          </h1>
          <p className="text-background/80 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
            Book hotels, flights, tours, and airport assistance — all in one place. Your gateway to unforgettable African adventures.
          </p>
          <div className="flex flex-wrap gap-4">
            {/* Service dropdown */}
            <div>
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-base"
                onClick={() => setOpen(true)}
              >
                Choose a Service You Want <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Popup overlay */}
            {open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-md overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h3 className="font-display text-lg font-semibold text-foreground">Choose a Service</h3>
                    <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-3">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-foreground hover:bg-primary/10 transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <s.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            <Button
              size="lg"
              variant="outline"
              className="border-background/40 text-background bg-background/10 hover:bg-background/20 gap-2 text-base"
              onClick={() => document.querySelector<HTMLButtonElement>(".fixed.bottom-6.right-6")?.click()}
            >
              <MessageCircle className="w-4 h-4" /> Chat with Online Agent
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
