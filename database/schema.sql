-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car_requests table
CREATE TABLE IF NOT EXISTS public.car_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  max_budget DECIMAL(10,2),
  preferred_color TEXT,
  fuel_type TEXT,
  transmission TEXT,
  mileage_max INTEGER,
  additional_requirements TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'quoted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cost_estimates table
CREATE TABLE IF NOT EXISTS public.cost_estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  car_value DECIMAL(10,2) NOT NULL,
  import_fees DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  taxes DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create openlane_submissions table
CREATE TABLE IF NOT EXISTS public.openlane_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  openlane_url TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_name TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contracte table with prestari servicii fields
CREATE TABLE IF NOT EXISTS public.contracte (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number SERIAL UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Contract identification
  nr TEXT,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Personal information
  nume_prenume TEXT NOT NULL,
  localitatea TEXT NOT NULL,
  strada TEXT NOT NULL,
  nr_strada TEXT NOT NULL,
  bl TEXT,
  scara TEXT,
  etaj TEXT,
  apartament TEXT,
  judet TEXT NOT NULL,
  
  -- ID document information
  ci_seria TEXT NOT NULL,
  ci_nr TEXT NOT NULL,
  cnp TEXT NOT NULL,
  spclep TEXT NOT NULL,
  ci_data DATE NOT NULL,
  
  -- Contract details
  suma_licitatie DECIMAL(10,2) NOT NULL,
  email TEXT NOT NULL,
  
  -- Additional contract metadata
  contract_type TEXT NOT NULL DEFAULT 'servicii' CHECK (contract_type IN ('servicii', 'vanzare', 'cumparare')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'semnat', 'trimis_la_client', 'semnat_de_client', 'archived', 'cancelled')),
  
  -- Signature fields
  prestator_signature TEXT,
  prestator_signed_at TIMESTAMP WITH TIME ZONE,
  prestator_signed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  client_signature TEXT,
  client_signed_at TIMESTAMP WITH TIME ZONE,
  client_signed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create member_car_requests table (comprehensive car import requests for registered members)
CREATE TABLE IF NOT EXISTS public.member_car_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Vehicle Information
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  engine_capacity DECIMAL(3,1), -- Engine size in liters (e.g., 2.0, 3.5)
  horsepower INTEGER,
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'hybrid', 'electric', 'other')),
  transmission TEXT CHECK (transmission IN ('manual', 'automatic', 'cvt', 'other')),
  drivetrain TEXT CHECK (drivetrain IN ('fwd', 'rwd', 'awd', '4wd', 'other')),
  body_type TEXT CHECK (body_type IN ('sedan', 'hatchback', 'wagon', 'suv', 'coupe', 'convertible', 'pickup', 'van', 'other')),
  doors INTEGER CHECK (doors >= 2 AND doors <= 5),
  seats INTEGER CHECK (seats >= 2 AND seats <= 9),
  
  -- Condition & History
  condition TEXT CHECK (condition IN ('new', 'used', 'certified_pre_owned')),
  mileage_km INTEGER CHECK (mileage_km >= 0),
  accident_history BOOLEAN DEFAULT false,
  service_records_available BOOLEAN DEFAULT false,
  
  -- Preferences & Requirements
  preferred_colors TEXT[], -- Array of preferred colors
  max_budget DECIMAL(12,2) CHECK (max_budget > 0),
  budget_currency TEXT DEFAULT 'EUR' CHECK (budget_currency IN ('EUR', 'USD', 'RON')),
  max_mileage_km INTEGER CHECK (max_mileage_km >= 0),
  min_year INTEGER CHECK (min_year >= 1900 AND min_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 2),
  
  -- Features & Options
  required_features TEXT[], -- Array of must-have features
  preferred_features TEXT[], -- Array of nice-to-have features
  excluded_features TEXT[], -- Array of features to avoid
  
  -- Location & Logistics
  preferred_origin_countries TEXT[], -- Countries to source from
  delivery_location TEXT, -- Where the car should be delivered
  delivery_deadline DATE, -- When the car is needed by
  inspection_required BOOLEAN DEFAULT true,
  
  -- Contact Information
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'both')),
  contact_language TEXT DEFAULT 'ro' CHECK (contact_language IN ('ro', 'en', 'other')),
  
  -- Request Details
  urgency_level TEXT DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'urgent')),
  flexibility_level TEXT DEFAULT 'moderate' CHECK (flexibility_level IN ('strict', 'moderate', 'flexible')),
  additional_notes TEXT,
  special_requirements TEXT,
  
  -- Status & Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'sourcing', 'found_options', 'negotiating', 'approved', 'purchasing', 'shipping', 'completed', 'cancelled', 'expired')),
  priority_level TEXT DEFAULT 'standard' CHECK (priority_level IN ('low', 'standard', 'high', 'vip')),
  assigned_agent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Internal tracking
  source_platform TEXT, -- Where the request came from
  estimated_completion_date DATE,
  internal_notes TEXT, -- Private notes for admins
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days') -- Requests expire after 90 days by default
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openlane_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_car_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for car_requests table
CREATE POLICY "Users can view their own car requests" ON public.car_requests
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create car requests" ON public.car_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own car requests" ON public.car_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for cost_estimates table
CREATE POLICY "Users can view their own cost estimates" ON public.cost_estimates
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create cost estimates" ON public.cost_estimates
  FOR INSERT WITH CHECK (true);

