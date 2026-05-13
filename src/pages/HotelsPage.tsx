import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, MapPin, CheckCircle } from "lucide-react";
import BookDialog from "@/components/BookDialog";
import hotelKigali from "@/assets/hotel-kigali.jpg";
import hotelBoutique from "@/assets/hotel-boutique.jpg";
import hotelLakeside from "@/assets/hotel-lakeside.jpg";
import hotelVolcano from "@/assets/hotel-volcano-lodge.jpg";
import hotelBusiness from "@/assets/hotel-business.jpg";
import hotelBudget from "@/assets/hotel-budget.jpg";
import hotelTea from "@/assets/hotel-tea-plantation.jpg";
import hotelMidrange from "@/assets/hotel-midrange.jpg";
import hotelSafari from "@/assets/hotel-safari-lodge.jpg";
import hotelResort from "@/assets/hotel-resort.jpg";
import hotelGuesthouse from "@/assets/hotel-guesthouse.jpg";
import hotelCityModern from "@/assets/hotel-city-modern.jpg";
import hotelEcoLodge from "@/assets/hotel-eco-lodge.jpg";
import hotelLakeResort from "@/assets/hotel-lake-resort.jpg";
import hotelTentedCamp from "@/assets/hotel-tented-camp.jpg";
import hotelHilltop from "@/assets/hotel-hilltop.jpg";
import hotelHeritage from "@/assets/hotel-heritage.jpg";
import hotelRadissonPark from "@/assets/hotel-radisson-park.jpg";
import hotelMusanzeGarden from "@/assets/hotel-musanze-garden.jpg";
import hotelKivuBungalows from "@/assets/hotel-kivu-bungalows.jpg";
import hotelHuyeHills from "@/assets/hotel-huye-hills.jpg";
import hotelNyarutarama from "@/assets/hotel-nyarutarama.jpg";
import hotelAkageraTent from "@/assets/hotel-akagera-tent.jpg";
import hotelNyungweLodge from "@/assets/hotel-nyungwe-lodge.jpg";
import hotelGisenyiPool from "@/assets/hotel-gisenyi-pool.jpg";
import hotelRwamagana from "@/assets/hotel-rwamagana.jpg";
import hotelBusinessLobby from "@/assets/hotel-business-lobby.jpg";

