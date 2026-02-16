
import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { getFinancialAdvice } from '../services/geminiService';
import { Bot, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { Transaction } from '../services/types';

interface AdvisorProps {
  transactions: Transaction[];
}

const COMMON_QUESTIONS = [
  "কিভাবে সঞ্চয় শুরু করব?",
  "জরুরী তহবিল কত টাকা রাখা উচিত?",
  "বাজেট করার সঠিক নিয়ম কি?",
  "ঋণ মুক্ত হওয়ার উপায় কি?",
  "বিনিয়োগ কোথায় করা ভালো?",
  "আয় বাড়ানোর উপায় কি?",
  "অপ্রয়োজনীয় খরচ কমানোর উপায়?",
  "দীর্ঘমেয়াদী আর্থিক পরিকল্পনা কি?",
  "শিক্ষার জন্য সঞ্চয় করব কিভাবে?",
  "অবসর জীবনের পরিকল্পনা কিভাবে করব?",
  "মূল্যস্ফীতি কি এবং কিভাবে বাঁচব?",
  "হালাল বিনিয়োগের মাধ্যমগুলো কি?"
];

const Advisor: React.FC<AdvisorProps> = ({ transactions }) => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const cleanResponse = (text: string) => {
    return text.replace(/[*#]/g, '');
  };

  const handleAsk = async (question: string) => {
    setIsLoading(true);
    setResponse(null);
    setActiveQuestion(question);

    try {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      const balance = totalIncome - totalExpense;
      
      const context = `Total Income: ${totalIncome}, Total Expense: ${totalExpense}, Balance: ${balance}`;
      const rawResponse = await getFinancialAdvice(question, context);
      setResponse(cleanResponse(rawResponse));
    } catch (err) {
      console.error(err);
      setResponse("একটি ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
       <div className="flex-none">
          <h2 className="text-2xl font-bold text-white mb-2">পরামর্শদাতা</h2>
          <p className="text-slate-400">আপনার আর্থিক প্রশ্নের স্মার্ট সমাধান</p>
       </div>

       <div className="grid grid-cols-1 gap-6">
         {!response && !isLoading && (
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-white/10 flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-cyan-500/10 rounded-full mb-4">
                 <Bot size={48} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">স্বাগতম রিজক অ্যাডভাইজরে</h3>
              <Button onClick={() => handleAsk("আমার আর্থিক অবস্থা বিশ্লেষণ করে পরামর্শ দিন।")} className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                <Sparkles size={20} className="inline mr-2" />
                আমার আর্থিক বিশ্লেষণ দেখুন
              </Button>
            </Card>
         )}

         {isLoading && (
            <Card className="flex flex-col items-center justify-center py-16 text-center border-cyan-500/20 bg-slate-900/40">
               <Loader2 size={48} className="animate-spin text-cyan-400 mb-4" />
               <p className="text-slate-300 font-medium">আপনার পরামর্শ তৈরি হচ্ছে...</p>
            </Card>
         )}

         {response && !isLoading && (
           <Card className="border-cyan-500/30 bg-slate-900/60 relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-cyan-400" />
                রিজক অ্যাডভাইস
              </h3>
              <div className="text-slate-200 text-lg leading-relaxed whitespace-pre-line">{response}</div>
              <div className="mt-8 flex justify-end">
                <Button variant="secondary" onClick={() => setResponse(null)} className="text-sm">অন্য প্রশ্ন জিজ্ঞাসা করুন</Button>
              </div>
           </Card>
         )}
       </div>

       {!isLoading && !response && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
           {COMMON_QUESTIONS.map((q, idx) => (
             <button key={idx} onClick={() => handleAsk(q)} className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-cyan-500/30 text-left text-slate-300 hover:text-white transition-all active:scale-95">
               {q}
             </button>
           ))}
         </div>
       )}
    </div>
  );
};

export default Advisor;
