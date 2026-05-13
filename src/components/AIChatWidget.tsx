import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Star, Shield, BadgeCheck, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { generateResponse, createInitialProfile, type ChatResponse, type UserProfile, type ServiceCard } from "@/lib/chatEngine";
import type { RwandaService, ServiceBundle } from "@/data/rwandaServices";

type Msg = {
  role: "user" | "assistant";
  content: string;
  cards?: ServiceCard[];
  bundles?: ServiceBundle[];
  followUp?: string;
  scamWarning?: string;
  sponsored?: boolean;
  links?: { label: string; to: string }[];
};

const INITIAL_MSG: Msg = {
  role: "assistant",
  content: "Hello! 👋 I am Zuba, your Rwanda travel expert. Tell me what you're looking for and I'll find the best verified options for you!",
  links: [
    { label: "🏨 Hotels", to: "/hotels" },
    { label: "✈️ Flights", to: "/flights" },
    { label: "🦍 Activities", to: "/activities" },
    { label: "🚗 Airport Assist", to: "/airport-assist" },
  ],
};

const SUGGESTIONS = [
  "Affordable hotels near Kigali airport",
  "Plan a gorilla trekking trip",
  "Luxury honeymoon in Rwanda",
  "Family safari activities",
];

// ─── BOOKING HELPERS ───
import { logBooking } from "@/lib/bookingLog";

