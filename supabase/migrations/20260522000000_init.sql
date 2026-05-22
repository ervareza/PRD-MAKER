-- Create prds table
CREATE TABLE IF NOT EXISTS public.prds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  idea TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create prd_versions table
CREATE TABLE IF NOT EXISTS public.prd_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prd_id UUID REFERENCES public.prds(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prd_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for prds
CREATE POLICY "Users can view own prds" 
  ON public.prds FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prds" 
  ON public.prds FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prds" 
  ON public.prds FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prds" 
  ON public.prds FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for prd_versions
CREATE POLICY "Users can view own prd_versions" 
  ON public.prd_versions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.prds WHERE id = prd_versions.prd_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert own prd_versions" 
  ON public.prd_versions FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.prds WHERE id = prd_versions.prd_id AND user_id = auth.uid()));

-- Function to automatically update 'updated_at' column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for prds
DROP TRIGGER IF EXISTS update_prds_updated_at ON public.prds;
CREATE TRIGGER update_prds_updated_at
BEFORE UPDATE ON public.prds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
