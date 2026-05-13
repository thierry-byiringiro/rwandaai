// Smart AI Chat Engine — Intent Analysis, Personalization, Anti-Scam, Monetization

import {
  SERVICES, BUNDLES, searchServices, findBundles, getUpsell,
  type RwandaService, type SearchCriteria, type ServiceBundle,
  type TripPurpose, type PriceRange,
} from "@/data/rwandaServices";

// ─── TYPES ───

export interface ServiceCard {
  service: RwandaService;
  upsell?: RwandaService;
}

export interface ChatResponse {
  content: string;
  cards: ServiceCard[];
  bundles: ServiceBundle[];
  followUp?: string;
  scamWarning?: string;
  sponsored?: boolean;
}

export interface UserProfile {
  budget?: PriceRange;
  budgetMax?: number;
  tripPurpose?: TripPurpose;
  region?: string;
  groupSize?: number;
  interests: string[];
  messageCount: number;
}

// ─── INTENT DETECTION ───

interface DetectedIntent {
  categories: SearchCriteria["category"][];
  region?: string;
  priceRange?: PriceRange;
  tripPurpose?: TripPurpose;
  nearAirport: boolean;
  budgetMax?: number;
  keywords: string[];
}

const REGION_MAP: Record<string, string> = {
  kigali: "kigali", city: "kigali",
  musanze: "musanze", volcanoes: "musanze", volcano: "musanze",
  rubavu: "rubavu", gisenyi: "rubavu", kivu: "rubavu",
  huye: "huye", butare: "huye",
  nyungwe: "nyungwe",
  akagera: "akagera",
  karongi: "karongi",
};

const SCAM_PATTERNS = [
  /pay\s*(me|us)?\s*(via|through|on)\s*(whatsapp|telegram|mpesa|western\s*union|momo|cash)/i,
  /send\s*money\s*(to|via|through)/i,
  /\b(western\s*union|moneygram|bitcoin|crypto|wire\s*transfer)\b/i,
  /only\s*\$?\d+.*too\s*good/i,
  /act\s*(now|fast|quick|immediately)/i,
  /limited\s*time\s*only/i,
  /direct\s*payment\s*outside/i,
  /pay\s*before\s*(you|arrival|booking)/i,
  /don'?t\s*use\s*(the\s*)?(platform|website|app)/i,
];

function detectIntent(msg: string, profile: UserProfile): DetectedIntent {
  const lower = msg.toLowerCase();
  const intent: DetectedIntent = { categories: [], nearAirport: false, keywords: [] };

  // Category detection
  if (/hotel|stay|sleep|accommodation|lodge|hostel|room/i.test(lower)) intent.categories.push("hotel");
  if (/activit|trek|safari|tour|hike|kayak|canopy|coffee|cultur|monkey|gorilla/i.test(lower)) intent.categories.push("activity");
  if (/transport|car|shuttle|driver|rental|ride|pickup|drop/i.test(lower)) intent.categories.push("transport");
  if (/flight|fly|plane|airline|domestic/i.test(lower)) intent.categories.push("flight");
  if (/airport|arrival|landing/i.test(lower)) intent.nearAirport = true;

  // Region detection
  for (const [keyword, region] of Object.entries(REGION_MAP)) {
    if (lower.includes(keyword)) { intent.region = region; break; }
  }

  // Budget detection
  const priceMatch = lower.match(/\$(\d+)/);
  if (priceMatch) intent.budgetMax = parseInt(priceMatch[1]);
  if (/cheap|budget|affordable|low\s*cost|backpack/i.test(lower)) intent.priceRange = "budget";
  if (/mid|moderate|reasonable/i.test(lower)) intent.priceRange = "mid-range";
  if (/luxury|premium|high\s*end|5\s*star|exclusive|vip/i.test(lower)) intent.priceRange = "luxury";

  // Trip purpose
  if (/business|conference|meeting|work/i.test(lower)) intent.tripPurpose = "business";
  if (/honeymoon|romantic|couple|anniversary|wedding/i.test(lower)) intent.tripPurpose = "honeymoon";
  if (/adventure|trek|hike|wild|extreme/i.test(lower)) intent.tripPurpose = "adventure";
  if (/family|kids|children|group/i.test(lower)) intent.tripPurpose = "family";
  if (/touris|visit|explore|sightsee|vacation|holiday/i.test(lower)) intent.tripPurpose = "tourism";

  return intent;
}

function detectScam(msg: string): string | undefined {
  for (const pattern of SCAM_PATTERNS) {
    if (pattern.test(msg)) {
      return "⚠️ Safety Alert: This message contains language associated with potential scams. We strongly recommend keeping all transactions within our secure platform. Never send money via WhatsApp, Western Union, or cryptocurrency to unverified parties.";
    }
  }
  return undefined;
}

