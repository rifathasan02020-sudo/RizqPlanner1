import React, { useState } from 'react';
import { User } from '../services/types';
import { APP_NAME_PREFIX, APP_NAME_SUFFIX, getAvatar } from '../constants';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import { ArrowRight, CheckCircle2, ShieldCheck, PieChart, Globe, Calculator, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface LandingProps {
  onLogin: (user: User) => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPass,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch profile to get persisted name, avatar and saved_password
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          onLogin({
            id: data.user.id,
            email: data.user.email!,
            name: profile.name || data.user.user_metadata?.name || 'User',
            // Prefer profile avatar, fallback to metadata or default
            avatarUrl: profile.avatar_url || data.user.user_metadata?.avatar_url || getAvatar(),
            // Retrieve the saved password for display in settings
            password: profile.saved_password || '' 
          });
        } else {
            // Fallback if profile missing
             onLogin({
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || 'User',
                avatarUrl: data.user.user_metadata?.avatar_url || getAvatar(),
                password: ''
             });
        }
      }
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setLoginError('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।');
      } else {
        setLoginError(err.message || 'লগইন ব্যর্থ হয়েছে।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    setLoading(true);

    // Validations
    if (!name || !email || !password) {
      setSignupError('সব তথ্য (নাম, ইমেইল, পাসওয়ার্ড) পূরণ করা আবশ্যক।');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setSignupError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            avatar_url: getAvatar(),
            saved_password: password
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Force manual Upsert to Profiles table
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            name: name,
            avatar_url: getAvatar(),
            saved_password: password
        });

        if (profileError) {
            console.error("Profile creation failed manually:", profileError);
        }

        if (data.session) {
           onLogin({
            id: data.user.id,
            email: data.user.email!,
            name: name,
            avatarUrl: getAvatar(),
            password: password
          });
        } else {
          // Email confirmation is ON
          setSignupSuccess('অ্যাকাউন্ট তৈরি হয়েছে! ইমেইল ভেরিফিকেশনের জন্য আপনার ইনবক্স চেক করুন।');
          setIsLogin(true); // Switch to login view
          setLoginEmail(email); // Auto fill email
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('rate limit')) {
        setSignupError('অতিরিক্ত চেষ্টার কারণে সাময়িক নিষেধাজ্ঞা। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন অথবা Supabase থেকে "Confirm Email" বন্ধ করুন।');
      } else if (err.message.includes('already registered')) {
        setSignupError('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।');
      } else {
        setSignupError(err.message || 'অ্যাকাউন্ট তৈরি করা যায়নি।');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] z-0"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] z-0"></div>

        <div className="relative z-10 w-full max-w-md">
           <Card className="animate-fade-in-up shadow-2xl shadow-cyan-900/20 border-white/10">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {isLogin ? 'স্বাগতম' : 'অ্যাকাউন্ট তৈরি'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {isLogin ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'বিনামূল্যে অ্যাকাউন্ট খুলুন'}
                </p>
              </div>

              <div className="flex mb-8 border-b border-white/10">
                <button 
                  onClick={() => { setIsLogin(true); setSignupSuccess(''); setSignupError(''); setLoginError(''); }}
                  className={`flex-1 pb-4 text-center transition-all duration-300 text-lg ${isLogin ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  লগ ইন
                </button>
                <button 
                  onClick={() => { setIsLogin(false); setSignupSuccess(''); setSignupError(''); setLoginError(''); }}
                  className={`flex-1 pb-4 text-center transition-all duration-300 text-lg ${!isLogin ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  সাইন আপ
                </button>
              </div>

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <Input 
                    label="ইমেইল" 
                    placeholder="example@mail.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    type="email"
                  />
                  <Input 
                    label="পাসওয়ার্ড" 
                    placeholder="******"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    type="password"
                  />
                  {signupSuccess && (
                     <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-2">
                       <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                       <span>{signupSuccess}</span>
                     </div>
                  )}
                  {loginError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}
                  <Button fullWidth type="submit" disabled={loading} className="mt-4 group text-lg py-4">
                    {loading ? (
                        <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20}/> অপেক্ষা করুন...</span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                        প্রবেশ করুন <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-5">
                  <Input 
                    label="নাম" 
                    placeholder="আপনার পূর্ণ নাম"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <Input 
                    label="ইমেইল" 
                    placeholder="example@mail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                  />
                  <Input 
                    label="পাসওয়ার্ড" 
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                  />

                  {signupError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{signupError}</span>
                    </div>
                  )}
                  
                  <Button fullWidth type="submit" disabled={loading} className="mt-6 text-lg py-4">
                     {loading ? (
                        <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20}/> অপেক্ষা করুন...</span>
                    ) : (
                        "অ্যাকাউন্ট তৈরি করুন"
                    )}
                  </Button>
                </form>
              )}
           </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden font-sans flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020617] to-[#020617] z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center flex-grow">
        <div className="text-center mb-12 animate-fade-in mt-10 lg:mt-0">
           <h1 className="text-5xl lg:text-7xl font-bold mb-4 tracking-tighter leading-none">
              <span className="text-white drop-shadow-lg">{APP_NAME_PREFIX}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">{APP_NAME_SUFFIX}</span>
            </h1>
            <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
              আপনার ব্যক্তিগত ফাইন্যান্স ম্যানেজার, এখন আরও স্মার্ট, আরও আধুনিক।
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full max-w-5xl animate-fade-in-up">
           <FeatureCard 
             icon={<ShieldCheck className="text-cyan-500" size={32} />}
             title="সর্বোচ্চ নিরাপত্তা"
             desc="আপনার তথ্যের নিরাপত্তা আমাদের প্রধান অগ্রাধিকার।"
           />
           <FeatureCard 
             icon={<PieChart className="text-blue-500" size={32} />}
             title="স্মার্ট বিশ্লেষণ"
             desc="আয়-ব্যয়ের পরিষ্কার চিত্র এবং গ্রাফিকাল রিপোর্ট।"
           />
           <FeatureCard 
             icon={<Calculator className="text-purple-500" size={32} />}
             title="প্রিমিয়াম ক্যালকুলেটর"
             desc="যেকোনো ধরনের হিসাব নিকাশ করুন খুব সহজেই।"
           />
           <FeatureCard 
             icon={<GraduationCap className="text-yellow-500" size={32} />}
             title="এআই পরামর্শদাতা"
             desc="উন্নত এআই দ্বারা ব্যক্তিগত আর্থিক পরামর্শ।"
           />
           <FeatureCard 
             icon={<CheckCircle2 className="text-emerald-500" size={32} />}
             title="সহজ সঞ্চয়"
             desc="আপনার ভবিষ্যতের জন্য সঞ্চয়ের হিসাব রাখুন।"
           />
           <FeatureCard 
             icon={<Globe className="text-pink-500" size={32} />}
             title="বাংলা ইন্টারফেস"
             desc="সম্পূর্ণ বাংলায় সহজ ও সাবলীল ব্যবহার।"
           />
        </div>

        <div className="animate-fade-in-up delay-100 mb-20">
           <button 
             onClick={() => setShowAuth(true)}
             className="group relative w-64 md:w-80 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-xl font-bold shadow-lg shadow-cyan-500/30 overflow-hidden transition-transform hover:scale-105 active:scale-95"
           >
             <span className="relative z-10 flex items-center justify-center gap-2">
               শুরু করুন <ArrowRight className="group-hover:translate-x-1 transition-transform" />
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           </button>
           <p className="text-slate-500 text-sm mt-4 text-center">বিনামূল্যে অ্যাকাউন্ট খুলুন এবং ব্যবহার শুরু করুন</p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 group hover:-translate-y-1">
    <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;