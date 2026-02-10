import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

/* =========================================================
   STRESS READINGS
   ========================================================= */

export function useStressReadings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["stress-readings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("stress_readings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useLatestStress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["latest-stress", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("stress_readings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

/* =========================================================
   ADD STRESS READING
   ========================================================= */

export function useAddStressReading() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reading: {
      typing_stress: number;
      voice_stress: number;
      sleep_stress: number;
      overall_stress: number;
      typing_speed: number;
      typing_error_rate: number;
      typing_pause_pattern: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("stress_readings")
        .insert({
          user_id: user.id,
          typing_stress: reading.typing_stress,
          voice_stress: reading.voice_stress,
          sleep_stress: reading.sleep_stress,
          overall_stress: reading.overall_stress,
          typing_speed: reading.typing_speed,
          typing_error_rate: reading.typing_error_rate,
          typing_pause_pattern: reading.typing_pause_pattern,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stress-readings"] });
      queryClient.invalidateQueries({ queryKey: ["latest-stress"] });
    },
  });
}

/* =========================================================
   SLEEP
   ========================================================= */

export function useSleepEntries() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sleep-entries", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("sleep_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAddSleepEntry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: {
      hours_slept: number;
      sleep_quality: string;
      bedtime_consistency: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("sleep_entries")
        .insert({ ...entry, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep-entries"] });
    },
  });
}

/* =========================================================
   INTERVENTIONS
   ========================================================= */

export function useInterventions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["interventions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("interventions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAddIntervention() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intervention: {
      type: string;
      title: string;
      content: string;
      trigger_stress_level: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("interventions")
        .insert({ ...intervention, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interventions"] });
    },
  });
}

/* =========================================================
   FEEDBACK & STRATEGY LEARNING
   ========================================================= */

export function useAddFeedback() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: {
      intervention_id: string;
      feedback_type: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("feedback")
        .insert({ ...feedback, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({ queryKey: ["strategy-scores"] });
    },
  });
}

export function useFeedbackHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["feedback", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("feedback")
        .select("*, interventions(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useStrategyScores() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["strategy-scores", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("strategy_scores")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
/* =========================================================
   REFLECTIONS (CHAT SENTIMENT)
   ========================================================= */

export function useAddReflection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reflection: {
      content: string;
      sentiment?: string;
      sentiment_score?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reflections")
        .insert({ ...reflection, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reflections"] });
    },
  });
}
