import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="py-20 md:py-28 bg-primary text-primary-foreground">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to Explore Rwanda?</h2>
        <p className="text-primary-foreground/70 mb-8 text-lg">
          Let us help you plan your dream trip. Contact us today or let our AI assistant guide you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="https://wa.me/250782995950" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20">
              WhatsApp Us
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
