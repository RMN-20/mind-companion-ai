import { Brain } from "lucide-react";

interface StatusBannerProps {
  status: "clear" | "intervening";
  message: string | null;
}

export function StatusBanner({ status, message }: StatusBannerProps) {
  if (status === "clear") {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3">
        <Brain className="text-emerald-600" />
        <div>
          <p className="font-medium text-emerald-700">All Clear</p>
          <p className="text-sm text-emerald-600">
            No intervention needed right now. The AI is monitoring your signals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
      <Brain className="text-amber-600" />
      <div>
        <p className="font-medium text-amber-700">AI Intervention Active</p>
        <p className="text-sm text-amber-600">
          {message ?? "The AI is providing support based on your stress signals."}
        </p>
      </div>
    </div>
  );
}
