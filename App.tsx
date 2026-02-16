
import React, { useState, useEffect } from 'react';
import { User, Transaction, Note, SavingsEntry, ViewType } from './services/types';
import Landing from './components/Landing';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Advisor from './components/Advisor';
import Notes from './components/Notes';
import Transactions from './components/Transactions';
import Savings from './components/Savings';
import Calculator from './components/Calculator';
import LanguageExchange from './components/LanguageExchange';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';
import { AlignRight } from 'lucide-react';
import { APP_NAME_PREFIX, APP_NAME_SUFFIX, getAvatar } from './constants';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      const { data: txns } = await supabase.from('transactions').select('*').eq('user_id', userId);
      const { data: nts } = await supabase.from('notes').select('*').eq('user_id', userId);
      const { data: svs } = await supabase.from('savings').select('*').eq('user_id', userId);

      if (txns) setTransactions(txns);
      if (nts) setNotes(nts);
      if (svs) setSavings(svs);

      return profile;
    } catch (err) {
      console.error("Data fetch error:", err);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
         const profile = await fetchUserData(session.user.id);
         setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata?.name || 'User',
            avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || getAvatar(),
            password: profile?.saved_password || '' 
         });
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session) {
          setUser(null);
          setTransactions([]);
          setNotes([]);
          setSavings([]);
        } else if (!user) {
          const profile = await fetchUserData(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata?.name || 'User',
            avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || getAvatar(),
            password: profile?.saved_password || ''
          });
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (loggedInUser: User) => setUser(loggedInUser);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    if (!user) return;
    setUser(updatedUser);
    try {
        await supabase.from('profiles').update({
             name: updatedUser.name,
             avatar_url: updatedUser.avatarUrl,
             saved_password: updatedUser.password 
          }).eq('id', user.id);
    } catch (error) { console.error(error); }
  };

  const handleAddTransaction = async (newTxn: Transaction) => {
    const { data, error } = await supabase.from('transactions').insert([{
        user_id: user?.id,
        amount: newTxn.amount,
        type: newTxn.type,
        category: newTxn.category,
        date: newTxn.date,
    }]).select();
    
    if (data) setTransactions(prev => [...prev, data[0]]);
  };
  
  const deleteTransaction = async (id: string) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
      await supabase.from('transactions').delete().eq('id', id);
  };

  const addNote = async (title: string, content: string) => {
    if (!user) return;
    const { data } = await supabase.from('notes').insert([{ 
        user_id: user.id, 
        title, 
        content, 
        date: new Date().toISOString() 
    }]).select();
    if (data) setNotes(prev => [...prev, data[0]]);
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await supabase.from('notes').delete().eq('id', id);
  };

  const addSavings = async (amount: number, description: string) => {
    if (!user) return;
    const { data } = await supabase.from('savings').insert([{ 
        user_id: user.id, 
        amount, 
        description, 
        date: new Date().toISOString() 
    }]).select();
    if (data) setSavings(prev => [...prev, data[0]]);
  };

  const deleteSavings = async (id: string) => {
    setSavings(prev => prev.filter(s => s.id !== id));
    await supabase.from('savings').delete().eq('id', id);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">লোড হচ্ছে...</div>;
  if (!user) return <Landing onLogin={handleLogin} />;

  const isAdmin = user.email === 'admin@rizq.com' || user.email.includes('rifat');

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-30">
        <div className="text-2xl font-bold tracking-tight">
           <span className="text-white">{APP_NAME_PREFIX}</span>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{APP_NAME_SUFFIX}</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 transition-transform active:scale-95">
          <AlignRight className="text-white" size={32} />
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentView={currentView} onChangeView={setCurrentView} userEmail={user.email} />

      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
        {currentView === 'dashboard' && <Dashboard user={user} transactions={transactions} savings={savings} onAddTransaction={handleAddTransaction} />}
        {currentView === 'advisor' && <Advisor transactions={transactions} />}
        {currentView === 'notes' && <Notes notes={notes} onAdd={addNote} onDelete={deleteNote} />}
        {currentView === 'transactions' && <Transactions transactions={transactions} onDelete={deleteTransaction} />}
        {currentView === 'savings' && <Savings savings={savings} onAdd={addSavings} onDelete={deleteSavings} />}
        {currentView === 'calculator' && <Calculator />}
        {currentView === 'language-exchange' && <LanguageExchange />}
        {currentView === 'settings' && <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />}
        {(currentView as string) === 'admin' && isAdmin && <AdminPanel />}
      </main>
    </div>
  );
};

export default App;
