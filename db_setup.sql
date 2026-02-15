-- ১. ক্লিনআপ: আগের ট্রিগার এবং ফাংশন মুছে ফেলা
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ২. টেবিল স্ট্রাকচার চেক
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT, -- ইমেইল কলাম যোগ করা হলো অ্যাডমিন চেক করার জন্য
  avatar_url TEXT,
  saved_password TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ৩. সিকিউরিটি পলিসি (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- পলিসি ক্লিনআপ
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admin view all profiles" ON public.profiles;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

-- ৪. অ্যাডমিন এক্সেস পলিসি (আপনার ইমেইলটি এখানে বসান)
-- এই পলিসিগুলো অ্যাডমিনকে সব ডাটা দেখার অনুমতি দেয়

CREATE POLICY "Admin view all transactions" ON public.transactions
  FOR SELECT USING (
    (auth.jwt() ->> 'email') = 'আপনার_ইমেইল_এখানে_দিন@example.com' 
    OR user_id = auth.uid()
  );

CREATE POLICY "Admin view all savings" ON public.savings
  FOR SELECT USING (
    (auth.jwt() ->> 'email') = 'আপনার_ইমেইল_এখানে_দিন@example.com' 
    OR user_id = auth.uid()
  );

CREATE POLICY "Admin view all notes" ON public.notes
  FOR SELECT USING (
    (auth.jwt() ->> 'email') = 'আপনার_ইমেইল_এখানে_দিন@example.com' 
    OR user_id = auth.uid()
  );

-- ৫. অটোমেটিক প্রোফাইল তৈরির ফাংশন (আপডেট করা হয়েছে)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url, saved_password)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    new.email, -- ইমেইল সেভ করা হচ্ছে
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'saved_password', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    saved_password = EXCLUDED.saved_password,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ৬. ট্রিগার চালু করা
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ৭. পুরোনো ইউজারদের ইমেইল সিঙ্ক করা
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;