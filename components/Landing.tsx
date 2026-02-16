
import React, { useState } from 'react';
import { User } from '../services/types';
import { APP_NAME_PREFIX, APP_NAME_SUFFIX, getAvatar } from '../constants';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import { 
  ArrowRight, 
  ShieldCheck, 
  PieChart, 
  Globe, 
  Calculator, 
  GraduationCap, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  Zap,
  Lock
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface LandingProps {
  onLogin: (user: User) => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        onLogin({
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.user_metadata?.name || 'User',
          avatarUrl: profile?.avatar_url || data.user.user_metadata?.avatar_url || getAvatar(),
          password: profile?.saved_password || loginPass
        });
      }
    } catch (err: any) {
      setLoginError(err.message || 'ইমেইল বা পাসওয়ার্ড ভুল।');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setLoading(true);

    if (!name || !email || !password) {
      setSignupError('সব তথ্য প্রদান করুন।');
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
        setSignupSuccess('অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।');
        setIsLogin(true);
        setName(''); setEmail(''); setPassword('');
      }
    } catch (err: any) {
      setSignupError(err.message || 'অ্যাকাউন্ট তৈরি করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <PieChart className="text-cyan-400" size={20} />, title: "স্মার্ট ট্র্যাকিং", desc: "আয়-ব্যয় সহজে হিসাব।" },
    { icon: <GraduationCap className="text-blue-400" size={20} />, title: "AI পরামর্শ", desc: "সঠিক আর্থিক দিকনির্দেশনা।" },
    { icon: <TrendingUp className="text-emerald-400" size={20} />, title: "সঞ্চয় প্ল্যান", desc: "ভবিষ্যতের জন্য সঞ্চয়।" },
    { icon: <Calculator className="text-purple-400" size={20} />, title: "ক্যালকুলেটর", desc: "অ্যাডভান্সড হিসাব ব্যবস্থা।" },
    { icon: <Globe className="text-pink-400" size={20} />, title: "ভাষা এক্সচেঞ্জ", desc: "বাংলা ও বাংলিশ কনভার্টার।" },
    { icon: <Lock className="text-orange-400" size={20} />, title: "নিরাপদ ডাটা", desc: "ক্লাউড সুরক্ষার নিশ্চয়তা।" }
  ];

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative">
        <div className="relative z-10 w-full max-w-md">
           <Card className="animate-fade-in-up shadow-2xl border-white/10">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-1">{isLogin ? 'স্বাগতম' : 'নতুন অ্যাকাউন্ট'}</h2>
                <p className="text-slate-400 text-sm">{isLogin ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'তৈরি করুন আপনার RizqPlanner'}</p>
              </div>

              <div className="flex mb-8 border-b border-white/10">
                <button onClick={() => setIsLogin(true)} className={`flex-1 pb-4 text-center ${isLogin ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : 'text-slate-500'}`}>লগ ইন</button>
                <button onClick={() => setIsLogin(false)} className={`flex-1 pb-4 text-center ${!isLogin ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : 'text-slate-500'}`}>সাইন আপ</button>
              </div>

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <Input label="ইমেইল" placeholder="example@mail.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" />
                  <Input label="পাসওয়ার্ড" placeholder="******" value={loginPass} onChange={e => setLoginPass(e.target.value)} type="password" />
                  {loginError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2"><AlertCircle size={16} />{loginError}</div>}
                  <Button fullWidth type="submit" disabled={loading} className="py-4">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "প্রবেশ করুন"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <Input label="নাম" placeholder="আপনার পূর্ণ নাম" value={name} onChange={e => setName(e.target.value)} />
                  <Input label="ইমেইল" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                  <Input label="পাসওয়ার্ড" placeholder="কমপক্ষে ৬ অক্ষর" value={password} onChange={e => setPassword(e.target.value)} type="password" />
                  {signupError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2"><AlertCircle size={16} />{signupError}</div>}
                  {signupSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{signupSuccess}</div>}
                  <Button fullWidth type="submit" disabled={loading} className="py-4">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "অ্যাকাউন্ট তৈরি করুন"}
                  </Button>
                </form>
              )}
           </Card>
           <div className="text-center mt-6">
             <button onClick={() => setShowAuth(false)} className="text-slate-500 hover:text-white text-sm">ফিরে যান</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020617] to-[#020617] z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col items-center justify-center text-center">
        <div className="animate-fade-in-up mb-10">
           <h1 className="text-6xl lg:text-8xl font-bold mb-4 tracking-tighter">
              <span className="text-white">Rizq</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Planner</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto">
              আপনার আর্থিক ভবিষ্যতের সঠিক পরিকল্পনাকারী।
            </p>
        </div>
        
        {/* Smaller, Tighter Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-4xl animate-fade-in-up mb-12">
           {features.map((f, i) => (
             <Card key={i} className="text-left border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-colors p-3 rounded-xl border border-white/10 shadow-sm">
                <div className="mb-2 bg-white/5 w-fit p-1.5 rounded-lg">{f.icon}</div>
                <h3 className="text-sm font-bold text-white mb-0.5">{f.title}</h3>
                <p className="text-slate-500 text-[10px] leading-tight line-clamp-2">{f.desc}</p>
             </Card>
           ))}
        </div>

        {/* Start Button Repositioned BELOW Cards */}
        <div className="animate-fade-in-up">
          <button 
            onClick={() => setShowAuth(true)} 
            className="group w-64 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white text-xl font-bold shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            শুরু করুন <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-20 pb-10 border-t border-white/5 w-full pt-10 text-slate-600">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2"><ShieldCheck className="text-cyan-900/40" size={16} /><span className="text-[10px]">নিরাপদ এবং এনক্রিপ্টেড ডাটা</span></div>
              <div className="text-[10px]">© 2024 RizqPlanner. All rights reserved.</div>
              <div className="flex items-center gap-4"><Zap className="text-yellow-900/40" size={14} /><span className="text-[10px] font-medium">Powered by Gemini AI</span></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
