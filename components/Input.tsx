import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-slate-400 text-sm mb-2 font-medium">{label}</label>
      <input
        className={`w-full bg-slate-950/50 border ${error ? 'border-red-500' : 'border-slate-700'} focus:border-cyan-500 text-white px-4 py-3 outline-none transition-all rounded-xl placeholder-slate-600 ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;