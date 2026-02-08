
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
  preferred_interventions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create stress_readings table
CREATE TABLE public.stress_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  typing_stress REAL DEFAULT 0,
  voice_stress REAL DEFAULT 0,
  sleep_stress REAL DEFAULT 0,
  overall_stress REAL DEFAULT 0,
  typing_speed REAL DEFAULT 0,
  typing_error_rate REAL DEFAULT 0,
  typing_pause_pattern REAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stress_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stress readings" ON public.stress_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stress readings" ON public.stress_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create sleep_entries table
CREATE TABLE public.sleep_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hours_slept REAL NOT NULL DEFAULT 7,
  sleep_quality TEXT NOT NULL DEFAULT 'fair',
  bedtime_consistency TEXT NOT NULL DEFAULT 'regular',
  sleep_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sleep_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sleep entries" ON public.sleep_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sleep entries" ON public.sleep_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep entries" ON public.sleep_entries FOR UPDATE USING (auth.uid() = user_id);

-- Create interventions table
CREATE TABLE public.interventions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  trigger_stress_level REAL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interventions" ON public.interventions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interventions" ON public.interventions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interventions" ON public.interventions FOR UPDATE USING (auth.uid() = user_id);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intervention_id UUID NOT NULL REFERENCES public.interventions(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create reflections table
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sentiment TEXT DEFAULT 'neutral',
  sentiment_score REAL DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reflections" ON public.reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reflections" ON public.reflections FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create strategy_scores table
CREATE TABLE public.strategy_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_type TEXT NOT NULL,
  effectiveness_score REAL NOT NULL DEFAULT 0.5,
  total_uses INTEGER NOT NULL DEFAULT 0,
  positive_feedback INTEGER NOT NULL DEFAULT 0,
  negative_feedback INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, strategy_type)
);

ALTER TABLE public.strategy_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own strategy scores" ON public.strategy_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own strategy scores" ON public.strategy_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own strategy scores" ON public.strategy_scores FOR UPDATE USING (auth.uid() = user_id);

-- Create auto-profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_strategy_scores_updated_at
  BEFORE UPDATE ON public.strategy_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Initialize default strategy scores function
CREATE OR REPLACE FUNCTION public.initialize_strategy_scores()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.strategy_scores (user_id, strategy_type) VALUES
    (NEW.id, 'breathing'),
    (NEW.id, 'grounding'),
    (NEW.id, 'break'),
    (NEW.id, 'motivation');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_strategy_init
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_strategy_scores();
