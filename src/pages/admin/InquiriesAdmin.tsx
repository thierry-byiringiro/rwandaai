import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Mail, Phone, Trash2 } from "lucide-react";

const STATUSES = ["new", "replied", "closed"] as const;

const InquiriesAdmin = () => {
  const [rows, setRows] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status: status as any }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <AdminLayout title="Contact Inquiries">
      {rows.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">No inquiries yet.</Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex justify-between items-start gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold">{r.name}</h4>
                    <Badge variant={r.status === "new" ? "default" : "secondary"} className="text-xs">{r.status}</Badge>
                  </div>
                  {r.subject && <p className="text-sm font-medium mt-0.5">{r.subject}</p>}
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    {r.email && <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" />{r.email}</a>}
                    {r.phone && <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" />{r.phone}</a>}
                    <span>{format(new Date(r.created_at), "MMM dd, HH:mm")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap p-3 bg-muted/50 rounded">{r.message}</p>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default InquiriesAdmin;
