import React, { useState, useMemo } from 'react';
import { Transaction } from '../services/types';
import Card from './Card';
import { ArrowUpCircle, ArrowDownCircle, CreditCard, Trash2, Calendar, FileText } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState<'income' | 'expense'>('expense');

  // Calculate Summaries
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [transactions]);

  const filteredTransactions = transactions.filter(t => t.type === filter);

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      {/* Current Balance Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-white/5">
        <div className="relative z-10 flex flex-col items-center justify-center py-4">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-500/10 rounded-xl">
               <CreditCard className="text-blue-500" size={20} />
             </div>
             <span className="text-slate-400 font-medium">বর্তমান ব্যালেন্স</span>
           </div>
           <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
             ৳ {balance.toLocaleString()}
           </p>
        </div>
      </Card>

      {/* Toggle / Summary Tabs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setFilter('income')}
          className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 ${
            filter === 'income' 
              ? 'bg-emerald-900/30 border-emerald-500/50 shadow-lg shadow-emerald-900/20' 
              : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/50'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className={`text-sm font-medium ${filter === 'income' ? 'text-emerald-400' : 'text-slate-400'}`}>মোট আয়</span>
            <span className={`text-xl font-bold ${filter === 'income' ? 'text-white' : 'text-slate-300'}`}>
              ৳ {totalIncome.toLocaleString()}
            </span>
          </div>
          {filter === 'income' && <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500"></div>}
        </button>

        <button
          onClick={() => setFilter('expense')}
          className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 ${
            filter === 'expense' 
              ? 'bg-red-900/30 border-red-500/50 shadow-lg shadow-red-900/20' 
              : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/50'
          }`}
        >
           <div className="flex flex-col items-center gap-2">
            <span className={`text-sm font-medium ${filter === 'expense' ? 'text-red-400' : 'text-slate-400'}`}>মোট ব্যয়</span>
            <span className={`text-xl font-bold ${filter === 'expense' ? 'text-white' : 'text-slate-300'}`}>
              ৳ {totalExpense.toLocaleString()}
            </span>
          </div>
          {filter === 'expense' && <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500"></div>}
        </button>
      </div>

      {/* Filtered List */}
      <div className="space-y-4">
         <h3 className="text-lg font-semibold text-white px-1">
           {filter === 'income' ? 'আয়ের তালিকা' : 'ব্যয়ের তালিকা'}
         </h3>

         {filteredTransactions.length === 0 ? (
             <div className="text-center py-12 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                 <p className="text-slate-500">কোন লেনদেন তথ্য নেই।</p>
             </div>
         ) : (
             [...filteredTransactions].reverse().map(txn => (
                 <Card key={txn.id} className="flex flex-nowrap justify-between items-center p-4 hover:bg-slate-800/40 transition-all group border-l-4 border-l-transparent hover:border-l-cyan-500 overflow-hidden">
                     <div className="flex items-center gap-4 min-w-0 flex-1">
                         <div className={`p-3 rounded-xl shrink-0 ${txn.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {txn.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                         </div>
                         
                         {/* Text Wrapper: Description Top, Date Bottom, Left Aligned */}
                         <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                             <p className="font-bold text-white text-lg leading-tight truncate w-full text-left">{txn.category}</p>
                             <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                               <Calendar size={12} />
                               <span>{new Date(txn.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                             </div>
                         </div>
                     </div>
                     
                     <div className="flex items-center gap-4 ml-2 shrink-0">
                         <span className={`text-lg font-bold whitespace-nowrap ${txn.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                             {txn.type === 'income' ? '+' : '-'} ৳ {txn.amount.toLocaleString()}
                         </span>
                         <button 
                           onClick={() => onDelete(txn.id)} 
                           className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
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

export default Transactions;