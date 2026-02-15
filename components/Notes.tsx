import React, { useState } from 'react';
import { Note } from '../types';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { Plus, Trash2, StickyNote, PenLine } from 'lucide-react';

interface NotesProps {
  notes: Note[];
  onAdd: (title: string, content: string) => void;
  onDelete: (id: string) => void;
}

const Notes: React.FC<NotesProps> = ({ notes, onAdd, onDelete }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAdd(title, content);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
       <div className="flex justify-between items-center">
           <div>
               <h2 className="text-2xl font-bold text-white mb-1">আমার নোটপ্যাড</h2>
               <p className="text-slate-400 text-sm">গুরুত্বপূর্ণ তথ্য এবং পরিকল্পনা লিখে রাখুন</p>
           </div>
       </div>

       {/* Add Note Section */}
       <Card className="border-t-4 border-t-cyan-500">
           <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex items-center gap-2 mb-2 text-cyan-400">
                   <PenLine size={20} />
                   <h3 className="font-semibold">নতুন নোট তৈরি করুন</h3>
               </div>
               
               <Input 
                   label="শিরোনাম" 
                   value={title} 
                   onChange={e => setTitle(e.target.value)}
                   placeholder="যেমন: আগামী মাসের বাজেট"
               />
               
               <div>
                   <label className="block text-slate-400 text-sm mb-2 font-medium">মূল লেখা</label>
                   <textarea
                       className="w-full bg-slate-950/50 border border-slate-700 focus:border-cyan-500 text-white px-4 py-3 outline-none transition-all rounded-xl placeholder-slate-600 min-h-[120px] resize-y"
                       value={content}
                       onChange={e => setContent(e.target.value)}
                       placeholder="বিস্তারিত লিখুন..."
                   />
               </div>

               <div className="flex justify-end">
                   <Button type="submit" disabled={!title.trim() || !content.trim()}>
                       <div className="flex items-center gap-2">
                           <Plus size={18} />
                           <span>সেভ করুন</span>
                       </div>
                   </Button>
               </div>
           </form>
       </Card>

       {/* Notes Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {notes.length === 0 ? (
               <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                   <StickyNote size={48} className="mx-auto mb-4 opacity-20" />
                   <p>কোনো নোট পাওয়া যায়নি। একটি নতুন নোট যোগ করুন।</p>
               </div>
           ) : (
               [...notes].reverse().map(note => (
                   <div key={note.id} className="group relative bg-slate-900/80 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-slate-800/80 transition-all duration-300 shadow-lg hover:-translate-y-1">
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                               onClick={() => onDelete(note.id)}
                               className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                               title="নোট মুছুন"
                           >
                               <Trash2 size={16} />
                           </button>
                       </div>
                       
                       <h3 className="text-xl font-bold text-white mb-3 pr-8 leading-snug font-sans">
                           {note.title}
                       </h3>
                       
                       <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 opacity-50"></div>
                       
                       <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                           {note.content}
                       </p>
                       
                       {/* Date display removed as requested */}
                   </div>
               ))
           )}
       </div>
    </div>
  );
};

export default Notes;