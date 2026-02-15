import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmujgryfdzwuhglutxie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptdWpncnlmZHp3dWhnbHV0eGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTU1NjgsImV4cCI6MjA4NjY3MTU2OH0.xRI0OiSX_--EBMJr6c-tIniRg2BxNCjjFWDTjHmLWNw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);