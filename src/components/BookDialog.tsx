import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { logBooking } from "@/lib/bookingLog";
import { Loader2, Mail, MessageCircle, Send } from "lucide-react";

type ItemType = "hotel" | "activity" | "flight" | "airport_assist" | "bundle";
type Channel = "form" | "whatsapp" | "email";

type Props = {
  itemType: ItemType;
  itemName: string;
  itemPrice?: number | null;
  trigger?: React.ReactNode;
  buildMessage?: () => string;
};

const PHONE = "250782995950";
const EMAIL = "Mazimpakastrong@gmail.com";

const BookDialog = ({ itemType, itemName, itemPrice, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"choose" | "form">("choose");
  const [channel, setChannel] = useState<Channel>("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", email: "", notes: "" });

  const startBooking = (c: Channel) => {
    setChannel(c);
    setMode("form");
  };

  const buildFullMessage = () => {
    const lines = [
      `Hello! I'd like to book: ${itemName}`,
      itemPrice ? `Listed Price: $${itemPrice}` : null,
      "",
      "--- My Details ---",
      `Name: ${form.name}`,
      `Address: ${form.address}`,
      form.email ? `Email: ${form.email}` : null,
      form.notes ? `\nMessage: ${form.notes}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Please enter your name"); return; }
    if (!form.address.trim()) { toast.error("Please enter your address"); return; }

    setLoading(true);
    await logBooking({
      itemType,
      itemName,
      itemPrice: itemPrice ?? null,
      customerName: form.name,
      customerEmail: form.email || null,
      customerPhone: null,
      channel,
      notes: [form.address && `Address: ${form.address}`, form.notes && `Message: ${form.notes}`].filter(Boolean).join(" · ") || null,
    });
    setLoading(false);

    const msg = buildFullMessage();

    if (channel === "whatsapp") {
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
      toast.success("Opening WhatsApp with your details...");
    } else if (channel === "email") {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Booking: ${itemName}`)}&body=${encodeURIComponent(msg)}`;
      toast.success("Opening email with your details...");
    } else {
      toast.success("Booking request sent! We'll contact you shortly.");
    }

    setForm({ name: "", address: "", email: "", notes: "" });
    setMode("choose");
    setOpen(false);
  };

  const channelLabel = channel === "whatsapp" ? "WhatsApp" : channel === "email" ? "Email" : "Booking";

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setMode("choose"); }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="w-full text-xs h-7 bg-primary text-primary-foreground hover:bg-primary/90">
            Book
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "choose" ? "Book Now" : `Book via ${channelLabel}`}</DialogTitle>
          <DialogDescription className="text-xs">
            {itemName} — {mode === "choose" ? "choose how you'd like to book." : "fill in your details — we'll include them in your message."}
          </DialogDescription>
        </DialogHeader>

        {mode === "choose" ? (
          <div className="space-y-2">
            <Button
              onClick={() => startBooking("form")}
              className="w-full justify-start gap-3 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Send className="w-4 h-4" /> Book Here
            </Button>
            <Button
              onClick={() => startBooking("email")}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <Mail className="w-4 h-4" /> Book by Email
            </Button>
            <Button
              onClick={() => startBooking("whatsapp")}
              className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <MessageCircle className="w-4 h-4" /> Book by WhatsApp
            </Button>
          </div>
        ) : (
          <form onSubmit={submitForm} className="space-y-3">
            <div>
              <Label className="text-xs">Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <Label className="text-xs">Address *</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="City, Country" />
            </div>
            <div>
              <Label className="text-xs">Email{channel === "email" ? " *" : " (optional)"}</Label>
              <Input
                type="email"
                required={channel === "email"}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <Label className="text-xs">Message (optional)</Label>
              <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Dates, guests, special requests..." />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setMode("choose")} className="flex-1">Back</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {channel === "whatsapp" ? "Send via WhatsApp" : channel === "email" ? "Send via Email" : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookDialog;
