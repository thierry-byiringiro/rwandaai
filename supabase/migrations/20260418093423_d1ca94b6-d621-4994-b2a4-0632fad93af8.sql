-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.booking_status AS ENUM ('new', 'contacted', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.inquiry_status AS ENUM ('new', 'replied', 'closed');
CREATE TYPE public.item_type AS ENUM ('hotel', 'activity', 'flight', 'airport_assist', 'bundle');

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ HOTELS ============
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT,
  price_per_night NUMERIC(10,2) NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 4.5,
  image_url TEXT,
  description TEXT,
  amenities TEXT[],
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Available hotels are viewable by everyone"
  ON public.hotels FOR SELECT USING (available = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage hotels insert"
  ON public.hotels FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage hotels update"
  ON public.hotels FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage hotels delete"
  ON public.hotels FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ACTIVITIES ============
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  image_url TEXT,
  description TEXT,
  category TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Available activities are viewable by everyone"
  ON public.activities FOR SELECT USING (available = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage activities insert"
  ON public.activities FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage activities update"
  ON public.activities FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage activities delete"
  ON public.activities FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ FLIGHTS ============
CREATE TABLE public.flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airline TEXT NOT NULL,
  route TEXT NOT NULL,
  from_city TEXT,
  to_city TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration TEXT,
  image_url TEXT,
  description TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Available flights are viewable by everyone"
  ON public.flights FOR SELECT USING (available = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage flights insert"
  ON public.flights FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage flights update"
  ON public.flights FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage flights delete"
  ON public.flights FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_flights_updated_at BEFORE UPDATE ON public.flights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type public.item_type NOT NULL,
  item_id UUID,
  item_name TEXT NOT NULL,
  item_price NUMERIC(10,2),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  channel TEXT,
  notes TEXT,
  status public.booking_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a booking request"
  ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view bookings"
  ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_created ON public.bookings(created_at DESC);

-- ============ INQUIRIES ============
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry"
  ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view inquiries"
  ON public.inquiries FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update inquiries"
  ON public.inquiries FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete inquiries"
  ON public.inquiries FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_inquiries_status ON public.inquiries(status);