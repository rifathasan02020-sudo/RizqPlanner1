
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcpmptjnrijdbvvxogmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcG1wdGpucmlqZGJ2dnhvZ21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTkzNTgsImV4cCI6MjA4NjgzNTM1OH0.q7BvFOpVk7f0C1iLv3-ljaBowC5KhPA7QRIiXLYuP78';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
