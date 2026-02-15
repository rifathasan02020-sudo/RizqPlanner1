import { createClient } from '@supabase/supabase-js';

// Fallback values: অ্যাপ যাতে ক্র্যাশ না করে তার জন্য সরাসরি ভ্যালু দেওয়া হলো
// প্রোডাকশনে এনভায়রনমেন্ট ভেরিয়েবল সেট করলে সেটিই প্রাধান্য পাবে
const DEFAULT_URL = 'https://zmujgryfdzwuhglutxie.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptdWpncnlmZHp3dWhnbHV0eGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTU1NjgsImV4cCI6MjA4NjY3MTU2OH0.xRI0OiSX_--EBMJr6c-tIniRg2BxNCjjFWDTjHmLWNw';

// Safe getter for environment variables
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {
    console.warn('Env access failed', e);
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);