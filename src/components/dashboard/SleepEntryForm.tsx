import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon } from "lucide-react";
import { useAddSleepEntry } from "@/hooks/useStressData";
import { toast } from "sonner";

export function SleepEntryForm() {
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState("fair");
  const [consistency, setConsistency] = useState("regular");
  const addSleep = useAddSleepEntry();

  const handleSubmit = async () => {
    try {
      await addSleep.mutateAsync({
        hours_slept: hours,
        sleep_quality: quality,
        bedtime_consistency: consistency,
      });
      toast.success("Sleep data logged successfully");
    } catch {
      toast.error("Failed to log sleep data");
    }
  };

  return (
    <Card className="gradient-card border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Moon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="font-display text-base">Log Sleep</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Hours Slept</span>
            <span className="font-medium">{hours}h</span>
          </div>
          <Slider
            value={[hours]}
            onValueChange={(v) => setHours(v[0])}
            min={0}
            max={12}
            step={0.5}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Sleep Quality</label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poor">Poor</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="good">Good</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Bedtime Consistency</label>
          <Select value={consistency} onValueChange={setConsistency}>
            <SelectTrigger className="bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="irregular">Irregular</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="very_regular">Very Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={addSleep.isPending}>
          {addSleep.isPending ? "Saving..." : "Log Sleep Data"}
        </Button>
      </CardContent>
    </Card>
  );
}
