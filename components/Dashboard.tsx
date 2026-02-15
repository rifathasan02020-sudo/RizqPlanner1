import React, { useMemo, useState } from 'react';
import { User, Transaction, TransactionType, SavingsEntry } from '../services/types';
import { getAvatar, QUOTES } from '../constants';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import FinancialChart from './FinancialChart';
import DistributionChart from './DistributionChart';
import { ArrowUpCircle, ArrowDownCircle, Wallet, CreditCard, Plus, X, Calendar, Globe } from 'lucide-react';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  savings: SavingsEntry[];
  onAddTransaction: (txn: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, savings, onAddTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>('expense');

  // Select a random quote on mount
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  // Calculate Summaries
  const { totalIncome, totalExpense, balance, totalSavings } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    
    // Calculate total savings from the savings array prop
    const saved = savings.reduce((sum, s) => sum + s.amount, 0);

    return { totalIncome: inc, totalExpense: exp, balance: inc - exp, totalSavings: saved };
  }, [transactions, savings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date) return;

    const newTxn: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      amount: parseFloat(amount),
      type: type,
      category: title,
      date: date, // Keep YYYY-MM-DD format or ISO
    };

    onAddTransaction(newTxn);
    
    // Reset & Close
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20 relative flex flex-col min-h-full">
      {/* Component 1: Dashboard Profile Header (Display Only) */}
      <div className="flex items-center gap-5 pl-2 animate-fade-in mb-4">
        {/* Avatar: Squircle Shape, w-20 h-20 */}
        <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 shadow-xl shadow-slate-900/50 flex items-center justify-center overflow-hidden relative shrink-0">
          <img 
            src={user.avatarUrl || getAvatar()} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Text Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
            স্বাগতম, <span className="text-cyan-400">{user.name}</span>
          </h1>
          <p className="text-white font-medium italic opacity-90 text-sm">
            "{quote}"
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Balance */}
        <Card className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-white/5">
          <CreditCard className="absolute right-[-20px] bottom-[-20px] text-blue-500/5 w-40 h-40 group-hover:text-blue-500/10 transition-colors duration-500" />
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-blue-500/10 rounded-xl backdrop-blur-md">
                 <CreditCard className="text-blue-500" size={24} />
               </div>
               <span className="text-slate-400 font-medium">বর্তমান ব্যালেন্স</span>
             </div>
             <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
               ৳ {balance.toLocaleString()}
             </p>
          </div>
        </Card>

        {/* Total Income */}
        <Card className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-white/5">
          <ArrowUpCircle className="absolute right-[-20px] bottom-[-20px] text-green-500/5 w-40 h-40 group-hover:text-green-500/10 transition-colors duration-500" />
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-green-500/10 rounded-xl backdrop-blur-md">
                 <ArrowUpCircle className="text-green-500" size={24} />
               </div>
               <span className="text-slate-400 font-medium">মোট আয়</span>
             </div>
             <p className="text-3xl font-bold text-white tracking-tight">৳ {totalIncome.toLocaleString()}</p>
          </div>
        </Card>

        {/* Total Expense - Red */}
        <Card className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-white/5">
          <ArrowDownCircle className="absolute right-[-20px] bottom-[-20px] text-red-600/5 w-40 h-40 group-hover:text-red-600/10 transition-colors duration-500" />
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-red-600/10 rounded-xl backdrop-blur-md">
                 <ArrowDownCircle className="text-red-500" size={24} />
               </div>
               <span className="text-slate-400 font-medium">মোট ব্যয়</span>
             </div>
             <p className="text-3xl font-bold text-white tracking-tight">৳ {totalExpense.toLocaleString()}</p>
          </div>
        </Card>

        {/* Total Savings - Now linked to Savings Page Data */}
        <Card className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-white/5">
          <Wallet className="absolute right-[-20px] bottom-[-20px] text-cyan-500/5 w-40 h-40 group-hover:text-cyan-500/10 transition-colors duration-500" />
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-cyan-500/10 rounded-xl backdrop-blur-md">
                 <Wallet className="text-cyan-500" size={24} />
               </div>
               <span className="text-slate-400 font-medium">মোট সঞ্চয়</span>
             </div>
             <p className="text-3xl font-bold text-white tracking-tight">৳ {totalSavings.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Comparison Chart */}
        <FinancialChart income={totalIncome} expense={totalExpense} savings={totalSavings} />
        
        {/* Distribution Chart (Pie/Doughnut) */}
        <DistributionChart income={totalIncome} expense={totalExpense} savings={totalSavings} />
      </div>

      {/* Developer Footer */}
      <footer className="mt-auto pt-8 pb-4 text-center border-t border-white/5">
        <a 
          href="https://rifat-hassan-premium-link-in-bio-wy.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900/50 border border-white/5 hover:bg-slate-800 transition-all text-slate-400 hover:text-cyan-400 group shadow-lg"
        >
          <span className="text-sm font-medium tracking-wide">Developed by Rifat Hassan</span>
          <div className="bg-cyan-500/10 p-1.5 rounded-full group-hover:bg-cyan-500/20 transition-colors">
            <Globe size={14} className="group-hover:rotate-12 transition-transform text-cyan-500" />
          </div>
        </a>
      </footer>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Add Transaction Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-fade-in-up">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">নতুন লেনদেন</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Switcher */}
              <div className="flex p-1 bg-slate-900 rounded-xl border border-white/5 mb-6">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                    type === 'expense' 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ব্যয় (Expense)
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                    type === 'income' 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  আয় (Income)
                </button>
              </div>

              <Input 
                label="লেনদেনের নাম / শিরোনাম" 
                placeholder="কি বাবদ লেনদেন?" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                autoFocus
              />

              <Input 
                label="টাকার পরিমাণ" 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />

              <div>
                <label className="block text-slate-400 text-sm mb-2 font-medium">তারিখ</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 text-white px-4 py-3 outline-none transition-all rounded-xl focus:border-cyan-500"
                    required
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                </div>
              </div>

              <Button type="submit" fullWidth className="py-4 mt-2">
                সেভ করুন
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;