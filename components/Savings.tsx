import React, { useState, useMemo } from 'react';
import { SavingsEntry } from '../services/types';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { PiggyBank, TrendingUp, Plus, Trash2, Wallet } from 'lucide-react';

interface SavingsProps {
  savings: SavingsEntry[];
  onAdd: (amount: number, description: string) => void;
  onDelete: (id: string) => void;
}

const Savings: React.FC<SavingsProps> = ({ savings, onAdd, onDelete }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Calculate Summaries
  const { totalSavings, totalCount } = useMemo(() => {
    const total = savings.reduce((sum, item) => sum + item.amount, 0);
    return { totalSavings: total, totalCount: savings.length };
  }, [savings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const desc = description.trim() ? description : 'সাধারণ সঞ্চয়';
    onAdd(parseFloat(amount), desc);
    
    // Reset form
    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-white">আমার সঞ্চয়</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Savings Card (Cyan Tone) */}
        <Card className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-white/5">
          <Wallet className="absolute right-[-20px] bottom-[-20px] text-cyan-500/5 w-40 h-40 group-hover:text-cyan-500/10 transition-colors duration-500" />
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-cyan-500/10 rounded-xl backdrop-blur-md">
                 <PiggyBank className="text-cyan-500" size={24} />
               </div>
               <span className="text-slate-400 font-medium">মোট সঞ্চয়</span>
             </div>
             <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
               ৳ {totalSavings.toLocaleString()}
             </p>
          </div>
        </Card>

        {/* Total Deposits Count Card */}
        <Card className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-white/5">
          <TrendingUp className="absolute right-[-20px] bottom-[-20px] text-blue-500/5 w-40 h-40 group-hover:text-blue-500/10 transition-colors duration-500" />
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-blue-500/10 rounded-xl backdrop-blur-md">
                 <TrendingUp className="text-blue-500" size={24} />
               </div>
               <span className="text-slate-400 font-medium">মোট জমার সংখ্যা</span>
             </div>
             <p className="text-4xl font-bold text-white tracking-tight">
               {totalCount} <span className="text-lg text-slate-500 font-normal">বার</span>
             </p>
          </div>
        </Card>
      </div>

      {/* Premium Input Board */}
      <Card className="border-t-4 border-t-cyan-500">
          <div className="flex items-center gap-2 mb-6 text-cyan-400">
             <Plus size={20} />
             <h3 className="font-semibold text-lg">নতুন সঞ্চয় জমা করুন</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5">
                  <Input 
                      label="টাকার পরিমাণ" 
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                  />
              </div>
              <div className="md:col-span-5">
                  <Input 
                      label="বিবরণ (ঐচ্ছিক)" 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="যেমন: সাধারণ সঞ্চয়"
                  />
              </div>
              <div className="md:col-span-2 mb-4">
                  <Button type="submit" fullWidth disabled={!amount}>
                      জমা দিন
                  </Button>
              </div>
          </form>
      </Card>

      {/* Savings List */}
      <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white px-1 mt-4">জমার তালিকা</h3>
          
          {savings.length === 0 ? (
               <div className="text-center py-12 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                   <PiggyBank size={48} className="mx-auto mb-4 opacity-20 text-slate-500" />
                   <p className="text-slate-500">এখনো কোনো সঞ্চয় জমা করা হয়নি।</p>
               </div>
          ) : (
              [...savings].reverse().map(item => (
                  <Card key={item.id} className="flex justify-between items-center p-5 hover:bg-slate-800/40 transition-all group border-l-4 border-l-transparent hover:border-l-cyan-500">
                      <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                             <Wallet size={20} />
                          </div>
                          <div>
                              <p className="font-bold text-white text-lg leading-tight">{item.description}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-5">
                          <span className="text-xl font-bold text-cyan-400">
                              + ৳ {item.amount.toLocaleString()}
                          </span>
                          <button 
                            onClick={() => onDelete(item.id)} 
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="মুছুন"
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                  </Card>
              ))
          )}
      </div>
    </div>
  );
};

export default Savings;