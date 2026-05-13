import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, X } from "lucide-react";

interface Field { name: string; label: string; type?: string; required?: boolean; }

interface Props {
  table: "hotels" | "activities" | "flights";
  title: string;
  titleField: string;
  subField?: string;
  priceField: string;
  fields: Field[];
}

const ListingAdmin = ({ table, title, titleField, subField, priceField, fields }: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${table}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("listing-images").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
    setForm((prev: any) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded");
  };

  const load = async () => {
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, [table]);

  const openNew = () => {
    setEditing(null);
    const init: any = { available: true };
    fields.forEach((f) => init[f.name] = f.type === "number" ? 0 : "");
    setForm(init);
    setOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    setForm(row);
    setOpen(true);
  };

  const save = async () => {
    const payload = { ...form };
    fields.forEach((f) => {
      if (f.type === "number") payload[f.name] = Number(payload[f.name]) || 0;
    });
    const { error } = editing
      ? await supabase.from(table).update(payload).eq("id", editing.id)
      : await supabase.from(table).insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editing ? "Updated" : "Created"); setOpen(false); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm(`Delete this ${title.toLowerCase()}?`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const toggleAvailable = async (row: any) => {
    await supabase.from(table).update({ available: !row.available }).eq("id", row.id);
    load();
  };

  return (
    <AdminLayout title={title}>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{rows.length} listings</p>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add new</Button>
      </div>

      {rows.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">No items yet. Click "Add new" to create your first one.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map((r) => (
            <Card key={r.id} className={`p-4 ${!r.available ? "opacity-60" : ""}`}>
              {r.image_url && <img src={r.image_url} alt={r[titleField]} className="w-full h-32 object-cover rounded mb-3" />}
              <h4 className="font-semibold truncate">{r[titleField]}</h4>
              {subField && <p className="text-xs text-muted-foreground">{r[subField]}</p>}
              <p className="text-sm font-medium mt-1">${r[priceField]}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Switch checked={r.available} onCheckedChange={() => toggleAvailable(r)} />
                  <span className="text-xs text-muted-foreground">{r.available ? "Live" : "Hidden"}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title.toLowerCase().replace(/s$/, "")}` : `New ${title.toLowerCase().replace(/s$/, "")}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {fields.map((f) => {
              if (f.name === "image_url") {
                return (
                  <div key={f.name}>
                    <Label>{f.label}</Label>
                    {form.image_url && (
                      <div className="relative mb-2 mt-1">
                        <img src={form.image_url} alt="preview" className="w-full h-40 object-cover rounded border" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => setForm({ ...form, image_url: "" })}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Paste URL or upload below"
                        value={form.image_url ?? ""}
                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      />
                      <Button type="button" variant="outline" size="icon" disabled={uploading} onClick={() => document.getElementById(`file-${table}`)?.click()}>
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      </Button>
                      <input id={`file-${table}`} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Upload from your device (max 5MB) or paste an image URL</p>
                  </div>
                );
              }
              return (
                <div key={f.name}>
                  <Label>{f.label}{f.required && " *"}</Label>
                  {f.type === "textarea" ? (
                    <Textarea value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                  ) : (
                    <Input
                      type={f.type === "number" ? "number" : "text"}
                      step={f.type === "number" ? "0.01" : undefined}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  )}
                </div>
              );
            })}
            <div className="flex items-center gap-2">
              <Switch checked={!!form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
              <Label>Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ListingAdmin;
