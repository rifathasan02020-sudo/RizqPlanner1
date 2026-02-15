import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { getAvatar } from '../constants';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { Camera, LogOut, Save, Mail, Upload } from 'lucide-react';

// Define Icon first to prevent any hoisting issues
const SettingsIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.35a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState(user.password || '');
  const [avatar, setAvatar] = useState(user.avatarUrl || getAvatar());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with props when user data updates
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPassword(user.password || '');
      setAvatar(user.avatarUrl || getAvatar());
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64String = reader.result as string;
          setAvatar(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name,
      password,
      avatarUrl: avatar
    };
    onUpdateUser(updatedUser);
    alert('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-20">
       <div className="flex items-center gap-3 mb-6">
         <SettingsIcon className="text-slate-400" size={28} />
         <h2 className="text-2xl font-bold text-white">সেটিংস</h2>
       </div>

       <Card className="border-t-4 border-t-cyan-500">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-10">
               <div 
                 className="relative group cursor-pointer w-32 h-32 rounded-3xl overflow-hidden border-4 border-cyan-500/20 shadow-xl bg-slate-800 transition-all hover:border-cyan-500/50"
                 onClick={() => fileInputRef.current?.click()}
               >
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                 
                 {/* Hover Effect (Overlay) */}
                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-white text-xs font-medium font-sans">ছবি পরিবর্তন</span>
                 </div>
               </div>
               
               {/* Upload Button */}
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="mt-5 flex items-center gap-2 px-6 py-2 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm font-medium"
               >
                 <Upload size={16} />
                 ছবি আপলোড করুন
               </button>

               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleImageUpload}
               />
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 gap-5">
               <Input 
                 label="নাম (Name)" 
                 value={name} 
                 onChange={e => setName(e.target.value)}
                 className="font-semibold"
               />

               {/* Phone Input Removed */}
               
               <Input 
                 label="পাসওয়ার্ড (Password)" 
                 type="text" // Shown as text as per request context
                 value={password} 
                 onChange={e => setPassword(e.target.value)}
               />
            </div>

            {/* Read-only Fields */}
            <div className="grid grid-cols-1 gap-5 pt-4 border-t border-white/5">
               <div className="opacity-70">
                 <label className="block text-slate-400 text-sm mb-2 font-medium flex items-center gap-2">
                   <Mail size={14} /> ইমেইল
                 </label>
                 <div className="w-full bg-slate-900/50 border border-slate-800 text-slate-400 px-4 py-3 rounded-xl cursor-not-allowed">
                   {user.email}
                 </div>
               </div>
            </div>

            <div className="pt-6">
              <Button type="submit" fullWidth>
                <div className="flex items-center justify-center gap-2">
                  <Save size={20} />
                  <span>তথ্য আপডেট করুন</span>
                </div>
              </Button>
            </div>
         </form>
       </Card>

       {/* Logout Section */}
       <div className="flex justify-center pt-4">
         <button 
           onClick={onLogout}
           className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium px-6 py-3 rounded-xl hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
         >
           <LogOut size={20} />
           <span>অ্যাকাউন্ট থেকে লগ আউট করুন</span>
         </button>
       </div>
    </div>
  );
};

export default Settings;