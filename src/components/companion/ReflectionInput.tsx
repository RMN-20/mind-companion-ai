import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useAddReflection } from "@/hooks/useStressData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ReflectionInput() {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const addReflection = useAddReflection();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);

    try {
      // Analyze sentiment via edge function
      const { data: sentimentData } = await supabase.functions.invoke("analyze-sentiment", {
        body: { text: text.trim() },
      });

      await addReflection.mutateAsync({
        content: text.trim(),
        sentiment: sentimentData?.sentiment || "neutral",
        sentiment_score: sentimentData?.score ?? 0.5,
      });

      toast.success("Reflection saved");
      setText("");
    } catch {
      // Save without sentiment if analysis fails
      try {
        await addReflection.mutateAsync({ content: text.trim() });
        toast.success("Reflection saved");
        setText("");
      } catch {
        toast.error("Failed to save reflection");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="gradient-card border-border/40 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sand flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="font-display text-base">Reflection</CardTitle>
            <p className="text-xs text-muted-foreground">Optional — write what's on your mind</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling? What's on your mind today..."
          className="bg-background/60 min-h-[100px] mb-3 resize-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || analyzing || addReflection.isPending}
          size="sm"
          className="w-full"
        >
          {analyzing ? "Analyzing sentiment..." : "Save Reflection"}
        </Button>
      </CardContent>
    </Card>
  );
}
