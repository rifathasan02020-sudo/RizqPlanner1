import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { Copy, ArrowRightLeft, Languages, Check, RefreshCw } from 'lucide-react';

const LanguageExchange: React.FC = () => {
  const [mode, setMode] = useState<'bn2en' | 'en2bn'>('bn2en'); // bn2en = Bangla to Banglish
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // --- Converter Logic ---

  // Bangla to English Map (Phonetic)
  const bnToEnMap: Record<string, string> = {
    'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'ee', 'উ': 'u', 'ঊ': 'oo', 'ঋ': 'ri',
    'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'z', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh',
    'স': 's', 'হ': 'h', 'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y',
    'ৎ': 't', 'ং': 'ng', 'ঃ': ':', 'ঁ': '^',
    'া': 'a', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo', 'ৃ': 'ri',
    'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou', '্': ''
  };

  // English to Bangla Map (Phonetic keys)
  const enToBnConsonants: Record<string, string> = {
      'kh': 'খ', 'gh': 'ঘ', 'ng': 'ঙ', 'ch': 'চ', 'chh': 'ছ', 'jh': 'ঝ',
      'th': 'থ', 'dh': 'ধ', 'sh': 'শ', 'bh': 'ভ', 'ph': 'ফ',
      'k': 'ক', 'g': 'গ', 'j': 'জ', 't': 'ট', 'T': 'ট', 'd': 'ড', 'D': 'ড', 'n': 'ন', 'N': 'ণ',
      'p': 'প', 'f': 'ফ', 'b': 'ব', 'm': 'ম', 'z': 'য', 'r': 'র', 'l': 'ল', 's': 'স', 'h': 'হ',
      'R': 'ড়', 'y': 'য়', 'w': 'ও'
  };

  const enToBnVowels: Record<string, { independent: string, kar: string }> = {
      'oi': { independent: 'ঐ', kar: 'ৈ' },
      'ou': { independent: 'ঔ', kar: 'ৌ' },
      'oo': { independent: 'ঊ', kar: 'ূ' },
      'ee': { independent: 'ঈ', kar: 'ী' },
      'a': { independent: 'আ', kar: 'া' },
      'i': { independent: 'ই', kar: 'ি' },
      'u': { independent: 'উ', kar: 'ু' },
      'e': { independent: 'এ', kar: 'ে' },
      'o': { independent: 'অ', kar: 'ো' }, // Context dependent often
      'O': { independent: 'ও', kar: 'ো' }
  };

  const convertBnToEn = (text: string) => {
    return text.split('').map(char => bnToEnMap[char] || char).join('');
  };

  const convertEnToBn = (text: string) => {
    let res = "";
    let i = 0;
    let lastWasConsonant = false;

    // Sorting keys by length desc to match 'kh' before 'k'
    const sortedConsonants = Object.keys(enToBnConsonants).sort((a,b) => b.length - a.length);
    const sortedVowels = Object.keys(enToBnVowels).sort((a,b) => b.length - a.length);

    while (i < text.length) {
        const remaining = text.substr(i);

        // Check Vowels
        let matchedVowel = "";
        for (const v of sortedVowels) {
            if (remaining.toLowerCase().startsWith(v)) {
                matchedVowel = v;
                break;
            }
        }

        if (matchedVowel) {
            // If previous char was consonant, use Kar (except 'o' sometimes)
            // Handling 'o': if implied 'o', it usually maps to nothing or 'ো' if explicitly 'o'
            // For simplicity here: 'o' after consonant -> 'ো' (kar), at start -> 'অ'
            if (lastWasConsonant) {
                // Special case: 'o' often implies no kar (inherent vowel) or 'okar'.
                // Let's assume strict mapping for this tool: o -> ো
                if (matchedVowel === 'o') {
                   res += 'ো'; 
                } else {
                   res += enToBnVowels[matchedVowel].kar;
                }
            } else {
                res += enToBnVowels[matchedVowel].independent;
            }
            i += matchedVowel.length;
            lastWasConsonant = false;
            continue;
        }

        // Check Consonants
        let matchedConsonant = "";
        for (const c of sortedConsonants) {
            if (remaining.toLowerCase().startsWith(c)) {
                matchedConsonant = c;
                break;
            }
        }

        if (matchedConsonant) {
            res += enToBnConsonants[matchedConsonant];
            i += matchedConsonant.length;
            lastWasConsonant = true;
            continue;
        }

        // Fallback (Spaces, punctuation)
        res += text[i];
        i++;
        lastWasConsonant = false;
    }
    return res;
  };

  useEffect(() => {
    if (!input) {
        setOutput('');
        return;
    }
    const result = mode === 'bn2en' ? convertBnToEn(input) : convertEnToBn(input);
    setOutput(result);
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
      setInput('');
      setOutput('');
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
       <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
             <Languages size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">ভাষা এক্সচেঞ্জ</h2>
            <p className="text-slate-400 text-sm">সহজ বাংলা ও বাংলিশ কনভার্টার</p>
          </div>
       </div>

       {/* Toggle Switch */}
       <div className="grid grid-cols-2 gap-4 p-1 bg-slate-900 rounded-2xl border border-white/5">
           <button
             onClick={() => { setMode('bn2en'); setInput(''); }}
             className={`flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300 ${
                 mode === 'bn2en' 
                 ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' 
                 : 'text-slate-400 hover:text-white hover:bg-white/5'
             }`}
           >
             <span>Bangla to Banglish</span>
           </button>
           <button
             onClick={() => { setMode('en2bn'); setInput(''); }}
             className={`flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300 ${
                 mode === 'en2bn' 
                 ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' 
                 : 'text-slate-400 hover:text-white hover:bg-white/5'
             }`}
           >
             <span>Banglish to Bangla</span>
           </button>
       </div>

       {/* Converter Boards */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Input Board */}
           <Card className="flex flex-col h-full border-t-4 border-t-cyan-500">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-300 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                       ইনপুট (Input)
                   </h3>
                   <button onClick={handleClear} className="text-slate-500 hover:text-red-400 transition-colors" title="মুছুন">
                       <RefreshCw size={16} />
                   </button>
               </div>
               <textarea
                   className="w-full h-64 bg-slate-950/50 border border-slate-700 focus:border-cyan-500 text-white px-4 py-4 outline-none transition-all rounded-xl placeholder-slate-600 resize-none font-sans text-lg leading-relaxed"
                   placeholder={mode === 'bn2en' ? "এখানে বাংলা লিখুন... (যেমন: আমি ভাত খাই)" : "Type here in Banglish... (e.g., ami vat khai)"}
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   autoFocus
               />
               <p className="text-right text-xs text-slate-500 mt-2">
                   {input.length} characters
               </p>
           </Card>

           {/* Output Board */}
           <Card className="flex flex-col h-full border-t-4 border-t-emerald-500 bg-slate-800/40">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-300 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                       আউটপুট (Output)
                   </h3>
                   <button 
                       onClick={handleCopy} 
                       className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                           copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                       }`}
                   >
                       {copied ? <Check size={14} /> : <Copy size={14} />}
                       {copied ? 'কপি হয়েছে' : 'কপি করুন'}
                   </button>
               </div>
               <div className="w-full h-64 bg-black/20 border border-white/5 rounded-xl px-4 py-4 overflow-y-auto">
                   {output ? (
                       <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">{output}</p>
                   ) : (
                       <p className="text-slate-600 italic">ফলাফল এখানে দেখা যাবে...</p>
                   )}
               </div>
               <p className="text-right text-xs text-slate-500 mt-2">
                   Automatic Conversion
               </p>
           </Card>
       </div>
    </div>
  );
};

export default LanguageExchange;