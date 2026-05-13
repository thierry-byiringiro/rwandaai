// Rwanda Travel Smart Marketplace — Local Services Database

export type ServiceCategory = "hotel" | "activity" | "transport" | "flight";
export type PriceRange = "budget" | "mid-range" | "luxury";
export type TripPurpose = "tourism" | "business" | "honeymoon" | "adventure" | "family";

export interface RwandaService {
  id: string;
  name: string;
  category: ServiceCategory;
  location: string;
  region: "kigali" | "musanze" | "rubavu" | "huye" | "nyungwe" | "akagera" | "karongi";
  price: number;
  currency: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  verified: boolean;
  featured: boolean;
  sponsored: boolean;
  available: boolean;
  suitableFor: TripPurpose[];
  nearAirport: boolean;
  imageEmoji: string;
  bookingRoute: string;
}

export interface ServiceBundle {
  id: string;
  name: string;
  services: string[]; // service IDs
  bundlePrice: number;
  savings: number;
  description: string;
}

export const SERVICES: RwandaService[] = [
  // ─── HOTELS ───
  {
    id: "h1", name: "Kigali Marriott Hotel", category: "hotel", location: "Kigali City Center",
    region: "kigali", price: 220, currency: "USD", priceRange: "luxury", rating: 4.8, reviewCount: 342,
    description: "5-star luxury in the heart of Kigali with rooftop pool and spa.",
    highlights: ["Rooftop pool", "Spa", "City views", "Business center"],
    verified: true, featured: true, sponsored: false, available: true,
    suitableFor: ["business", "honeymoon", "tourism"], nearAirport: false,
    imageEmoji: "🏨", bookingRoute: "/hotels",
  },
  {
    id: "h2", name: "Radisson Blu Kigali", category: "hotel", location: "Kigali Convention Centre",
    region: "kigali", price: 180, currency: "USD", priceRange: "luxury", rating: 4.7, reviewCount: 289,
    description: "Premium hotel connected to Kigali Convention Centre.",
    highlights: ["Convention access", "Fitness center", "Fine dining"],
    verified: true, featured: false, sponsored: true, available: true,
    suitableFor: ["business", "tourism"], nearAirport: false,
    imageEmoji: "🏨", bookingRoute: "/hotels",
  },
  {
    id: "h3", name: "The Retreat by Heaven", category: "hotel", location: "Kiyovu, Kigali",
    region: "kigali", price: 150, currency: "USD", priceRange: "mid-range", rating: 4.6, reviewCount: 198,
    description: "Boutique eco-friendly hotel with organic restaurant.",
    highlights: ["Eco-friendly", "Organic meals", "Garden terrace"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "honeymoon"], nearAirport: false,
    imageEmoji: "🌿", bookingRoute: "/hotels",
  },
  {
    id: "h4", name: "Urban by CityBlue", category: "hotel", location: "Near Kigali Airport",
    region: "kigali", price: 75, currency: "USD", priceRange: "budget", rating: 4.2, reviewCount: 156,
    description: "Affordable modern hotel, 10 min from Kigali International Airport.",
    highlights: ["Airport shuttle", "Free WiFi", "24h reception"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["business", "tourism"], nearAirport: true,
    imageEmoji: "✈️", bookingRoute: "/hotels",
  },
  {
    id: "h5", name: "Gorilla's Nest Lodge", category: "hotel", location: "Kinigi, Musanze",
    region: "musanze", price: 280, currency: "USD", priceRange: "luxury", rating: 4.9, reviewCount: 187,
    description: "Luxury lodge at the foothills of Volcanoes National Park.",
    highlights: ["Volcano views", "Gorilla trek proximity", "Fireplace suites"],
    verified: true, featured: true, sponsored: false, available: true,
    suitableFor: ["tourism", "honeymoon", "adventure"], nearAirport: false,
    imageEmoji: "🦍", bookingRoute: "/hotels",
  },
  {
    id: "h6", name: "Lake Kivu Serena Hotel", category: "hotel", location: "Rubavu Lakefront",
    region: "rubavu", price: 200, currency: "USD", priceRange: "luxury", rating: 4.7, reviewCount: 221,
    description: "Lakefront luxury with stunning Lake Kivu views.",
    highlights: ["Lake views", "Beach access", "Water sports"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "honeymoon", "family"], nearAirport: false,
    imageEmoji: "🌊", bookingRoute: "/hotels",
  },
  {
    id: "h7", name: "Discover Rwanda Youth Hostel", category: "hotel", location: "Kigali Center",
    region: "kigali", price: 25, currency: "USD", priceRange: "budget", rating: 4.0, reviewCount: 312,
    description: "Popular backpacker hostel with great social atmosphere.",
    highlights: ["Dormitory & private rooms", "Common area", "Travel desk"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "adventure"], nearAirport: false,
    imageEmoji: "🎒", bookingRoute: "/hotels",
  },
  {
    id: "h8", name: "Nyungwe House", category: "hotel", location: "Nyungwe Forest Edge",
    region: "nyungwe", price: 350, currency: "USD", priceRange: "luxury", rating: 4.9, reviewCount: 95,
    description: "Exclusive tea plantation lodge bordering Nyungwe Forest.",
    highlights: ["Tea plantation", "Chimpanzee trekking", "Canopy walk nearby"],
    verified: true, featured: true, sponsored: false, available: true,
    suitableFor: ["tourism", "honeymoon", "adventure"], nearAirport: false,
    imageEmoji: "🌳", bookingRoute: "/hotels",
  },

  // ─── ACTIVITIES ───
  {
    id: "a1", name: "Gorilla Trekking Experience", category: "activity", location: "Volcanoes National Park",
    region: "musanze", price: 1500, currency: "USD", priceRange: "luxury", rating: 5.0, reviewCount: 523,
    description: "Once-in-a-lifetime encounter with mountain gorillas in their natural habitat.",
    highlights: ["1-hour gorilla encounter", "Expert guides", "Small groups", "Permit included"],
    verified: true, featured: true, sponsored: false, available: true,
    suitableFor: ["tourism", "adventure", "honeymoon"], nearAirport: false,
    imageEmoji: "🦍", bookingRoute: "/activities",
  },
  {
    id: "a2", name: "Akagera Safari Game Drive", category: "activity", location: "Akagera National Park",
    region: "akagera", price: 120, currency: "USD", priceRange: "mid-range", rating: 4.7, reviewCount: 289,
    description: "Full-day safari with Big Five spotting opportunities.",
    highlights: ["Big Five animals", "Lake Ihema boat trip", "Professional guide"],
    verified: true, featured: true, sponsored: false, available: true,
    suitableFor: ["tourism", "family", "adventure"], nearAirport: false,
    imageEmoji: "🦁", bookingRoute: "/activities",
  },
  {
    id: "a3", name: "Nyungwe Canopy Walk", category: "activity", location: "Nyungwe Forest",
    region: "nyungwe", price: 60, currency: "USD", priceRange: "mid-range", rating: 4.6, reviewCount: 198,
    description: "Walk suspended 50m above the rainforest floor.",
    highlights: ["Suspension bridge", "Panoramic forest views", "Birdwatching"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "adventure", "family"], nearAirport: false,
    imageEmoji: "🌉", bookingRoute: "/activities",
  },
  {
    id: "a4", name: "Kigali City Cultural Tour", category: "activity", location: "Kigali",
    region: "kigali", price: 45, currency: "USD", priceRange: "budget", rating: 4.5, reviewCount: 167,
    description: "Half-day tour including Genocide Memorial, Nyandungu Eco-Park, markets, and local cuisine.",
    highlights: ["Genocide Memorial", "Nyandungu Eco-Park", "Kimironko Market", "Local food tasting"],
    verified: true, featured: false, sponsored: true, available: true,
    suitableFor: ["tourism", "business", "family"], nearAirport: false,
    imageEmoji: "🏛️", bookingRoute: "/activities",
  },
  {
    id: "a5", name: "Lake Kivu Kayaking Adventure", category: "activity", location: "Karongi/Rubavu",
    region: "rubavu", price: 55, currency: "USD", priceRange: "budget", rating: 4.4, reviewCount: 134,
    description: "Half-day kayaking on one of Africa's Great Lakes.",
    highlights: ["Kayak rental", "Guide", "Island visit", "Scenic views"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "adventure", "honeymoon"], nearAirport: false,
    imageEmoji: "🛶", bookingRoute: "/activities",
  },
  {
    id: "a6", name: "Golden Monkey Trekking", category: "activity", location: "Volcanoes National Park",
    region: "musanze", price: 100, currency: "USD", priceRange: "mid-range", rating: 4.8, reviewCount: 145,
    description: "Track endangered golden monkeys in bamboo forests.",
    highlights: ["Rare species", "Expert trackers", "2-3 hour trek"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "adventure"], nearAirport: false,
    imageEmoji: "🐒", bookingRoute: "/activities",
  },
  {
    id: "a7", name: "Coffee Plantation Tour", category: "activity", location: "Huye",
    region: "huye", price: 35, currency: "USD", priceRange: "budget", rating: 4.3, reviewCount: 88,
    description: "Bean-to-cup experience at a Rwandan coffee cooperative.",
    highlights: ["Coffee roasting", "Farm tour", "Tasting session"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "family"], nearAirport: false,
    imageEmoji: "☕", bookingRoute: "/activities",
  },

  // ─── TRANSPORT ───
  {
    id: "t1", name: "VIP Airport Transfer", category: "transport", location: "Kigali International Airport",
    region: "kigali", price: 45, currency: "USD", priceRange: "mid-range", rating: 4.8, reviewCount: 412,
    description: "Private car with meet & greet at Kigali Airport.",
    highlights: ["Meet & greet", "AC vehicle", "Free WiFi", "24/7 service"],
    verified: true, featured: true, sponsored: false, available: true,
    suitableFor: ["business", "tourism", "honeymoon", "family"], nearAirport: true,
    imageEmoji: "🚗", bookingRoute: "/airport-assist",
  },
  {
    id: "t2", name: "Kigali to Musanze Shuttle", category: "transport", location: "Kigali → Musanze",
    region: "kigali", price: 30, currency: "USD", priceRange: "budget", rating: 4.3, reviewCount: 178,
    description: "Comfortable shuttle to Volcanoes National Park gateway.",
    highlights: ["Daily departures", "3-hour journey", "Hotel pickup"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "adventure"], nearAirport: false,
    imageEmoji: "🚌", bookingRoute: "/airport-assist",
  },
  {
    id: "t3", name: "Self-Drive Car Rental", category: "transport", location: "Kigali",
    region: "kigali", price: 65, currency: "USD", priceRange: "mid-range", rating: 4.1, reviewCount: 93,
    description: "Reliable 4WD SUV rental with GPS and insurance.",
    highlights: ["4WD vehicles", "Full insurance", "GPS included", "Unlimited mileage"],
    verified: true, featured: false, sponsored: true, available: true,
    suitableFor: ["tourism", "adventure", "business"], nearAirport: true,
    imageEmoji: "🚙", bookingRoute: "/airport-assist",
  },

  // ─── FLIGHTS ───
  {
    id: "f1", name: "RwandAir Domestic (Kigali–Kamembe)", category: "flight", location: "Kigali ↔ Cyangugu",
    region: "kigali", price: 150, currency: "USD", priceRange: "mid-range", rating: 4.5, reviewCount: 67,
    description: "45-min domestic flight to western Rwanda near Nyungwe.",
    highlights: ["45 min flight", "Daily service", "Scenic views"],
    verified: true, featured: false, sponsored: false, available: true,
    suitableFor: ["tourism", "business"], nearAirport: true,
    imageEmoji: "✈️", bookingRoute: "/flights",
  },
];

export const BUNDLES: ServiceBundle[] = [
  {
    id: "b1", name: "Ultimate Gorilla Safari Package",
    services: ["h5", "a1", "t2"],
    bundlePrice: 1750, savings: 60,
    description: "3 nights at Gorilla's Nest + Gorilla Trekking + Return Shuttle from Kigali",
  },
  {
    id: "b2", name: "Kigali City Explorer",
    services: ["h3", "a4", "t1"],
    bundlePrice: 220, savings: 20,
    description: "2 nights boutique hotel + City Cultural Tour + Airport Transfer",
  },
  {
    id: "b3", name: "Lake Kivu Romantic Escape",
    services: ["h6", "a5"],
    bundlePrice: 230, savings: 25,
    description: "Lakefront luxury stay + Kayaking Adventure — perfect for couples",
  },
  {
    id: "b4", name: "Rwanda Wildlife Discovery",
    services: ["h5", "a1", "a2", "t2"],
    bundlePrice: 1900, savings: 100,
    description: "Gorilla Trekking + Akagera Safari + Lodge + Shuttle — the ultimate wildlife combo",
  },
];

// ─── SEARCH & FILTER ENGINE ───

export interface SearchCriteria {
  budget?: { min?: number; max?: number };
  category?: ServiceCategory;
  region?: string;
  priceRange?: PriceRange;
  tripPurpose?: TripPurpose;
  nearAirport?: boolean;
  query?: string;
}

export function searchServices(criteria: SearchCriteria): RwandaService[] {
  return SERVICES.filter((s) => {
    if (!s.available) return false;
    if (criteria.category && s.category !== criteria.category) return false;
    if (criteria.region && s.region !== criteria.region) return false;
    if (criteria.priceRange && s.priceRange !== criteria.priceRange) return false;
    if (criteria.nearAirport && !s.nearAirport) return false;
    if (criteria.tripPurpose && !s.suitableFor.includes(criteria.tripPurpose)) return false;
    if (criteria.budget?.max && s.price > criteria.budget.max) return false;
    if (criteria.budget?.min && s.price < criteria.budget.min) return false;
    if (criteria.query) {
      const q = criteria.query.toLowerCase();
      const text = `${s.name} ${s.description} ${s.location} ${s.highlights.join(" ")}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  })
  // Featured & sponsored first, then by rating
  .sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.sponsored !== b.sponsored) return a.sponsored ? -1 : 1;
    return b.rating - a.rating;
  });
}

export function findBundles(serviceIds: string[]): ServiceBundle[] {
  return BUNDLES.filter((b) => b.services.some((sid) => serviceIds.includes(sid)));
}

export function getUpsell(service: RwandaService): RwandaService | null {
  const upgrades = SERVICES.filter(
    (s) => s.category === service.category && s.region === service.region &&
           s.price > service.price && s.price <= service.price * 1.5 && s.available
  ).sort((a, b) => a.price - b.price);
  return upgrades[0] || null;
}
