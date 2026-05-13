import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Star, Car, CheckCircle } from "lucide-react";
import BookDialog from "@/components/BookDialog";
import gorillaImg from "@/assets/gorilla-trekking.jpg";
import nyungweImg from "@/assets/nyungwe-forest.jpg";
import kigaliImg from "@/assets/kigali-city.jpg";
import lakeKivuImg from "@/assets/activity-lake-kivu.jpg";
import safariImg from "@/assets/activity-safari.jpg";
import culturalImg from "@/assets/activity-cultural.jpg";
import coffeeImg from "@/assets/activity-coffee.jpg";
import kayakImg from "@/assets/activity-kayaking.jpg";
import volcanoImg from "@/assets/activity-volcano-hike.jpg";
import bigogweImg from "@/assets/activity-bigogwe.jpg";
import birdingImg from "@/assets/activity-birding.jpg";
import chimpsImg from "@/assets/activity-chimps.jpg";

const ACTIVITIES = [
  {
    title: "Gorilla Trekking",
    location: "Volcanoes National Park",
    price: "From $1,500",
    rating: 5.0,
    desc: "Get up close with endangered mountain gorillas in their natural habitat — a once-in-a-lifetime experience.",
    img: gorillaImg,
    transport: "Private 4x4 from Kigali to Musanze (3h drive included)",
  },
  {
    title: "Akagera Safari Game Drive",
    location: "Akagera National Park",
    price: "From $120",
    rating: 4.7,
    desc: "Full-day safari with Big Five spotting — lions, elephants, rhinos, buffalo, and leopards in East Africa's largest protected wetland.",
    img: safariImg,
    transport: "Private safari vehicle with expert driver-guide provided",
  },
  {
    title: "Nyungwe Forest Canopy Walk",
    location: "Nyungwe National Park",
    price: "From $60",
    rating: 4.6,
    desc: "Walk 50 meters above the forest floor on a suspension bridge through ancient rainforest with breathtaking panoramic views.",
    img: nyungweImg,
    transport: "Comfortable minibus or private car from Kigali (5h) or Huye (2h)",
  },
  {
    title: "Chimpanzee Trekking",
    location: "Nyungwe Forest",
    price: "From $90",
    rating: 4.8,
    desc: "Track habituated chimpanzees through dense rainforest — hear their calls echo through the canopy as you approach.",
    img: chimpsImg,
    transport: "Private transport from Kigali or Huye with hotel pickup",
  },
  {
    title: "Lake Kivu Boat Cruise",
    location: "Rubavu / Karongi",
    price: "From $80",
    rating: 4.5,
    desc: "Cruise the serene waters of Lake Kivu, visit Napoleon Island, and enjoy stunning sunset views over the Congo mountains.",
    img: lakeKivuImg,
    transport: "Private car or shuttle from Kigali to Rubavu (3h drive)",
  },
  {
    title: "Lake Kivu Kayaking Adventure",
    location: "Rubavu / Karongi",
    price: "From $55",
    rating: 4.4,
    desc: "Half-day kayaking on one of Africa's Great Lakes — paddle to islands, explore hidden coves, and enjoy scenic views.",
    img: kayakImg,
    transport: "Private transfer to lakeside launch point included",
  },
  {
    title: "Golden Monkey Tracking",
    location: "Volcanoes National Park",
    price: "From $100",
    rating: 4.8,
    desc: "Track playful golden monkeys through bamboo forests at the foot of the Virunga volcanoes — a rare species found only here.",
    img: gorillaImg,
    transport: "Private 4x4 vehicle from Kigali or Musanze hotel pickup",
  },
  {
    title: "Volcano Hiking (Mt. Bisoke)",
    location: "Volcanoes National Park",
    price: "From $75",
    rating: 4.7,
    desc: "Hike to the crater lake atop Mt. Bisoke (3,711m) — stunning views of the Virunga chain and surrounding landscapes.",
    img: volcanoImg,
    transport: "4x4 transfer to park headquarters with packed lunch",
  },
  {
    title: "Kigali City Cultural Tour",
    location: "Kigali",
    price: "From $45",
    rating: 4.5,
    desc: "Half-day tour including the Genocide Memorial, Nyandungu Eco-Park, Kimironko Market, local art galleries, and authentic Rwandan cuisine tasting.",
    img: kigaliImg,
    transport: "Air-conditioned city tour vehicle with local guide",
  },
  {
    title: "Cultural Village Experience",
    location: "Musanze / Huye",
    price: "From $30",
    rating: 4.3,
    desc: "Immerse yourself in traditional Rwandan culture — Intore dance performances, banana beer brewing, and artisan crafts.",
    img: culturalImg,
    transport: "Private car or shared shuttle from nearest city center",
  },
  {
    title: "Coffee Plantation Tour",
    location: "Huye / Kigali Region",
    price: "From $35",
    rating: 4.3,
    desc: "Bean-to-cup experience at a Rwandan coffee cooperative — pick, roast, and taste some of Africa's finest Arabica coffee.",
    img: coffeeImg,
    transport: "Private vehicle to plantation with scenic countryside drive",
  },
  {
    title: "Bird Watching Safari",
    location: "Nyungwe / Akagera",
    price: "From $50",
    rating: 4.4,
    desc: "Rwanda hosts 700+ bird species — spot rare Albertine Rift endemics, shoebills, and vibrant sunbirds with expert guides.",
    img: birdingImg,
    transport: "Private transport with birding guide and binoculars provided",
  },
  {
    title: "Bigogwe Village Tour",
    location: "Bigogwe, Nyabihu",
    price: "From $40",
    rating: 4.5,
    desc: "Explore the scenic Bigogwe highlands — rolling green hills, local farms, cultural encounters, and stunning views of the Virunga volcanoes.",
    img: bigogweImg,
    transport: "Private Rwanda Explorer vehicle from Kigali or Musanze with guide",
  },
];

