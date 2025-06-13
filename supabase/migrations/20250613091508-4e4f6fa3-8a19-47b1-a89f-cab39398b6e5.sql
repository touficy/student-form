-- Create students table for registration data
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL,
  profile_image_url TEXT,
  blood_group TEXT NOT NULL,
  allergies TEXT,
  medications TEXT,
  mother_name TEXT,
  mother_mobile TEXT NOT NULL,
  mother_occupation TEXT NOT NULL,
  father_name TEXT,
  father_mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a registration system)
CREATE POLICY "Anyone can insert student registration" 
ON public.students 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view student registrations" 
ON public.students 
FOR SELECT 
USING (true);

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('student-profiles', 'student-profiles', true);

-- Create storage policies for profile images
CREATE POLICY "Anyone can upload profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-profiles');

CREATE POLICY "Anyone can view profile images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-profiles');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_students_email ON public.students(email);
CREATE INDEX idx_students_blood_group ON public.students(blood_group);
CREATE INDEX idx_students_created_at ON public.students(created_at);
CREATE INDEX idx_students_name ON public.students(first_name, last_name);