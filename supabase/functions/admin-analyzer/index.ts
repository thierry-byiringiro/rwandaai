import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Verify caller is admin
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { question } = await req.json().catch(() => ({ question: "" }));

    // Gather business data
    const [bookingsR, inquiriesR, hotelsR, activitiesR, flightsR] = await Promise.all([
      admin.from("bookings").select("*").order("created_at", { ascending: false }).limit(200),
      admin.from("inquiries").select("*").order("created_at", { ascending: false }).limit(100),
      admin.from("hotels").select("id,name,location,region,price_per_night,rating,available"),
      admin.from("activities").select("id,name,location,region,category,price,rating,available"),
      admin.from("flights").select("id,airline,route,price,available"),
    ]);

    const bookings = bookingsR.data ?? [];
    const inquiries = inquiriesR.data ?? [];
    const hotels = hotelsR.data ?? [];
    const activities = activitiesR.data ?? [];
    const flights = flightsR.data ?? [];

    // Quick stats
    const totalRevenue = bookings.reduce((s, b: any) => s + Number(b.item_price || 0), 0);
    const byStatus = bookings.reduce((acc: Record<string, number>, b: any) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
    const byChannel = bookings.reduce((acc: Record<string, number>, b: any) => {
      const k = b.channel || "unknown";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const byItemType = bookings.reduce((acc: Record<string, number>, b: any) => {
      acc[b.item_type] = (acc[b.item_type] || 0) + 1;
      return acc;
    }, {});

    const topItems: Record<string, number> = {};
    bookings.forEach((b: any) => {
      topItems[b.item_name] = (topItems[b.item_name] || 0) + 1;
    });
    const topItemsList = Object.entries(topItems)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const summary = {
      totals: {
        bookings: bookings.length,
        inquiries: inquiries.length,
        hotels: hotels.length,
        activities: activities.length,
        flights: flights.length,
        estimatedRevenueUSD: totalRevenue,
      },
      bookingsByStatus: byStatus,
      bookingsByChannel: byChannel,
      bookingsByItemType: byItemType,
      topBookedItems: topItemsList,
      recentBookings: bookings.slice(0, 15).map((b: any) => ({
        date: b.created_at,
        item: b.item_name,
        type: b.item_type,
        price: b.item_price,
        status: b.status,
        channel: b.channel,
      })),
      recentInquiries: inquiries.slice(0, 10).map((i: any) => ({
        date: i.created_at,
        name: i.name,
        subject: i.subject,
        status: i.status,
      })),
      catalog: {
        hotels: hotels.length,
        activities: activities.length,
        flights: flights.length,
        unavailableHotels: hotels.filter((h: any) => !h.available).length,
        unavailableActivities: activities.filter((a: any) => !a.available).length,
      },
    };

    const userQ = (question || "").toString().trim();
    const systemPrompt = `You are a senior business analyst for Strong Peak Tourism Rwanda. You receive structured business data (bookings, inquiries, catalog of hotels/activities/flights). Provide a clear, actionable analysis for the admin in markdown.

Guidelines:
- Use headings, bullet points, and short paragraphs.
- Highlight trends, top-performing services, weak areas, and revenue insights.
- Suggest 3-5 concrete recommendations to grow the business.
- Be honest about limitations if data is small.
- All currency in USD.`;

    const userPrompt = userQ
      ? `Admin question: ${userQ}\n\nBusiness data (JSON):\n${JSON.stringify(summary, null, 2)}`
      : `Provide a full business performance analysis based on this data:\n${JSON.stringify(summary, null, 2)}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const analysis = aiJson.choices?.[0]?.message?.content ?? "No analysis returned.";

    return new Response(JSON.stringify({ analysis, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-analyzer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