const HOTELS = [
  { name: "Kigali Marriott Hotel", location: "Kigali City Center", price: "$220/night", rating: 4.8, desc: "5-star luxury with rooftop pool, spa, and panoramic city views.", img: hotelKigali, verified: true },
  { name: "Radisson Blu Kigali", location: "Convention Centre", price: "$180/night", rating: 4.7, desc: "Premium hotel connected to Kigali Convention Centre with fine dining.", img: hotelBusiness, verified: true },
  { name: "The Retreat by Heaven", location: "Kiyovu, Kigali", price: "$150/night", rating: 4.6, desc: "Boutique eco-friendly hotel with organic restaurant and garden terrace.", img: hotelBoutique, verified: true },
  { name: "Gorilla's Nest Lodge", location: "Kinigi, Musanze", price: "$280/night", rating: 4.9, desc: "Luxury lodge at the foothills of Volcanoes National Park.", img: hotelVolcano, verified: true },
  { name: "Lake Kivu Serena Hotel", location: "Rubavu Lakefront", price: "$200/night", rating: 4.7, desc: "Lakefront luxury with stunning Lake Kivu views and water sports.", img: hotelLakeside, verified: true },
  { name: "Nyungwe House", location: "Nyungwe Forest Edge", price: "$350/night", rating: 4.9, desc: "Exclusive tea plantation lodge bordering Nyungwe Forest.", img: hotelTea, verified: true },
  { name: "Ubumwe Grande Hotel", location: "Central Kigali", price: "$90/night", rating: 4.4, desc: "Great mid-range option with excellent service and city views.", img: hotelMidrange, verified: true },
  { name: "Urban by CityBlue", location: "Near Kigali Airport", price: "$75/night", rating: 4.2, desc: "Affordable modern hotel, 10 min from Kigali International Airport.", img: hotelCityModern, verified: true },
  { name: "Discover Rwanda Hostel", location: "Kigali Center", price: "$25/night", rating: 4.0, desc: "Popular backpacker hostel with great social atmosphere and travel desk.", img: hotelBudget, verified: true },
  { name: "Akagera Game Lodge", location: "Akagera National Park", price: "$260/night", rating: 4.8, desc: "Safari lodge with infinity pool overlooking the African savanna.", img: hotelSafari, verified: true },
  { name: "Kigali Serena Hotel", location: "Kigali", price: "$250/night", rating: 4.8, desc: "Iconic five-star hotel with world-class amenities and lush gardens.", img: hotelResort, verified: true },
  { name: "Hotel des Mille Collines", location: "Kigali", price: "$130/night", rating: 4.5, desc: "Historic landmark hotel with pool, restaurant, and cultural significance.", img: hotelHeritage, verified: true },
  { name: "Bisate Lodge", location: "Volcanoes National Park", price: "$1,200/night", rating: 5.0, desc: "Ultra-luxury lodge with forest villas, volcanic views, and exclusive gorilla trekking access.", img: hotelHilltop, verified: true },
  { name: "Mantis Kivu Marina Bay", location: "Karongi, Lake Kivu", price: "$190/night", rating: 4.6, desc: "Waterfront resort with marina, beach, and stunning sunset views over Lake Kivu.", img: hotelLakeResort, verified: true },
  { name: "Magashi Camp", location: "Akagera National Park", price: "$850/night", rating: 4.9, desc: "Luxury tented safari camp on Lake Rwanyakazinga with Big Five game viewing.", img: hotelTentedCamp, verified: true },
  { name: "One&Only Nyungwe House", location: "Nyungwe Forest", price: "$600/night", rating: 4.9, desc: "World-class eco-lodge nestled in ancient rainforest with canopy walkway access.", img: hotelEcoLodge, verified: true },
  { name: "Virunga Lodge", location: "Musanze Hills", price: "$450/night", rating: 4.8, desc: "Eco-lodge with panoramic views of the Virunga volcanoes and twin lakes.", img: hotelGuesthouse, verified: true },
  { name: "Park Inn by Radisson", location: "Kigali CBD", price: "$110/night", rating: 4.3, desc: "Modern city hotel with rooftop bar, gym, and business facilities.", img: hotelCityModern, verified: true },
  { name: "Inzu Lodge", location: "Musanze", price: "$85/night", rating: 4.4, desc: "Charming mid-range lodge perfect for gorilla trekking base camp.", img: hotelGuesthouse, verified: true },
  { name: "Cleo Lake Kivu Hotel", location: "Gisenyi, Rubavu", price: "$140/night", rating: 4.5, desc: "Beachfront hotel with pool, restaurant, and private lake access.", img: hotelLakeResort, verified: true },
  { name: "Park Inn Kigali", location: "Kacyiru, Kigali", price: "$120/night", rating: 4.4, desc: "Contemporary hotel with palm-lined entrance, gym, and meeting facilities.", img: hotelRadissonPark, verified: true },
  { name: "Five Volcanoes Boutique", location: "Musanze", price: "$95/night", rating: 4.5, desc: "Cozy brick-built guesthouse with flower gardens, walking distance to volcanoes park HQ.", img: hotelMusanzeGarden, verified: true },
  { name: "Kivu Paradise Bungalows", location: "Kibuye, Lake Kivu", price: "$165/night", rating: 4.7, desc: "Thatched lakefront bungalows on a private deck with sunset views.", img: hotelKivuBungalows, verified: true },
  { name: "Huye Hilltop Hotel", location: "Huye (Butare)", price: "$130/night", rating: 4.5, desc: "Boutique hilltop retreat with infinity pool and sweeping mountain panoramas.", img: hotelHuyeHills, verified: true },
  { name: "Nyarutarama Suites", location: "Nyarutarama, Kigali", price: "$140/night", rating: 4.6, desc: "Stylish serviced apartments with leafy courtyard near the golf course.", img: hotelNyarutarama, verified: true },
  { name: "Karenge Bush Camp", location: "Akagera National Park", price: "$320/night", rating: 4.7, desc: "Authentic safari tents with lantern-lit interiors and savanna sunrise views.", img: hotelAkageraTent, verified: true },
  { name: "Emeraude Kivu Resort", location: "Kibuye, Lake Kivu", price: "$175/night", rating: 4.6, desc: "Lakeside resort with private beach, kayaks, and traditional Rwandan cuisine.", img: hotelGisenyiPool, verified: true },
  { name: "Gisakura Family Hostel", location: "Nyungwe (Rusizi)", price: "$55/night", rating: 4.3, desc: "Warm forest lodge with stone fireplace, ideal base for chimp trekking.", img: hotelNyungweLodge, verified: true },
  { name: "Dereva Hotel Rwamagana", location: "Rwamagana, Eastern Province", price: "$70/night", rating: 4.2, desc: "Welcoming budget-friendly hotel halfway between Kigali and Akagera.", img: hotelRwamagana, verified: true },
  { name: "M Hotel Kigali", location: "Nyarugenge, Kigali", price: "$160/night", rating: 4.6, desc: "Elegant downtown business hotel with grand marble lobby and rooftop dining.", img: hotelBusinessLobby, verified: true },
];

const buildWhatsApp = (hotel: string) =>
  `https://wa.me/250782995950?text=${encodeURIComponent(`Hello! I'd like to book ${hotel}. Please share availability and pricing.`)}`;
const buildEmail = (hotel: string) =>
  `mailto:Mazimpakastrong@gmail.com?subject=${encodeURIComponent(`Hotel Booking: ${hotel}`)}&body=${encodeURIComponent(`Hello,\n\nI'm interested in booking ${hotel}. Please share availability.\n\nThank you.`)}`;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type DisplayHotel = { name: string; location: string; price: string; rating: number; desc: string; img: string; verified: boolean; priceNum?: number | null };

const HotelsPage = () => {
  const [items, setItems] = useState<DisplayHotel[]>(HOTELS);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("hotels")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setItems(
          data.map((h: any) => ({
            name: h.name,
            location: h.location ?? "",
            price: h.price_per_night ? `$${h.price_per_night}/night` : "Contact for price",
            rating: Number(h.rating ?? 4.5),
            desc: h.description ?? "",
            img: h.image_url || hotelKigali,
            verified: true,
            priceNum: h.price_per_night,
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
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Hotels in Rwanda</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">From luxury lodges to cozy boutique hotels — find your perfect stay.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((h, i) => (
              <motion.div
                key={h.name + i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow group"
              >
                <div className="relative">
                  <img src={h.img} alt={h.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width={384} height={128} />
                  {h.verified && (
                    <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-display text-sm font-semibold text-foreground truncate">{h.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{h.location}</span>
                    <span className="flex items-center gap-0.5 ml-auto text-amber-500"><Star className="w-3 h-3 fill-amber-500" />{h.rating}</span>
                  </div>
                  <p className="text-xs font-semibold text-secondary mt-1">{h.price}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{h.desc}</p>
                  <div className="mt-3">
                    <BookDialog itemType="hotel" itemName={h.name} itemPrice={h.priceNum ?? null} />
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

export default HotelsPage;
