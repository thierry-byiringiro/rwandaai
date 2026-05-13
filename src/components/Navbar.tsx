import { Link, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Hotels", to: "/hotels" },
  { label: "Flights", to: "/flights" },
  { label: "Activities", to: "/activities" },
  { label: "Airport Assist", to: "/airport-assist" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display text-xl md:text-2xl font-bold text-primary">
          Strong Peak <span className="text-secondary">Adventures</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a href="tel:+250782995950">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Phone className="w-4 h-4" /> Call Us
            </Button>
          </a>
        </div>

        {/* Mobile call button */}
        <a href="tel:+250782995950" className="md:hidden">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 h-9 px-3">
            <Phone className="w-3.5 h-3.5" /> Call
          </Button>
        </a>
      </div>

      {/* Mobile horizontal nav bar - always visible */}
      <div className="md:hidden border-t border-border bg-card/60 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-3 py-2 min-w-max">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                pathname === l.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
