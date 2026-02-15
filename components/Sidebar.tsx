import React from 'react';
import { ViewType } from '../types';
import { LayoutDashboard, StickyNote, Wallet, PiggyBank, GraduationCap, Settings, X, Calculator, Languages } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  userEmail?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onChangeView }) => {
  const menuItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <LayoutDashboard size={20} /> },
    { id: 'notes', label: 'নোট', icon: <StickyNote size={20} /> },
    { id: 'transactions', label: 'লেনদেন সমূহ', icon: <Wallet size={20} /> },
    { id: 'savings', label: 'সঞ্চয়', icon: <PiggyBank size={20} /> },
    { id: 'advisor', label: 'পরামর্শদাতা', icon: <GraduationCap size={20} /> },
    { id: 'calculator', label: 'ক্যালকুলেটর', icon: <Calculator size={20} /> },
    { id: 'language-exchange', label: 'ভাষা এক্সচেঞ্জ', icon: <Languages size={20} /> },
    { id: 'settings', label: 'সেটিং', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-[#0f172a] border-l border-white/5 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <h2 className="text-xl font-bold text-white tracking-tight">মেনু</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all rounded-xl font-medium ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;