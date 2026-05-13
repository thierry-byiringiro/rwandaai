import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pin, PinOff, Trash2, Save, Loader2, StickyNote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  pinned: boolean;
  color: string;
  created_at: string;
  updated_at: string;
};

const COLORS: Record<string, string> = {
  default: "bg-card",
  yellow: "bg-yellow-50 dark:bg-yellow-950/30",
  green: "bg-green-50 dark:bg-green-950/30",
  blue: "bg-blue-50 dark:bg-blue-950/30",
  pink: "bg-pink-50 dark:bg-pink-950/30",
};

const NotesAdmin = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_notes")
      .select("*")
      .order("pinned", { ascending: false })
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setNotes((data as Note[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createNote = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("admin_notes")
      .insert({ user_id: user.id, title: "Untitled", content: "" })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setNotes((p) => [data as Note, ...p]);
  };

  const updateNote = async (id: string, patch: Partial<Note>) => {
    setNotes((p) => p.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const persistNote = async (note: Note) => {
    setSavingId(note.id);
    const { error } = await supabase
      .from("admin_notes")
      .update({
        title: note.title,
        content: note.content,
        pinned: note.pinned,
        color: note.color,
      })
      .eq("id", note.id);
    setSavingId(null);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const togglePin = async (note: Note) => {
    const next = !note.pinned;
    await updateNote(note.id, { pinned: next });
    const { error } = await supabase.from("admin_notes").update({ pinned: next }).eq("id", note.id);
    if (error) toast.error(error.message);
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    const { error } = await supabase.from("admin_notes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setNotes((p) => p.filter((n) => n.id !== id));
  };

  const setColor = async (note: Note, color: string) => {
    await updateNote(note.id, { color });
    await supabase.from("admin_notes").update({ color }).eq("id", note.id);
  };

  const filtered = notes.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout title="Notes">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Keep your records, ideas, and reminders here — no more paper books.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button onClick={createNote} className="gap-2 shrink-0">
              <Plus className="w-4 h-4" /> New note
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              No notes yet. Click "New note" to start.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((note) => (
              <Card key={note.id} className={`${COLORS[note.color] ?? COLORS.default} transition-colors`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Input
                      value={note.title}
                      onChange={(e) => updateNote(note.id, { title: e.target.value })}
                      placeholder="Title"
                      className="font-semibold border-none bg-transparent px-0 focus-visible:ring-0 text-base"
                    />
                    <Button size="icon" variant="ghost" onClick={() => togglePin(note)} title="Pin">
                      {note.pinned ? <Pin className="w-4 h-4 text-primary" /> : <PinOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                    placeholder="Write here..."
                    rows={6}
                    className="resize-none bg-transparent"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1.5">
                      {Object.keys(COLORS).map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(note, c)}
                          className={`w-5 h-5 rounded-full border ${COLORS[c]} ${
                            note.color === c ? "ring-2 ring-primary" : ""
                          }`}
                          title={c}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => persistNote(note)}
                        disabled={savingId === note.id}
                        className="gap-1"
                      >
                        {savingId === note.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        Save
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(note.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Updated {new Date(note.updated_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NotesAdmin;
