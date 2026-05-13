import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface Review {
  name: string;
  from: string;
  text: string;
  rating: number;
}

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: "", from: "", text: "" });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.text.trim()) return;
    setReviews((prev) => [{ ...form, rating }, ...prev]);
    setForm({ name: "", from: "", text: "" });
    setRating(5);
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Share Your Experience</h2>
          <p className="text-muted-foreground">Tell us about your Rwanda adventure — your review helps other travelers!</p>
        </motion.div>

        {/* Submitted Reviews */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {reviews.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.from}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-card rounded-2xl p-6 md:p-8 border border-border"
        >
          <h3 className="font-display text-xl font-semibold text-foreground mb-6">Leave a Review</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Your Name</Label>
                <Input
                  placeholder="e.g. John D."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  placeholder="e.g. USA"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Your Review</Label>
              <Textarea
                placeholder="Share your experience with Strong Peak Adventures…"
                rows={4}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                maxLength={500}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!form.name.trim() || !form.text.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Send className="w-4 h-4" /> Submit Review
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
