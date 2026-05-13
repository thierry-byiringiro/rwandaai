import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-xl font-bold mb-4">
            Strong Peak <span className="text-secondary">Adventures</span>
          </h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Your trusted partner for travel and tourism in Rwanda. Explore the land of a thousand hills with us.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            <Link to="/hotels" className="hover:text-secondary transition-colors">Hotels</Link>
            <Link to="/flights" className="hover:text-secondary transition-colors">Flights</Link>
            <Link to="/activities" className="hover:text-secondary transition-colors">Activities</Link>
            <Link to="/airport-assist" className="hover:text-secondary transition-colors">Airport Assist</Link>
            <Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <a href="tel:+250782995950" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" /> +250 782 995 950
            </a>
            <a href="mailto:Mazimpakastrong@gmail.com" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" /> Mazimpakastrong@gmail.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Kanombe, Kigali, Rwanda
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} Strong Peak Adventures. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