const buildWhatsApp = (activity: string) =>
  `https://wa.me/250782995950?text=${encodeURIComponent(`Hello! I'm interested in ${activity}. Please share details and availability.`)}`;
const buildEmail = (activity: string) =>
  `mailto:Mazimpakastrong@gmail.com?subject=${encodeURIComponent(`Activity Booking: ${activity}`)}&body=${encodeURIComponent(`Hello,\n\nI'm interested in booking ${activity}. Please share availability and pricing.\n\nThank you.`)}`;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type DisplayActivity = { title: string; location: string; price: string; rating: number; desc: string; img: string; transport: string; priceNum?: number | null };

const ActivitiesPage = () => {
  const [items, setItems] = useState<DisplayActivity[]>(
    ACTIVITIES.map((a) => ({ ...a }))
  );

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activities")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setItems(
          data.map((a: any) => ({
            title: a.name,
            location: a.location ?? "",
            price: a.price ? `From $${a.price}` : "Contact for price",
            rating: Number(a.rating ?? 4.8),
            desc: a.description ?? "",
            img: a.image_url || gorillaImg,
            transport: a.duration ? `Duration: ${a.duration} · Private transport included` : "Private transport included",
            priceNum: a.price,
          }))
        );
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-24 pb-20 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Tourism Activities in Rwanda</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Discover the best experiences Rwanda has to offer — all with private transport included.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((a, i) => (
              <motion.div
                key={a.title + i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={384}
                    height={128}
                  />
                  <span className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {a.price}
                  </span>
                  <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-display text-sm font-semibold text-foreground truncate">{a.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{a.location}</span>
                    <span className="flex items-center gap-0.5 ml-auto text-amber-500"><Star className="w-3 h-3 fill-amber-500" />{a.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.desc}</p>

                  <div className="mt-2 bg-accent/50 rounded-lg px-2 py-1.5 flex items-start gap-1.5">
                    <Car className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-primary">Strong Peak Adventures Transport</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{a.transport}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <BookDialog itemType="activity" itemName={a.title} itemPrice={a.priceNum ?? null} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
