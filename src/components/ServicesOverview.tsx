import { Link } from "react-router-dom";
import { Hotel, Plane, Mountain, ShieldCheck, Car } from "lucide-react";
import { motion } from "framer-motion";

const SERVICES = [
  { icon: Hotel, title: "Hotel Booking", desc: "Find the perfect stay — from luxury resorts to cozy lodges across Rwanda.", to: "/hotels" },
  { icon: Plane, title: "Flights & Tickets", desc: "Book domestic and international flights with ease.", to: "/flights" },
  { icon: Mountain, title: "Tourism Activities", desc: "Gorilla trekking, safaris, cultural tours, and more adventures.", to: "/activities" },
  { icon: Car, title: "Tourism Transport", desc: "Private tourism cars, 4x4 safari vehicles, shuttles, and VIP transfers for all your travel needs across Rwanda.", to: "/airport-assist" },
  { icon: ShieldCheck, title: "Airport Assistance", desc: "VIP meet & greet, fast-track immigration, and private airport transfers.", to: "/airport-assist" },
];

const ServicesOverview = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Our Services</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Everything you need for a seamless travel experience in Rwanda.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={s.to}
              className="group block bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesOverview;
