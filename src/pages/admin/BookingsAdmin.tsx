import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Mail, Phone, Trash2, Search } from "lucide-react";

const STATUSES = ["new", "contacted", "confirmed", "cancelled", "completed"] as const;

const BookingsAdmin = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status: status as any }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search && !`${r.item_name} ${r.customer_name} ${r.customer_email}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout title="Bookings">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center text-sm text-muted-foreground py-12">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">No bookings found.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold">{r.item_name}</h4>
                    <Badge variant="outline" className="text-xs">{r.item_type}</Badge>
                    {r.item_price && <span className="text-xs text-muted-foreground">${r.item_price}</span>}
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{r.customer_name}</span>
                    {r.channel && <span className="text-muted-foreground"> · via {r.channel}</span>}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    {r.customer_email && (
                      <a href={`mailto:${r.customer_email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="w-3 h-3" />{r.customer_email}
                      </a>
                    )}
                    {r.customer_phone && (
                      <a href={`tel:${r.customer_phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="w-3 h-3" />{r.customer_phone}
                      </a>
                    )}
                    <span>{format(new Date(r.created_at), "MMM dd, yyyy HH:mm")}</span>
                  </div>
                  {r.notes && <p className="text-xs mt-2 p-2 bg-muted/50 rounded">{r.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default BookingsAdmin;
