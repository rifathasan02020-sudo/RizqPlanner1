import { createClient } from '@supabase/supabase-js';

// আপনার নতুন Supabase প্রজেক্টের তথ্য
const DEFAULT_URL = 'https://kfclwauqoxgumcfzmsgp.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmY2x3YXVxb3hndW1jZnptc2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTA2MzMsImV4cCI6MjA4NjgyNjYzM30.qsCNpkCV7mLlPq4Fyl8vvZ9sbkbKLikt86TCXQGBpvI';

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