const buildWhatsApp = (item: string, price?: string) =>
  `https://wa.me/250782995950?text=${encodeURIComponent(
    `Hello Strong Peak Adventures! I'd like to book: ${item}${price ? ` (${price})` : ""}. Please share availability and next steps.`
  )}`;

const buildEmail = (item: string, price?: string) =>
  `mailto:Mazimpakastrong@gmail.com?subject=${encodeURIComponent(`Booking Request: ${item}`)}&body=${encodeURIComponent(
    `Hello Strong Peak Adventures,\n\nI would like to book the following:\n\nItem: ${item}${price ? `\nPrice: ${price}` : ""}\n\nPreferred date(s): \nNumber of people: \nAdditional notes: \n\nThank you!`
  )}`;

const trackBooking = (channel: "whatsapp" | "email", item: string, priceNum?: number) => {
  logBooking({
    itemType: "hotel",
    itemName: item,
    itemPrice: priceNum,
    customerName: "Chat visitor",
    channel,
    notes: "Initiated from AI chat widget",
  });
};

// ─── SERVICE CARD COMPONENT ───

const ServiceCardUI = ({ card }: { card: ServiceCard; onBook: (route: string) => void }) => {
  const { service, upsell } = card;
  const itemLabel = `${service.name} — ${service.location}`;
  const priceLabel = `$${service.price} ${service.currency}/night`;
  return (
    <div className="bg-background border border-border rounded-xl p-3 space-y-2 text-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-base">{service.imageEmoji}</span>
            <span className="font-semibold text-foreground text-sm truncate">{service.name}</span>
            {service.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
            {service.sponsored && (
              <span className="text-[10px] bg-accent/50 text-accent-foreground px-1.5 py-0.5 rounded-full">Promoted</span>
            )}
          </div>
          <p className="text-muted-foreground truncate">{service.location}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-primary text-sm">${service.price}</p>
          <p className="text-muted-foreground">{service.currency}/night</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{service.rating}</span>
          <span className="text-muted-foreground">({service.reviewCount})</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
          service.priceRange === "budget" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          service.priceRange === "mid-range" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
        }`}>
          {service.priceRange}
        </span>
      </div>

      <p className="text-muted-foreground line-clamp-2">{service.description}</p>

      <div className="flex gap-1 flex-wrap">
        {service.highlights.slice(0, 3).map((h) => (
          <span key={h} className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">{h}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <a
          href={buildWhatsApp(itemLabel, priceLabel)}
          onClick={() => trackBooking("whatsapp", itemLabel, service.price)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-primary text-primary-foreground text-xs font-medium py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-center"
        >
          WhatsApp
        </a>
        <a
          href={buildEmail(itemLabel, priceLabel)}
          onClick={() => trackBooking("email", itemLabel, service.price)}
          className="flex-1 border border-border text-foreground text-xs font-medium py-1.5 rounded-lg hover:bg-muted transition-colors text-center"
        >
          Email
        </a>
      </div>

      {upsell && (
        <div className="bg-accent/30 border border-accent/50 rounded-lg p-2 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground">Upgrade for +${upsell.price - service.price}</p>
            <p className="text-xs font-medium text-foreground truncate">{upsell.name} ⭐{upsell.rating}</p>
          </div>
          <a
            href={buildWhatsApp(`${upsell.name} — ${upsell.location}`, `$${upsell.price} ${upsell.currency}/night`)}
            onClick={() => trackBooking("whatsapp", `${upsell.name} — ${upsell.location}`, upsell.price)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-primary font-medium hover:underline flex-shrink-0"
          >
            Upgrade →
          </a>
        </div>
      )}
    </div>
  );
};

// ─── BUNDLE CARD ───

const BundleCard = ({ bundle }: { bundle: ServiceBundle; onBook: () => void }) => {
  const itemLabel = `Bundle: ${bundle.name}`;
  const priceLabel = `$${bundle.bundlePrice} total (Save $${bundle.savings})`;
  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/10 border border-primary/20 rounded-xl p-3 space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground text-sm">📦 {bundle.name}</span>
        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
          Save ${bundle.savings}
        </span>
      </div>
      <p className="text-muted-foreground">{bundle.description}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="font-bold text-primary text-sm">${bundle.bundlePrice} total</span>
        <div className="flex gap-1.5">
          <a
            href={buildWhatsApp(itemLabel, priceLabel)}
            onClick={() => trackBooking("whatsapp", itemLabel, bundle.bundlePrice)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={buildEmail(itemLabel, priceLabel)}
            onClick={() => trackBooking("email", itemLabel, bundle.bundlePrice)}
            className="border border-border text-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN WIDGET ───

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [profile] = useState<UserProfile>(() => createInitialProfile());
  const endRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = generateResponse(text, profile);
      const assistantMsg: Msg = {
        role: "assistant",
        content: response.content,
        cards: response.cards,
        bundles: response.bundles,
        followUp: response.followUp,
        scamWarning: response.scamWarning,
        sponsored: response.sponsored,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setTyping(false);
    }, 5000);
  };

  const handleNav = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Chat with Online Agent"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm">Zuba — Travel Expert</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs text-primary-foreground/70">Online • Verified AI Assistant</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-foreground/50" />
                <button onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i}>
                  {/* Scam Warning */}
                  {m.scamWarning && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-2 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                      <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>{m.scamWarning}</p>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                    {m.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}>
                      {m.content}
                    </div>
                    {m.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-secondary" />
                      </div>
                    )}
                  </div>

                  {/* Follow-up question */}
                  {m.followUp && (
                    <div className="ml-9 mt-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 whitespace-pre-line">
                      {m.followUp}
                    </div>
                  )}

                  {/* Quick links */}
                  {m.links && m.links.length > 0 && (
                    <div className="ml-9 mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((link) => (
                        <button key={link.to} onClick={() => handleNav(link.to)}
                          className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-full border border-primary/20 transition-colors">
                          {link.label} →
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Service Cards */}
                  {m.cards && m.cards.length > 0 && (
                    <div className="ml-9 mt-2 space-y-2">
                      {m.sponsored && (
                        <p className="text-[10px] text-muted-foreground">Includes promoted results</p>
                      )}
                      {m.cards.map((card) => (
                        <ServiceCardUI key={card.service.id} card={card} onBook={handleNav} />
                      ))}
                    </div>
                  )}

                  {/* Bundle Cards */}
                  {m.bundles && m.bundles.length > 0 && (
                    <div className="ml-9 mt-2 space-y-2">
                      {m.bundles.map((b) => (
                        <BundleCard key={b.id} bundle={b} onBook={() => handleNav("/contact")} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2 text-sm text-muted-foreground flex items-center gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs bg-muted hover:bg-primary/10 text-foreground px-3 py-1.5 rounded-full border border-border transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2 flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about hotels, activities, budget…"
                className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button size="icon" onClick={() => send(input)} className="rounded-full bg-primary text-primary-foreground h-9 w-9">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