// ─── MAIN RESPONSE GENERATOR ───

export function generateResponse(msg: string, profile: UserProfile): ChatResponse {
  const scamWarning = detectScam(msg);
  const intent = detectIntent(msg, profile);

  // Update profile from intent
  if (intent.priceRange) profile.budget = intent.priceRange;
  if (intent.budgetMax) profile.budgetMax = intent.budgetMax;
  if (intent.tripPurpose) profile.tripPurpose = intent.tripPurpose;
  if (intent.region) profile.region = intent.region;
  profile.messageCount++;

  // If no clear category, ask follow-up
  if (intent.categories.length === 0 && !intent.region && !intent.tripPurpose) {
    // Check for greetings
    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|sup)/i.test(msg.trim())) {
      return {
        content: "Hello! 👋 Welcome to Rwanda's Smart Travel Marketplace. I'm Zuba, your travel expert.\n\nWhat brings you to Rwanda? I can help with:",
        cards: [],
        bundles: [],
        followUp: "Tell me about your trip — where you'd like to go, your budget, or what experiences interest you!",
        scamWarning,
      };
    }

    // Generic — ask for more info
    return {
      content: "I'd love to help you find the perfect experience! 🇷🇼\n\nTo give you the best recommendations, could you tell me:",
      cards: [],
      bundles: [],
      followUp: "• What type of service? (hotel, activity, transport)\n• Your budget range?\n• Which region interests you? (Kigali, Musanze, Rubavu, Nyungwe)\n• Trip purpose? (tourism, business, honeymoon, adventure)",
      scamWarning,
    };
  }

  // Build search criteria
  const criteria: SearchCriteria = {
    region: intent.region || profile.region,
    priceRange: intent.priceRange || profile.budget,
    tripPurpose: intent.tripPurpose || profile.tripPurpose,
    nearAirport: intent.nearAirport,
    budget: intent.budgetMax ? { max: intent.budgetMax } : undefined,
  };

  // Search per category, or all if no category specified
  const categories = intent.categories.length > 0 ? intent.categories : (["hotel", "activity", "transport"] as const);
  let results: RwandaService[] = [];
  for (const cat of categories) {
    results.push(...searchServices({ ...criteria, category: cat }).slice(0, 3));
  }

  // Deduplicate
  results = [...new Map(results.map(r => [r.id, r])).values()].slice(0, 5);

  if (results.length === 0) {
    // Try relaxed search
    const relaxed = searchServices({ category: categories[0] }).slice(0, 3);
    const regionLabel = intent.region || "your criteria";
    return {
      content: `I couldn't find exact matches for ${regionLabel}, but here are some great alternatives:`,
      cards: relaxed.map(s => ({ service: s, upsell: undefined })),
      bundles: [],
      followUp: "Would you like me to search with different criteria? Try adjusting your budget or region.",
      scamWarning,
    };
  }

  // Build cards with upsells
  const cards: ServiceCard[] = results.map(s => ({
    service: s,
    upsell: s.priceRange !== "luxury" ? getUpsell(s) || undefined : undefined,
  }));

  // Find relevant bundles
  const serviceIds = results.map(r => r.id);
  const bundles = findBundles(serviceIds).slice(0, 2);

  // Build content message
  const hasSponsor = results.some(r => r.sponsored);
  let content = buildResponseText(intent, results, profile);

  let followUp: string | undefined;
  if (profile.messageCount <= 2) {
    followUp = "Want me to narrow these down? Tell me your budget, travel dates, or group size!";
  } else if (bundles.length > 0) {
    followUp = "💡 I've also found some money-saving bundle packages below!";
  }

  return { content, cards, bundles, followUp, scamWarning, sponsored: hasSponsor };
}

function buildResponseText(intent: DetectedIntent, results: RwandaService[], profile: UserProfile): string {
  const count = results.length;
  const regionName = intent.region ? intent.region.charAt(0).toUpperCase() + intent.region.slice(1) : "Rwanda";
  const purposeLabel = intent.tripPurpose || profile.tripPurpose;

  let greeting = "";
  if (purposeLabel === "honeymoon") greeting = "💕 Here are romantic picks for you";
  else if (purposeLabel === "business") greeting = "💼 Here are top business-friendly options";
  else if (purposeLabel === "adventure") greeting = "🧗 Here are thrilling adventures for you";
  else if (purposeLabel === "family") greeting = "👨‍👩‍👧‍👦 Great family-friendly options";
  else greeting = `🌟 Here are my top ${count} picks`;

  const priceNote = intent.priceRange === "budget"
    ? " within your budget"
    : intent.budgetMax
    ? ` under $${intent.budgetMax}`
    : "";

  return `${greeting} in ${regionName}${priceNote}:`;
}

export function createInitialProfile(): UserProfile {
  return { interests: [], messageCount: 0 };
}