-- Create policies for openlane_submissions table
CREATE POLICY "Users can view their own openlane submissions" ON public.openlane_submissions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create openlane submissions" ON public.openlane_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own openlane submissions" ON public.openlane_submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for contracte table
CREATE POLICY "Admin can view all contracts" ON public.contracte
  FOR SELECT USING (is_admin());

CREATE POLICY "Admin can create contracts" ON public.contracte
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin can update contracts" ON public.contracte
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admin can delete contracts" ON public.contracte
  FOR DELETE USING (is_admin());

CREATE POLICY "Users can view their own contracts" ON public.contracte
  FOR SELECT USING (auth.uid() = user_id OR (auth.jwt() ->> 'email') = email);

CREATE POLICY "Users can sign their own contracts" ON public.contracte
  FOR UPDATE USING (auth.uid() = user_id OR (auth.jwt() ->> 'email') = email);

-- Create policies for member_car_requests table
CREATE POLICY "Users can view their own member car requests" ON public.member_car_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create member car requests" ON public.member_car_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own member car requests" ON public.member_car_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all member car requests" ON public.member_car_requests
  FOR SELECT USING (is_admin());

CREATE POLICY "Admin can update any member car request" ON public.member_car_requests
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admin can delete member car requests" ON public.member_car_requests
  FOR DELETE USING (is_admin());

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_car_requests
  BEFORE UPDATE ON public.car_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_openlane_submissions
  BEFORE UPDATE ON public.openlane_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_contracte
  BEFORE UPDATE ON public.contracte
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_member_car_requests
  BEFORE UPDATE ON public.member_car_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create admin function to get member car request details
CREATE OR REPLACE FUNCTION public.admin_get_member_details(member_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  brand TEXT,
  model TEXT,
  year INTEGER,
  engine_capacity DECIMAL(3,1),
  horsepower INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  drivetrain TEXT,
  body_type TEXT,
  doors INTEGER,
  seats INTEGER,
  condition TEXT,
  mileage_km INTEGER,
  accident_history BOOLEAN,
  service_records_available BOOLEAN,
  preferred_colors TEXT[],
  max_budget DECIMAL(12,2),
  budget_currency TEXT,
  max_mileage_km INTEGER,
  min_year INTEGER,
  required_features TEXT[],
  preferred_features TEXT[],
  excluded_features TEXT[],
  preferred_origin_countries TEXT[],
  delivery_location TEXT,
  delivery_deadline DATE,
  inspection_required BOOLEAN,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  preferred_contact_method TEXT,
  contact_language TEXT,
  urgency_level TEXT,
  flexibility_level TEXT,
  additional_notes TEXT,
  special_requirements TEXT,
  status TEXT,
  priority_level TEXT,
  assigned_agent_id UUID,
  source_platform TEXT,
  estimated_completion_date DATE,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return all member car requests for the specified user ID
  RETURN QUERY
  SELECT 
    mcr.id,
    mcr.user_id,
    mcr.brand,
    mcr.model,
    mcr.year,
    mcr.engine_capacity,
    mcr.horsepower,
    mcr.fuel_type,
    mcr.transmission,
    mcr.drivetrain,
    mcr.body_type,
    mcr.doors,
    mcr.seats,
    mcr.condition,
    mcr.mileage_km,
    mcr.accident_history,
    mcr.service_records_available,
    mcr.preferred_colors,
    mcr.max_budget,
    mcr.budget_currency,
    mcr.max_mileage_km,
    mcr.min_year,
    mcr.required_features,
    mcr.preferred_features,
    mcr.excluded_features,
    mcr.preferred_origin_countries,
    mcr.delivery_location,
    mcr.delivery_deadline,
    mcr.inspection_required,
    mcr.contact_name,
    mcr.contact_email,
    mcr.contact_phone,
    mcr.preferred_contact_method,
    mcr.contact_language,
    mcr.urgency_level,
    mcr.flexibility_level,
    mcr.additional_notes,
    mcr.special_requirements,
    mcr.status,
    mcr.priority_level,
    mcr.assigned_agent_id,
    mcr.source_platform,
    mcr.estimated_completion_date,
    mcr.internal_notes,
    mcr.created_at,
    mcr.updated_at,
    mcr.expires_at
  FROM public.member_car_requests mcr
  WHERE mcr.user_id = member_user_id
  ORDER BY mcr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;