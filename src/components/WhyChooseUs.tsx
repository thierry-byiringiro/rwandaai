import { Shield, Clock, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";

const REASONS = [
  { icon: Shield, title: "Trusted & Reliable", desc: "Years of experience providing quality travel services in Rwanda." },
  { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance via phone, email, and WhatsApp." },
  { icon: Heart, title: "Personalized Service", desc: "Every trip is tailored to your preferences and budget." },
  { icon: Globe, title: "Local Expertise", desc: "Deep knowledge of Rwanda's hidden gems and best destinations." },
];

const WhyChooseUs = () => (
  <section className="py-20 md:py-28 bg-muted/50">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Why Choose Us</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">We make exploring Rwanda effortless, memorable, and safe.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {REASONS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <r.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
