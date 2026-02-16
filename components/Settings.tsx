
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../services/types';
import { getAvatar } from '../constants';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { Camera, LogOut, Upload, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

const SettingsIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.35a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: User) => Promise<void>;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState(user.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(user.avatarUrl || getAvatar());
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPassword(user.password || '');
      setAvatar(user.avatarUrl || getAvatar());
    }
  }, [user]);

  // Fast background compression
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          const rawBase64 = reader.result as string;
          // INSTANT PREVIEW: Update state immediately
          setAvatar(rawBase64);
          
          // Silently compress in background
          try {
            const compressed = await compressImage(rawBase64);
            setAvatar(compressed);
          } catch (err) {
            console.error("Compression failed:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    try {
        await onUpdateUser({ ...user, name, avatarUrl: avatar });
        alert('আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে!');
    } catch (err) {
        console.error("Save Error:", err);
        alert('তথ্য সেভ করতে সমস্যা হয়েছে।');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-20">
       <div className="flex items-center gap-3 mb-6">
         <SettingsIcon className="text-slate-400" size={28} />
         <h2 className="text-2xl font-bold text-white">সেটিংস</h2>
       </div>

       <Card className="border-t-4 border-t-cyan-500 bg-slate-900/60 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5">
            <SettingsIcon size={120} />
         </div>

         <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="flex flex-col items-center mb-10">
               <div 
                 className="relative group cursor-pointer w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-cyan-500/20 shadow-2xl bg-slate-800 transition-transform hover:scale-105 active:scale-95" 
                 onClick={() => !isSaving && fileInputRef.current?.click()}
               >
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                  
                  {isSaving && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <Loader2 className="animate-spin text-cyan-500" size={40} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[3px]">
                    <Camera className="text-white mb-2" size={32} />
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">ছবি পরিবর্তন</span>
                  </div>
               </div>
               <button 
                 type="button" 
                 disabled={isSaving}
                 onClick={() => fileInputRef.current?.click()} 
                 className="mt-6 flex items-center gap-2 px-8 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50"
               >
                 <Upload size={16} /> ছবি আপলোড করুন
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="grid grid-cols-1 gap-6">
               <Input label="আপনার নাম (Your Full Name)" value={name} onChange={e => setName(e.target.value)} placeholder="নাম লিখুন" />
               
               <div className="relative">
                  <Input 
                    label="পাসওয়ার্ড (Password - Read Only)" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    readOnly 
                    className="pr-12 bg-black/40 border-slate-800 text-slate-500 cursor-default"
                    placeholder="পাসওয়ার্ড" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-slate-600 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                  <div className="mt-2 flex items-center gap-2 text-slate-600 italic">
                     <span className="text-[10px] uppercase font-bold tracking-widest bg-white/5 px-2 py-0.5 rounded">Security Alert</span>
                     <p className="text-[10px]">নিরাপত্তার কারণে এখান থেকে পাসওয়ার্ড পরিবর্তন করা যাবে না।</p>
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-white/5">
               <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Mail size={12} className="text-cyan-500/50" /> রেজিস্টার্ড ইমেইল
               </label>
               <div className="w-full bg-black/60 border border-white/5 text-slate-400 px-5 py-4 rounded-2xl cursor-not-allowed text-sm font-medium">
                 {user.email}
               </div>
            </div>

            <div className="pt-8">
              <Button type="submit" fullWidth disabled={isSaving} className="py-5 shadow-2xl shadow-cyan-500/20 text-lg uppercase tracking-widest font-black">
                 {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "তথ্য আপডেট করুন"}
              </Button>
            </div>
         </form>
       </Card>

       <div className="flex justify-center pt-8">
         <button onClick={onLogout} className="flex items-center gap-3 text-red-500/60 hover:text-red-400 font-black text-xs uppercase tracking-[0.3em] px-10 py-4 rounded-2xl border border-red-500/10 hover:bg-red-500/5 transition-all active:scale-95">
           <LogOut size={18} /><span>লগ আউট</span>
         </button>
       </div>
    </div>
  );
};

export default Settings;
