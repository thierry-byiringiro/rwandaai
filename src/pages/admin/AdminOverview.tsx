import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Inbox, MessageSquare, Hotel, Mountain, Plane, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Stats {
  bookingsTotal: number;
  bookingsNew: number;
  inquiriesTotal: number;
  inquiriesNew: number;
  hotels: number;
  activities: number;
  flights: number;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(var(--destructive))"];

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [byType, setByType] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [b, bn, i, ino, h, a, f, recentB] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("inquiries").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("hotels").select("*", { count: "exact", head: true }),
        supabase.from("activities").select("*", { count: "exact", head: true }),
        supabase.from("flights").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("id,item_name,item_type,customer_name,status,created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        bookingsTotal: b.count ?? 0,
        bookingsNew: bn.count ?? 0,
        inquiriesTotal: i.count ?? 0,
        inquiriesNew: ino.count ?? 0,
        hotels: h.count ?? 0,
        activities: a.count ?? 0,
        flights: f.count ?? 0,
      });
      setRecent(recentB.data ?? []);

      // 14-day booking trend
      const since = subDays(new Date(), 13).toISOString();
      const { data: rows } = await supabase
        .from("bookings")
        .select("created_at,item_type")
        .gte("created_at", since);

      const days: Record<string, number> = {};
      const types: Record<string, number> = {};
      for (let d = 13; d >= 0; d--) {
        const k = format(subDays(new Date(), d), "MMM dd");
        days[k] = 0;
      }
      (rows ?? []).forEach((r: any) => {
        const k = format(new Date(r.created_at), "MMM dd");
        if (k in days) days[k]++;
        types[r.item_type] = (types[r.item_type] ?? 0) + 1;
      });
      setTrend(Object.entries(days).map(([day, count]) => ({ day, count })));
      setByType(Object.entries(types).map(([name, value]) => ({ name, value })));
    };
    load();
  }, []);

  const kpis = [
    { label: "Total Bookings", value: stats?.bookingsTotal ?? 0, icon: Inbox, accent: "bg-primary/10 text-primary", to: "/admin/bookings", sub: `${stats?.bookingsNew ?? 0} new` },
    { label: "Inquiries", value: stats?.inquiriesTotal ?? 0, icon: MessageSquare, accent: "bg-accent/10 text-accent", to: "/admin/inquiries", sub: `${stats?.inquiriesNew ?? 0} new` },
    { label: "Hotels", value: stats?.hotels ?? 0, icon: Hotel, accent: "bg-secondary/10 text-secondary", to: "/admin/hotels", sub: "Listed" },
    { label: "Activities", value: stats?.activities ?? 0, icon: Mountain, accent: "bg-primary/10 text-primary", to: "/admin/activities", sub: "Listed" },
    { label: "Flights", value: stats?.flights ?? 0, icon: Plane, accent: "bg-accent/10 text-accent", to: "/admin/flights", sub: "Listed" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {kpis.map((k) => (
          <Link to={k.to} key={k.label}>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${k.accent}`}>
                <k.icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold font-display">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{k.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Booking activity</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-1">By service</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 14 days</p>
          <div className="h-64">
            {byType.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={byType} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent bookings</h3>
          <Link to="/admin/bookings" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{r.item_name}</p>
                  <p className="text-xs text-muted-foreground">{r.customer_name} · {r.item_type}</p>
                </div>
                <Badge variant={r.status === "new" ? "default" : "secondary"} className="text-xs">{r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
};

export default AdminOverview;
