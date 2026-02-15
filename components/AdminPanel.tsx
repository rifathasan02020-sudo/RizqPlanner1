import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Card from './Card';
import { User, Transaction, SavingsEntry } from '../types';
import { Users, Database, ShieldAlert, Loader2 } from 'lucide-react';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  saved_password?: string;
  avatar_url?: string;
}

const AdminPanel: React.FC = () => {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [totalTxns, setTotalTxns] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Fetch all profiles
      const { data: profilesData } = await supabase.from('profiles').select('*');
      if (profilesData) setProfiles(profilesData);

      // Fetch all stats (Allowed via RLS if admin)
      const { count: txnCount } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
      const { data: savingsData } = await supabase.from('savings').select('amount');
      
      setTotalTxns(txnCount || 0);
      
      const totalSaved = savingsData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
      setTotalSavings(totalSaved);

    } catch (error) {
      console.error("Admin Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={40} /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <ShieldAlert size={32} className="text-red-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">অ্যাডমিন প্যানেল</h2>
          <p className="text-slate-400 text-sm">সকল ইউজার এবং ডাটাবেস ওভারভিউ</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-white/5">
          <div className="flex items-center gap-3 mb-2 text-cyan-400">
            <Users size={24} />
            <h3 className="font-bold">মোট ইউজার</h3>
          </div>
          <p className="text-3xl font-bold text-white">{profiles.length}</p>
        </Card>
        <Card className="bg-slate-900/50 border-white/5">
          <div className="flex items-center gap-3 mb-2 text-emerald-400">
            <Database size={24} />
            <h3 className="font-bold">মোট লেনদেন এন্ট্রি</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalTxns}</p>
        </Card>
        <Card className="bg-slate-900/50 border-white/5">
          <div className="flex items-center gap-3 mb-2 text-purple-400">
            <Database size={24} />
            <h3 className="font-bold">প্ল্যাটফর্মে মোট সঞ্চয়</h3>
          </div>
          <p className="text-3xl font-bold text-white">৳ {totalSavings.toLocaleString()}</p>
        </Card>
      </div>

      {/* User Table */}
      <Card className="overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 px-2">নিবন্ধিত ইউজার তালিকা</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm">
                <th className="p-3">নাম</th>
                <th className="p-3">ইমেইল</th>
                <th className="p-3">পাসওয়ার্ড (Saved)</th>
                <th className="p-3">আইডি</th>
              </tr>
            </thead>
            <tbody className="text-slate-200 text-sm">
              {profiles.map((profile) => (
                <tr key={profile.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium flex items-center gap-2">
                     <img src={profile.avatar_url || 'https://via.placeholder.com/30'} className="w-6 h-6 rounded-full" alt="" />
                     {profile.name}
                  </td>
                  <td className="p-3 opacity-80">{profile.email}</td>
                  <td className="p-3 font-mono text-cyan-400">{profile.saved_password || 'N/A'}</td>
                  <td className="p-3 text-xs opacity-50 font-mono">{profile.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;