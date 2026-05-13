import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const QUICK_PROMPTS = [
  "Give me a full performance overview",
  "Which services bring the most revenue?",
  "What should I improve to grow bookings?",
  "Analyze customer inquiry patterns",
  "Spot any weak or unavailable services",
];

const AnalyzerAdmin = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [summary, setSummary] = useState<any>(null);

  const runAnalysis = async (q?: string) => {
    setLoading(true);
    setAnalysis("");
    try {
      const { data, error } = await supabase.functions.invoke("admin-analyzer", {
        body: { question: q ?? question },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setAnalysis((data as any).analysis);
      setSummary((data as any).summary);
    } catch (e: any) {
      toast.error(e?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="AI Analyzer">
      <div className="space-y-6 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Smart Business Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ask the AI anything about your bookings, inquiries, and listings — or run a full
              performance analysis.
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant="secondary"
                  disabled={loading}
                  onClick={() => {
                    setQuestion(p);
                    runAnalysis(p);
                  }}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Textarea
              placeholder="Type your own question (e.g. 'Compare hotel vs activity bookings this month')"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={() => runAnalysis()} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Analyzing..." : "Run Analysis"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4" /> Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(summary.totals).map(([k, v]) => (
                <div key={k} className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-lg font-semibold">
                    {k === "estimatedRevenueUSD" ? `$${Number(v).toLocaleString()}` : String(v)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyzerAdmin;
